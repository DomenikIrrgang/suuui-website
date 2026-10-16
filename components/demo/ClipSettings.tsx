"use client";

import { ClipFrame, type Ratio } from "./parts";
import { useTimeline } from "./useTimeline";
import s from "./clips.module.css";

const UNITS = [
  { name: "Brannoc", color: "#C79C6E", health: 82 },
  { name: "Kaelith", color: "#69CCF0", health: 22 },
  { name: "Ysolde", color: "#F58CBA", health: 48 },
];

/** Settings: turning on Low-health tint changes the party frames in the preview at once. */
export function ClipSettings({ ratio }: { ratio?: Ratio }) {
  const { t, paused, toggle } = useTimeline(50, 30);
  const on = t >= 25;
  const tint = (h: number) => (on ? Math.max(0, Math.min(0.55, (0.55 * (70 - h)) / 60)) : 0);

  return (
    <ClipFrame
      label="Settings: turning on Low-health tint changes the party frames in the preview at once"
      ratio={ratio}
      paused={paused}
      onToggle={toggle}
    >
      <div className={s.settings}>
        <div className={s.settingsBody}>
          <span className={s.settingsTitle}>Party frames</span>
          <div className={s.option}>
            <div className={s.optionText}>
              <span className={s.optionLabel}>
                <span className={s.changedMark} style={{ opacity: on ? 1 : 0 }} />
                Low-health tint
              </span>
              <span className={s.optionHelp}>The empty part of the bar warms to ember from 70% down, strongest at 10%.</span>
            </div>
            <span
              className={s.switch}
              style={{
                borderColor: on ? "var(--arcane)" : "var(--gilt-line)",
                background: on ? "#0F1A1F" : "var(--surface-sunk)",
              }}
            >
              <span
                className={s.knob}
                style={{
                  background: on ? "var(--arcane)" : "var(--ink-muted)",
                  transform: `translateX(${on ? "4.4cqw" : "0cqw"}) rotate(45deg)`,
                }}
              />
            </span>
          </div>
          <span className={s.optionHelp}>Changes apply as you make them. No Apply button.</span>
        </div>
        <div className={s.preview}>
          {UNITS.map((u) => (
            <div key={u.name} className={s.previewUnit}>
              <div className={s.tint} style={{ left: `${u.health}%`, opacity: tint(u.health).toFixed(2) }} />
              <div className={s.unitFill} style={{ width: `${u.health}%` }} />
              <div className={s.previewRow}>
                <span className={s.previewName} style={{ color: u.color }}>{u.name}</span>
                <span className={s.previewPct}>{u.health}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClipFrame>
  );
}
