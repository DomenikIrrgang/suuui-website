"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { cx } from "@/components/ui";
import s from "./page.module.css";

/*
 * On a phone the guide is a checklist to keep open next to the game: each step can be ticked off, and the
 * ticks are remembered on this device. The desktop layout shows neither the ticks nor their marks.
 */
const KEY = "suuui-guide-done";

const Progress = createContext<{ done: boolean[]; count: number; toggle: (index: number) => void }>({
  done: [],
  count: 0,
  toggle: () => {},
});

export function GuideProgress({ count, children }: { count: number; children: ReactNode }) {
  const [done, setDone] = useState<boolean[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(saved)) setDone(saved.map(Boolean));
    } catch {}
  }, []);

  const toggle = (index: number) =>
    setDone((before) => {
      const next = Array.from({ length: count }, (_, i) => !!before[i]);
      next[index] = !next[index];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

  return <Progress.Provider value={{ done, count, toggle }}>{children}</Progress.Provider>;
}

export function ProgressBar() {
  const { done, count } = useContext(Progress);
  const finished = done.filter(Boolean).length;
  return (
    <div className={cx(s.progress, "mobile-only")}>
      <span aria-hidden="true" className={s.progressTrack}>
        <span className={s.progressFill} style={{ width: `${Math.round((finished / count) * 100)}%` }} />
      </span>
      <span role="status" className={s.progressLabel}>
        {finished === count ? "All done" : `${finished} of ${count} done`}
      </span>
    </div>
  );
}

/** A step of the guide; it fades once ticked off. */
export function Step({ index, children }: { index: number; children: ReactNode }) {
  const { done } = useContext(Progress);
  return <li className={cx(s.step, done[index] && s.stepDone)}>{children}</li>;
}

export function DoneButton({ index, title }: { index: number; title: string }) {
  const { done, toggle } = useContext(Progress);
  const isDone = !!done[index];
  return (
    <button
      type="button"
      aria-pressed={isDone}
      aria-label={`${isDone ? "Mark as not done" : "Mark as done"}: ${title}`}
      onClick={() => toggle(index)}
      className={cx(s.doneButton, isDone && s.doneButtonOn, "mobile-only")}
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.5l4.5 4.5L19 7" />
      </svg>
      {isDone ? "Done" : "Done?"}
    </button>
  );
}
