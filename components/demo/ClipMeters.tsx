"use client";

import { ClipFrame, type Ratio } from "./parts";
import { useTimeline } from "./useTimeline";
import s from "./clips.module.css";

const PLAYERS = [
  { name: "Kaelith", color: "#69CCF0", rate: 965, base: 0 },
  { name: "Corvin", color: "#FFF569", rate: 1210, base: -10200 },
  { name: "Mirela", color: "#9482C9", rate: 874, base: 0 },
  { name: "Ysolde", color: "#F58CBA", rate: 702, base: 0 },
  { name: "Brannoc", color: "#C79C6E", rate: 488, base: 0 },
  { name: "Thessaly", color: "#0070DE", rate: 96, base: 0, you: true },
];

/** Damage meter: rows ranked by the game, updating live during a fight. */
export function ClipMeters({ ratio }: { ratio?: Ratio }) {
  const { t, paused, toggle } = useTimeline(60, 40);
  const sec = 38 + t / 10;
  const rows = PLAYERS.map((p) => ({ ...p, amount: p.rate * sec + p.base })).sort((a, b) => b.amount - a.amount);
  const top = rows[0].amount;
  const whole = Math.floor(sec);

  return (
    <ClipFrame
      label="Damage meter: rows ranked by the game, updating live during a fight"
      ratio={ratio}
      paused={paused}
      onToggle={toggle}
    >
      <div className={s.panel} style={{ left: "15cqw", top: "7cqw", width: "70cqw" }}>
        <div className={s.panelHead}>
          <span className={s.panelTitle}>Damage done</span>
          <span className={s.panelSub}>Current</span>
          <span className={s.meterClock}>
            {Math.floor(whole / 60)}:{String(whole % 60).padStart(2, "0")}
          </span>
        </div>
        <div className={s.meterRows}>
          {rows.map((p, i) => (
            <div key={p.name} className={s.meterRow} style={{ borderColor: p.you ? "var(--ink)" : "var(--gilt-hairline)" }}>
              <div className={s.meterFill} style={{ width: `${Math.round((p.amount / top) * 100)}%` }} />
              <div className={s.meterLine}>
                <span className={s.meterRank}>{i + 1}</span>
                <span className={s.meterMark} style={{ background: p.color }} />
                <span className={s.meterName} style={{ color: p.color }}>{p.name}</span>
                <span className={s.meterValue}>
                  {(p.amount / 1000).toFixed(1)}k ({Math.round(p.amount / sec)})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClipFrame>
  );
}
