"use client";

import { createContext, useContext, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cx } from "./ui";
import s from "./Mobile.module.css";

/* Pieces of the phone layout: less on screen at once, and the rest a tap away. */

const chevron = (className?: string) => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/** The section in view: the last one whose top has passed just below the jump bar. */
function useCurrentSection(ids: string[], offset: number) {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      let active: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) active = id;
      }
      setCurrent(active);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids, offset]);

  return current;
}

/**
 * A bar that stays at the top of the screen and names the section in view. Tapped, it opens every section
 * of the page as a list to jump to.
 */
export function JumpNav({
  label,
  items,
  className,
}: {
  label: string;
  items: { href: string; label: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const listId = useId();
  const ids = useMemo(() => items.map((item) => item.href.replace(/^#/, "")), [items]);
  const current = useCurrentSection(ids, 96);
  const currentLabel = items.find((item) => item.href === `#${current}`)?.label;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <nav ref={root} aria-label={label} className={cx(s.jumpNav, className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        className={s.jumpButton}
        onClick={() => setOpen(!open)}
      >
        <span className={s.jumpLabel}>{label}</span>
        <span className={s.jumpCurrent}>{open ? "" : (currentLabel ?? "Jump to a section")}</span>
        {chevron(cx(s.jumpChevron, open && s.flipped))}
      </button>
      <ul id={listId} hidden={!open} className={s.jumpList}>
        {items.map((item) => {
          const isCurrent = item.href === `#${current}`;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={isCurrent ? "location" : undefined}
                className={cx(s.jumpLink, isCurrent && s.jumpLinkCurrent)}
                onClick={() => setOpen(false)}
              >
                <span aria-hidden="true" className={s.jumpDiamond} />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** A text button with a chevron: Read more, Show all, Show every phase… */
export function MoreButton({
  expanded,
  onClick,
  children,
  className,
}: {
  expanded: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button type="button" aria-expanded={expanded} onClick={onClick} className={cx(s.more, className)}>
      {children}
      {chevron(cx(s.moreChevron, expanded && s.flipped))}
    </button>
  );
}

/** A part of the page that shows less until it's opened. */
export function Expandable({
  more,
  less = "Show less",
  collapsed,
  expanded,
  buttonClassName,
}: {
  /** The button's label while collapsed */
  more: string;
  less?: string;
  collapsed: ReactNode;
  expanded: ReactNode;
  buttonClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open ? expanded : collapsed}
      <MoreButton expanded={open} onClick={() => setOpen(!open)} className={buttonClassName}>
        {open ? less : more}
      </MoreButton>
    </>
  );
}

/* ---------- Disclosures: rows that open to show their text ---------- */

type GroupState = { all: boolean | null; open: Record<string, boolean> };

const Group = createContext<{
  state: GroupState;
  setState: (update: (state: GroupState) => GroupState) => void;
} | null>(null);

/** Disclosures inside a group can all be opened or closed at once with its OpenAllButton. */
export function DisclosureGroup({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GroupState>({ all: null, open: {} });
  return <Group.Provider value={{ state, setState }}>{children}</Group.Provider>;
}

export function OpenAllButton({ open, close, className }: { open: string; close: string; className?: string }) {
  const group = useContext(Group);
  if (!group) return null;
  const all = !!group.state.all;
  return (
    <button
      type="button"
      aria-pressed={all}
      onClick={() => group.setState(() => ({ all: !all, open: {} }))}
      className={cx(s.more, className)}
    >
      {all ? close : open}
    </button>
  );
}

export function Disclosure({
  title,
  isNew,
  defaultOpen = false,
  size = "default",
  children,
}: {
  title: ReactNode;
  isNew?: boolean;
  defaultOpen?: boolean;
  /** `question` gives the taller rows of the FAQ */
  size?: "default" | "question";
  children: ReactNode;
}) {
  const id = useId();
  const group = useContext(Group);
  const [ownOpen, setOwnOpen] = useState(defaultOpen);

  let open = ownOpen;
  if (group) {
    const { all, open: overrides } = group.state;
    open = id in overrides ? overrides[id] : (all ?? defaultOpen);
  }
  const toggle = () =>
    group ? group.setState((state) => ({ ...state, open: { ...state.open, [id]: !open } })) : setOwnOpen(!open);

  return (
    <li className={s.disclosure}>
      <h3 className={s.disclosureHeading}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={toggle}
          className={cx(s.disclosureButton, size === "question" && s.question)}
        >
          <span className={s.disclosureTitle}>{title}</span>
          {isNew && <span className={s.newLabel}>New</span>}
          {chevron(cx(s.disclosureChevron, open && s.flipped))}
        </button>
      </h3>
      <div id={`${id}-panel`} hidden={!open} className={s.panel}>
        {children}
      </div>
    </li>
  );
}

/** The list that holds a run of disclosures. */
export function DisclosureList({ children, className }: { children: ReactNode; className?: string }) {
  return <ul className={cx(s.disclosures, className)}>{children}</ul>;
}
