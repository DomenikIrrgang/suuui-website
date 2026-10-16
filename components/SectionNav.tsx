"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cx } from "./ui";
import s from "./SectionNav.module.css";

type Item = { id: string; label: string; meta?: string };

/**
 * Side menu for a long page. The entry for the section currently in view is
 * highlighted; without JavaScript the first entry is.
 */
export function SectionNav({
  title,
  items,
  numeric,
  children,
}: {
  title: string;
  items: Item[];
  /** Tabular numbers and bold labels, for version lists. */
  numeric?: boolean;
  children?: ReactNode;
}) {
  const [current, setCurrent] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    // A section counts as current once its top passes 30% of the viewport.
    const update = () => {
      const line = window.innerHeight * 0.3;
      let active = sections[0]?.id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) active = section.id;
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
  }, [items]);

  const titleId = `${title.toLowerCase().replace(/\W+/g, "-")}-nav-title`;

  return (
    <nav aria-labelledby={titleId} className={s.nav}>
      <h2 id={titleId} className={s.title}>
        {title}
      </h2>
      <ul className={s.list}>
        {items.map((item) => (
          <li key={item.id} className={s.item}>
            <a
              href={`#${item.id}`}
              aria-current={item.id === current ? "location" : undefined}
              className={cx(s.link, numeric && s.numeric, item.id === current && s.current)}
            >
              <span>{item.label}</span>
              {item.meta && <span className={s.meta}>{item.meta}</span>}
            </a>
          </li>
        ))}
      </ul>
      {children}
    </nav>
  );
}
