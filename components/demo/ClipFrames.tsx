"use client";

import { ClipFrame, RoleIcon, ghostOf, pct, type Ratio, type Role } from "./parts";
import { useTimeline } from "./useTimeline";
import s from "./clips.module.css";

/** Party frames: a magic debuff lands on the mage, is removed, and a heal follows. */
export function ClipFrames({ ratio }: { ratio?: Ratio }) {
  const { t, paused, toggle } = useTimeline(50, 16);
  const bH = t >= 18 && t < 40 ? 74 : 96;
  const kH = t >= 10 && t < 36 ? 52 : 84;
  const kMagic = t >= 10 && t < 26;
  const kInc = t >= 26 && t < 36;

  const units: {
    name: string;
    color: string;
    role: Role;
    top: string;
    health: number;
    ghost?: { t: number; from: number; to: number };
    power?: string;
    powerColor?: string;
    magic?: boolean;
    inc?: boolean;
  }[] = [
    { name: "Brannoc", color: "#C79C6E", role: "tank", top: "8.2cqw", health: bH, ghost: { t: 18, from: 96, to: 74 }, power: "52%", powerColor: "#B4596B" },
    { name: "Thessaly", color: "#0070DE", role: "heal", top: "19.2cqw", health: 100, power: "78%", powerColor: "#4F78FF" },
    { name: "Kaelith", color: "#69CCF0", role: "dps", top: "30.2cqw", health: kH, ghost: { t: 10, from: 84, to: 52 }, magic: kMagic, inc: kInc },
    { name: "Ysolde", color: "#F58CBA", role: "dps", top: "41.2cqw", health: 92 },
  ];

  return (
    <ClipFrame
      label="Party frames: a magic debuff lands on the mage, is removed, and a heal follows"
      ratio={ratio}
      paused={paused}
      onToggle={toggle}
    >
      {units.map((u) => (
        <div
          key={u.name}
          className={s.frame}
          style={{ top: u.top, borderColor: u.magic ? "var(--dispel-magic)" : "var(--gilt-hairline)" }}
        >
          <div className={s.unitFill} style={{ width: pct(u.health) }} />
          <div className={s.ghost} style={ghostOf(t, u.ghost ? [u.ghost] : [], u.health)} />
          <div className={s.incoming} style={{ left: pct(u.health), width: u.inc ? "30%" : "0%" }} />
          <div className={s.framePower} style={{ width: u.power ?? "0%", background: u.powerColor ?? "transparent" }} />
          <div className={s.frameRow}>
            <RoleIcon role={u.role} color={u.role === "dps" ? "var(--ink-muted)" : "var(--ink)"} className={s.frameRole} />
            <span className={s.frameName} style={{ color: u.color }}>{u.name}</span>
            {u.magic && <span className={s.magic}>Magic</span>}
            <span className={s.framePct} style={{ marginLeft: u.magic ? 0 : "auto" }}>{pct(u.health)}</span>
          </div>
        </div>
      ))}
    </ClipFrame>
  );
}
