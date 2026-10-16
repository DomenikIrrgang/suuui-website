import { Code, Diamond, Strong } from "@/components/ui";
import type { Inline, NoteItem, ReleaseNotes as Notes } from "@/lib/release-notes";
import s from "./page.module.css";

function Text({ parts }: { parts: Inline[] }) {
  return parts.map((part, i) => {
    switch (part.kind) {
      case "strong":
        return <Strong key={i}>{part.text}</Strong>;
      case "code":
        return <Code key={i}>{part.text}</Code>;
      case "em":
        return <em key={i}>{part.text}</em>;
      case "link":
        return (
          <a key={i} href={part.href}>
            {part.text}
          </a>
        );
      default:
        return part.text;
    }
  });
}

function Items({ items, nested = false }: { items: NoteItem[]; nested?: boolean }) {
  return (
    <ul className={nested ? s.details : s.items}>
      {items.map((item, i) => (
        <li key={i} className={nested ? s.detail : s.item}>
          <Diamond size={5} variant={nested ? "outline" : "gilt"} className={s.bullet} />
          <div className={s.itemText}>
            <Text parts={item.text} />
            {item.children.length > 0 && <Items items={item.children} nested />}
            {item.after.map((paragraph, j) => (
              <p key={j} className={s.itemAfter}>
                <Text parts={paragraph} />
              </p>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** A release's notes from GitHub: an optional intro, then its sections (New, Changed, Fixed…). */
export function ReleaseNotes({ notes }: { notes: Notes }) {
  return (
    <>
      {notes.intro.map((paragraph, i) => (
        <p key={i} className={s.entryIntro}>
          <Text parts={paragraph} />
        </p>
      ))}
      {notes.sections.map((section, i) => (
        <section key={i} aria-label={section.title || undefined}>
          {section.title && <h3 className={s.groupTitle}>{section.title}</h3>}
          {section.paragraphs.map((paragraph, j) => (
            <p key={j} className={s.sectionText}>
              <Text parts={paragraph} />
            </p>
          ))}
          {section.items.length > 0 && <Items items={section.items} />}
        </section>
      ))}
    </>
  );
}
