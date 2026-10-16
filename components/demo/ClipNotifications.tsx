"use client";

import { ClipFrame, GameIcon, IN, IN_OUT, OUT, type Ratio } from "./parts";
import { useTimeline } from "./useTimeline";
import s from "./clips.module.css";

/** Notifications: a guild member comes online and joins the stack, then leaves by itself. */
export function ClipNotifications({ ratio }: { ratio?: Ratio }) {
  const { t, paused, toggle } = useTimeline(60, 20);
  const shown = t >= 10 && t < 40;
  const visible = shown && t !== 10;
  const slot = t >= 10 && t < 42;

  let transition = `opacity 180ms ${OUT}, transform 180ms ${OUT}`;
  if (t === 10) transition = "none";
  if (t >= 40) transition = `opacity 120ms ${IN}`;

  return (
    <ClipFrame
      label="Notifications: a guild member comes online and joins the stack, then leaves by itself"
      ratio={ratio}
      paused={paused}
      onToggle={toggle}
    >
      <div className={s.toast} style={{ top: "5cqw", padding: "2.2cqw", borderColor: "var(--amber)", overflow: "visible" }}>
        <span className={s.toastIcon}>
          <GameIcon src="/icons/backpack.png" />
        </span>
        <div className={s.toastText}>
          <span className={s.toastKind}>Bags</span>
          <span className={s.toastTitle}>Your bags are full</span>
          <span className={s.toastNote}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#A39B8B" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={s.toastNoteIcon}>
              <path d="M7 3h10M7 21h10M8 3v3l4 6-4 6v3M16 3v3l-4 6 4 6v3" />
            </svg>
            Goes when a slot is free
          </span>
        </div>
      </div>

      <div
        className={s.toast}
        style={{ top: "22cqw", opacity: visible ? 1 : 0, transform: `translateY(${visible ? "0cqw" : "-0.8cqw"})`, transition }}
      >
        <span className={s.toastIcon}>
          <GameIcon src="/icons/class-mage.png" />
        </span>
        <div className={s.toastText} style={{ flex: 1 }}>
          <span className={s.toastKind}>
            <span className={s.onlineMark} />
            Online · Guild
          </span>
          <span className={s.toastName}>Kaelith</span>
          <span className={s.toastKind}>Level 58 · Eastern Plaguelands</span>
        </div>
        <div className={s.toastActions}>
          <span className={s.toastButton}>Whisper</span>
          <span className={s.toastButton}>Invite</span>
        </div>
        <span className={s.drain} style={{ width: shown ? `${Math.round(100 - (t - 10) * (100 / 30))}%` : "100%" }} />
      </div>

      <div className={s.toast} style={{ top: slot ? "42.4cqw" : "22cqw", transition: `top 180ms ${IN_OUT}` }}>
        <span className={`${s.toastIcon} ${s.toastIconGlyph}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#3FD0FF" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={s.toastGlyph}>
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
        </span>
        <div className={s.toastText}>
          <span className={s.toastKind}>Quest</span>
          <span className={s.toastTitle}>Quest complete</span>
          <span className={s.toastKind}>Ember pelts · 10/10</span>
        </div>
        <span className={s.drain} style={{ width: `${Math.round(100 - t * (100 / 60))}%` }} />
      </div>
    </ClipFrame>
  );
}
