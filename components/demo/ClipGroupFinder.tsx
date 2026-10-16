"use client";

import { ClipFrame, IN_OUT, OUT, RoleIcon, type Ratio, type Role } from "./parts";
import { useTimeline } from "./useTimeline";
import s from "./clips.module.css";

const ROLES: Role[] = ["tank", "heal", "dps", "dps", "dps"];
const HAVE = "#7A7264";
const NEED = "var(--ink)";
const MINE = "var(--arcane)";
const STEP = 10.4;

const LISTED = [
  { title: "Scarlet Monastery: Cathedral", sub: "Aldric · Group Finder · 2m", size: "4/5", have: [1, 1, 1, 1, 0] },
  { title: "Wailing Caverns", sub: "Ysolde · Trade · 6m", size: "2/5", have: [0, 1, 1, 0, 0] },
  { title: "Hall of Thanes", sub: "Corvin · Group Finder · 9m", size: "1/5", have: [0, 1, 0, 0, 0] },
];

/** Group Finder: a new group that needs your role appears at the top of the list. */
export function ClipGroupFinder({ ratio }: { ratio?: Ratio }) {
  const { t, paused, toggle } = useTimeline(60, 30);
  const shown = t >= 15 && t < 50;
  const entering = t === 15;

  const rows = [
    {
      title: "Razorfen Kraul",
      sub: "Needs a healer · Kessra · LookingForGroup · now",
      subColor: "var(--arcane)",
      size: "3/5",
      have: [1, 0, 1, 1, 0],
      border: "var(--arcane)",
      top: "0cqw",
      opacity: shown && !entering ? 1 : 0,
      dy: shown && !entering ? "0cqw" : "-0.8cqw",
      transition: entering ? "none" : `opacity 180ms ${OUT}, transform 180ms ${OUT}`,
    },
    ...LISTED.map((r, i) => ({
      ...r,
      subColor: "var(--ink-muted)",
      border: "var(--gilt-hairline)",
      top: `${(shown ? i + 1 : i) * STEP}cqw`,
      opacity: 1,
      dy: "0cqw",
      transition: `top 180ms ${IN_OUT}`,
    })),
  ];

  return (
    <ClipFrame
      label="Group Finder: a new group that needs your role appears at the top of the list"
      ratio={ratio}
      paused={paused}
      onToggle={toggle}
    >
      <div className={s.panel} style={{ left: "6cqw", top: "4.5cqw", width: "88cqw", height: "53cqw" }}>
        <div className={s.panelHead}>
          <span className={s.panelTitle}>Group Finder</span>
          <span className={s.panelSub}>Browse · listed as healer</span>
        </div>
        <div className={s.lfgList}>
          {rows.map((r) => (
            <div
              key={r.title}
              className={s.lfgRow}
              style={{
                top: r.top,
                borderColor: r.border,
                opacity: r.opacity,
                transform: `translateY(${r.dy})`,
                transition: r.transition,
              }}
            >
              <div className={s.lfgText}>
                <span className={s.lfgTitle}>{r.title}</span>
                <span className={s.lfgSub} style={{ color: r.subColor }}>{r.sub}</span>
              </div>
              <div className={s.lfgSlots}>
                {ROLES.map((role, i) => (
                  <RoleIcon
                    key={i}
                    role={role}
                    strokeWidth={2.2}
                    color={r.have[i] ? HAVE : role === "heal" ? MINE : NEED}
                    className={s.lfgSlot}
                  />
                ))}
              </div>
              <span className={s.lfgSize}>{r.size}</span>
            </div>
          ))}
        </div>
      </div>
    </ClipFrame>
  );
}
