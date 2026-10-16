import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, CSSProperties, HTMLAttributes, ReactNode } from "react";
import s from "./ui.module.css";

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/* ---------- Layout ---------- */

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx(s.container, className)} {...props} />;
}

type SectionProps = ComponentProps<"section"> & {
  tight?: boolean;
  /** A raised band: a lighter panel between gilt rules, with a jewel on the top rule. */
  band?: boolean;
};

export function Section({ tight, band, className, children, ...props }: SectionProps) {
  return (
    <section className={cx(tight ? s.sectionTight : s.section, band && s.band, className)} {...props}>
      {band && <BandJewel />}
      <Container>{children}</Container>
    </section>
  );
}

/** For sections with their own markup: the band's class, and the jewel to put first inside it. */
export const bandClass = s.band;

export function BandJewel() {
  return <span aria-hidden="true" className={s.bandJewel} />;
}

/* ---------- Type ---------- */

export function Eyebrow({ children, as: Tag = "span" }: { children: ReactNode; as?: "span" | "h2" }) {
  return (
    <div className={s.eyebrow}>
      <Tag className={s.eyebrowLabel} style={Tag === "h2" ? { fontWeight: 400 } : undefined}>
        {children}
      </Tag>
      <span aria-hidden="true" className={s.eyebrowRule} />
    </div>
  );
}

type HeadingProps = ComponentProps<"h2"> & {
  level?: 1 | 2 | 3;
  size?: "h1" | "h2" | "h2Small" | "h3";
};

/** A heading in the display face (Marcellus SC). */
export function Heading({ level = 2, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  const sizeClass = s[size ?? (level === 1 ? "h1" : level === 2 ? "h2" : "h3")];
  return <Tag className={cx(s.display, sizeClass, className)} {...props} />;
}

export function Lead({ className, ...props }: ComponentProps<"p">) {
  return <p className={cx(s.lead, className)} {...props} />;
}

export function Sublead({ className, ...props }: ComponentProps<"p">) {
  return <p className={cx(s.sublead, className)} {...props} />;
}

export function Body({ className, ...props }: ComponentProps<"p">) {
  return <p className={cx(s.body, className)} {...props} />;
}

export function Strong({ className, ...props }: ComponentProps<"strong">) {
  return <strong className={cx(s.strong, className)} {...props} />;
}

export function Code({ className, ...props }: ComponentProps<"code">) {
  return <code className={cx(s.code, className)} {...props} />;
}

/** Eyebrow plus section title, the opening of most sections. */
export function SectionHeader({
  eyebrow,
  title,
  id,
  size = "h2",
  className,
}: {
  eyebrow: string;
  title: string;
  id?: string;
  size?: "h2" | "h2Small";
  className?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading id={id} size={size} className={s.sectionTitle}>
        {title}
      </Heading>
    </div>
  );
}

/**
 * The standard top of an inner page: eyebrow, h1, lead and optional extras.
 * `compact` tightens the space below it, for pages whose first section follows straight on.
 */
export function PageIntro({
  eyebrow,
  title,
  lead,
  leadWidth,
  compact,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  lead: ReactNode;
  /** Max width of the lead in px (default 680). */
  leadWidth?: number;
  compact?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby="page-title" className={cx(s.intro, compact && s.introCompact, className)}>
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading level={1} id="page-title">
          {title}
        </Heading>
        <Lead style={leadWidth ? { maxWidth: leadWidth } : undefined}>{lead}</Lead>
        {children}
      </Container>
    </section>
  );
}

/* ---------- Buttons ---------- */

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: "primary" | "secondary";
  size?: "default" | "small";
  className?: string;
};

export function ButtonLink({ variant = "secondary", size = "default", className, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cx(s.button, s[variant], size === "small" && s.small, className)}
      {...props}
    />
  );
}

export function ButtonRow({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx(s.buttonRow, className)} {...props} />;
}

export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return <Link className={cx(s.textLink, className)} {...props} />;
}

/* ---------- Cards and grids ---------- */

export function Card({ className, ...props }: ComponentProps<"article">) {
  return <article className={cx(s.card, className)} {...props} />;
}

/** Auto-fitting grid; `min` is the narrowest a column may get. */
export function Grid({
  min = 300,
  as: Tag = "div",
  className,
  style,
  ...props
}: HTMLAttributes<HTMLElement> & { min?: number; as?: "div" | "ol" | "ul" }) {
  return (
    <Tag className={cx(s.grid, className)} style={{ "--min": `${min}px`, ...style } as CSSProperties} {...props} />
  );
}

/* ---------- Ornaments ---------- */

export function Diamond({
  size = 8,
  variant = "gilt",
  className,
  style,
}: {
  size?: number;
  variant?: "gilt" | "outline" | "arcane";
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        s.diamond,
        variant === "outline" && s.diamondOutline,
        variant === "arcane" && s.diamondArcane,
        className,
      )}
      style={{ "--size": `${size}px`, ...style } as CSSProperties}
    />
  );
}

export function Tag({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span className={s.tag} style={style}>
      {children}
    </span>
  );
}

/** A list with small gilt diamonds as bullets. */
export function BulletList({
  items,
  gap = 10,
  size = 5,
  className,
}: {
  items: ReactNode[];
  gap?: number;
  size?: number;
  className?: string;
}) {
  return (
    <ul className={cx(s.bullets, className)} style={{ gap }}>
      {items.map((item, i) => (
        <li key={i} className={s.bullet}>
          <Diamond size={size} />
          <span className={s.body}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Screenshots ---------- */

type ScreenshotProps = {
  caption: string;
  variant?: "hero" | "card" | "wide";
  /** Path under /public. Until a real screenshot exists, a labelled frame stands in. */
  src?: string;
  className?: string;
};

export function Screenshot({ caption, variant = "card", src, className }: ScreenshotProps) {
  const variantClass = { hero: s.shotHero, card: s.shotCard, wide: s.shotWide }[variant];
  return (
    <figure className={cx(s.shot, variantClass, className)}>
      {variant === "hero" && (
        <>
          <span aria-hidden="true" className={cx(s.corner, s.cornerTopLeft)} />
          <span aria-hidden="true" className={cx(s.corner, s.cornerBottomRight)} />
        </>
      )}
      {src ? (
        <Image src={src} alt={caption} fill sizes="(max-width: 1200px) 100vw, 1200px" className={s.shotImage} />
      ) : (
        <>
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A39B8B"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="16" rx="1" />
            <circle cx="9" cy="10" r="2" />
            <path d="M21 16l-5-5-9 9" />
          </svg>
          <span className={s.shotLabel}>Screenshot</span>
          <figcaption className={s.shotCaption}>{caption}</figcaption>
        </>
      )}
    </figure>
  );
}

/* ---------- Roadmap status ---------- */

export type Status = "done" | "next" | "planned";

const statusLabel: Record<Status, string> = { done: "Done", next: "Next", planned: "Planned" };

export function StatusList({
  items,
  itemClassName,
  className,
  style,
}: {
  items: { status: Status; text: string }[];
  itemClassName?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <ul className={cx(s.statusList, className)} style={style}>
      {items.map((item) => (
        <li key={item.text} className={cx(s.statusItem, itemClassName)}>
          <span
            className={cx(
              s.status,
              item.status === "next" && s.statusNext,
              item.status === "planned" && s.statusPlanned,
            )}
          >
            <Diamond variant={item.status === "done" ? "gilt" : item.status === "next" ? "arcane" : "outline"} />
            {statusLabel[item.status]}
          </span>
          <p className={cx(s.statusText, item.status === "next" && s.statusTextNext)}>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Code blocks ---------- */

/** Lines starting with "--" or "#" render as comments. */
export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const lines = code.replace(/^\n|\n$/g, "").split("\n");
  return (
    <div className={cx(s.codeBlock, className)}>
      <pre>
        <code>
          {lines.map((line, i) => {
            const trimmed = line.trimStart();
            const isComment = trimmed.startsWith("--") || trimmed.startsWith("#");
            return (
              <span key={i} className={isComment ? s.comment : undefined}>
                {line}
                {"\n"}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
