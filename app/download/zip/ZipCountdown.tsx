"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import s from "./page.module.css";

const TICKS = 50; // 5 seconds in 100 ms steps
const CIRCUMFERENCE = 326.73; // 2π × 52, the ring's radius

/** Counts down, then starts the zip download from GitHub. "Download now" skips the wait. */
export function ZipCountdown({ version, zipUrl, releaseUrl }: { version: string; zipUrl: string; releaseUrl: string }) {
  const [t, setT] = useState(TICKS);
  const started = useRef(false);

  useEffect(() => {
    if (t <= 0) return;
    const id = setTimeout(() => setT((v) => v - 1), 100);
    return () => clearTimeout(id);
  }, [t]);

  // The browser tab counts down with the page, and gets its own title back when you leave.
  useEffect(() => {
    const original = document.title;
    return () => {
      document.title = original;
    };
  }, []);

  useEffect(() => {
    document.title = t > 0 ? `${Math.ceil(t / 10)} · Downloading SuuUI` : "Download started · SuuUI";
  }, [t]);

  useEffect(() => {
    if (t > 0 || started.current) return;
    started.current = true;
    window.location.assign(zipUrl);
  }, [t, zipUrl]);

  const startNow = useCallback(() => setT(0), []);

  const done = t <= 0;
  const secs = Math.ceil(t / 10);

  return (
    <div className={s.status}>
      <span aria-hidden="true" className={s.cornerTopLeft} />
      <span aria-hidden="true" className={s.cornerBottomRight} />

      <div aria-hidden="true" className={s.ring} data-done={done || undefined}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" className={s.ringTrack} />
          <circle
            cx="60"
            cy="60"
            r="52"
            className={s.ringFill}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={done ? 0 : (CIRCUMFERENCE * (1 - t / TICKS)).toFixed(2)}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <span className={s.ringCenter}>
          {done ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 12.5l4 4L18 8" />
            </svg>
          ) : (
            secs
          )}
        </span>
      </div>

      <div className={s.statusText}>
        <p className={s.what}>
          SuuUI <span className={s.whatVersion}>{version}</span> for WoW Forever, from GitHub
        </p>
        {done ? (
          <>
            <p className={s.headline}>Your download has started</p>
            <p className={s.detail}>
              Look for the SuuUI zip in your Downloads folder. If nothing happened,{" "}
              <a href={releaseUrl}>download it from GitHub directly</a>.
            </p>
          </>
        ) : (
          <>
            <p className={s.headline}>
              Your download starts in {secs} {secs === 1 ? "second" : "seconds"}
            </p>
            <p className={s.detail}>While it downloads, the steps below get it into the game.</p>
            <button type="button" onClick={startNow} className={s.now}>
              Download now
            </button>
          </>
        )}
        <span role="status" className="visually-hidden">
          {done ? "Your download has started." : ""}
        </span>
      </div>
    </div>
  );
}
