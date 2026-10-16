// Parses the Markdown of a GitHub release into plain data the changelog renders.
// It covers what the release notes use: the version heading, an intro paragraph, "###" sections,
// nested "-" lists (two spaces per level), and **bold**, `code`, *emphasis* and [links](https://…).

export type Inline =
  | { kind: "text" | "strong" | "code" | "em"; text: string }
  | { kind: "link"; text: string; href: string };

export type NoteItem = {
  text: Inline[];
  children: NoteItem[];
  /** Paragraphs indented under the item, after its nested list */
  after: Inline[][];
};

export type NoteSection = { title: string; paragraphs: Inline[][]; items: NoteItem[] };

export type ReleaseNotes = {
  /** The date in the version heading, "## 0.3.0-beta.1 (2026-10-15)" */
  date?: string;
  intro: Inline[][];
  sections: NoteSection[];
};

const INLINE = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*([^*\s][^*]*?)\*/g;

export function parseInline(source: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of source.matchAll(INLINE)) {
    if (m.index > last) out.push({ kind: "text", text: source.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ kind: "strong", text: m[1] });
    else if (m[2] !== undefined) out.push({ kind: "code", text: m[2] });
    else if (m[3] !== undefined) {
      // Only absolute web links become links; anything else stays plain text.
      out.push(/^https?:\/\//.test(m[4]) ? { kind: "link", text: m[3], href: m[4] } : { kind: "text", text: m[3] });
    } else out.push({ kind: "em", text: m[5] });
    last = m.index + m[0].length;
  }
  if (last < source.length) out.push({ kind: "text", text: source.slice(last) });
  return out;
}

export function parseReleaseNotes(markdown: string): ReleaseNotes {
  const notes: ReleaseNotes = { intro: [], sections: [] };
  let section: NoteSection | null = null;
  let stack: NoteItem[] = []; // the open list item at each depth
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = parseInline(paragraph.join(" "));
    (section ? section.paragraphs : notes.intro).push(text);
    paragraph = [];
  };

  for (const raw of markdown.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.replace(/\s+$/, "");
    const indent = line.length - line.trimStart().length;
    const text = line.trim();

    if (!text) {
      flushParagraph();
      continue;
    }

    const version = /^##\s+\S+\s*\((\d{4}-\d{2}-\d{2})\)/.exec(text);
    if (/^##\s/.test(text) && !/^###/.test(text)) {
      flushParagraph();
      if (version) notes.date = version[1];
      continue;
    }

    const heading = /^###\s+(.+)$/.exec(text);
    if (heading) {
      flushParagraph();
      section = { title: heading[1].trim(), paragraphs: [], items: [] };
      notes.sections.push(section);
      stack = [];
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(text);
    if (bullet) {
      flushParagraph();
      if (!section) {
        section = { title: "", paragraphs: [], items: [] };
        notes.sections.push(section);
      }
      const depth = Math.min(Math.floor(indent / 2), stack.length);
      const item: NoteItem = { text: parseInline(bullet[1]), children: [], after: [] };
      if (depth === 0) section.items.push(item);
      else stack[depth - 1].children.push(item);
      stack = [...stack.slice(0, depth), item];
      continue;
    }

    if (indent > 0 && stack.length) {
      // A line indented under a list item: more of its text, or a paragraph after its nested list.
      const owner = stack[Math.min(Math.max(Math.floor(indent / 2) - 1, 0), stack.length - 1)];
      if (owner.children.length) owner.after.push(parseInline(text));
      else owner.text.push({ kind: "text", text: " " }, ...parseInline(text));
      continue;
    }

    stack = [];
    paragraph.push(text);
  }
  flushParagraph();
  return notes;
}

/** A one-line summary: the intro's first sentence, or the first few things the notes name in bold. */
export function summarize(notes: ReleaseNotes): string {
  const intro = notes.intro[0]?.map((part) => part.text).join("");
  if (intro) return /^[^.!?]*[.!?]/.exec(intro)?.[0] ?? intro;

  const first = notes.sections.find((s) => s.items.length);
  if (!first) return "";
  if (first.items.length === 1) {
    const text = first.items[0].text.map((part) => part.text).join("");
    return /^[^.!?]*[.!?]/.exec(text)?.[0] ?? text;
  }
  const names = first.items
    .map((item) => item.text.find((part) => part.kind === "strong")?.text.replace(/[:.]$/, ""))
    .filter((name): name is string => !!name);
  if (!names.length) return first.items[0].text.map((part) => part.text).join("");
  const shown = names.slice(0, 3);
  const list = shown.length > 1 ? `${shown.slice(0, -1).join(", ")} and ${shown.at(-1)}` : shown[0];
  return `${first.title ? `${first.title}: ` : ""}${list}${names.length > 3 ? ", and more" : ""}.`;
}
