"use client";

import { ClipFrame, GameIcon, type Ratio } from "./parts";
import { useTimeline } from "./useTimeline";
import s from "./clips.module.css";

const ICON = {
  improvedHealingWave: "/icons/healing-wave.png",
  tidalFocus: "/icons/tidal-focus.png",
  improvedReincarnation: "/icons/improved-reincarnation.png",
  tidalMastery: "/icons/tidal-mastery.png",
  naturesSwiftness: "/icons/natures-swiftness.png",
  ancestralHealing: "/icons/ancestral-healing.png",
  purification: "/icons/purification.png",
  manaTideTotem: "/icons/mana-tide-totem.png",
  healingWay: "/icons/healing-way.png",
};

/** Talents: points are planned in arcane until you press Apply. */
export function ClipTalents({ ratio }: { ratio?: Ratio }) {
  const { t, paused, toggle } = useTimeline(60, 34);
  const applied = t >= 50;
  const planA = t >= 10 ? (t >= 18 ? 2 : 1) : 0;
  const planB = t >= 26 ? 1 : 0;
  const planned = planA + planB;
  const pointsLeft = applied ? 0 : 3 - planned;
  const pending = planned > 0 && !applied;

  const node = (icon: string, learned: number, plan: number, max: number, locked: boolean) => {
    const isPlanned = plan > 0 && !applied;
    const total = learned + plan;
    const dim = locked && total === 0;
    return {
      icon,
      border: isPlanned ? "var(--arcane)" : "var(--gilt-hairline)",
      shadow: isPlanned ? "var(--glow-arcane)" : "none",
      filter: dim ? "grayscale(1) brightness(0.62)" : "none",
      opacity: dim ? 0.5 : 1,
      rank: `${total}/${max}`,
      rankColor: isPlanned ? "var(--arcane)" : total > 0 ? "var(--ink)" : "var(--ink-muted)",
    };
  };

  const nodes = [
    node(ICON.improvedHealingWave, 5, 0, 5, false),
    node(ICON.tidalFocus, 5, 0, 5, false),
    node(ICON.improvedReincarnation, 2, 0, 2, false),
    node(ICON.tidalMastery, 3, planA, 5, false),
    node(ICON.naturesSwiftness, 0, planB, 1, false),
    node(ICON.ancestralHealing, 3, 0, 3, false),
    node(ICON.purification, 0, 0, 5, true),
    node(ICON.manaTideTotem, 0, 0, 1, true),
    node(ICON.healingWay, 0, 0, 3, true),
  ];

  return (
    <ClipFrame label="Talents: points are planned in arcane until you press Apply" ratio={ratio} paused={paused} onToggle={toggle}>
      <div className={s.talents}>
        <div className={s.panelHead}>
          <span className={s.panelTitle}>Talents</span>
          <span className={s.panelSub}>Restoration</span>
          <span className={s.talentsLeft} style={{ color: pointsLeft > 0 ? "var(--arcane)" : "var(--ink-muted)" }}>
            {pointsLeft === 0 ? "No points to spend" : `${pointsLeft} ${pointsLeft === 1 ? "point" : "points"} to spend`}
          </span>
        </div>
        <div className={s.talentGrid}>
          {nodes.map((n) => (
            <div key={n.icon} className={s.talent} style={{ borderColor: n.border, boxShadow: n.shadow, opacity: n.opacity }}>
              <span className={s.talentArt}>
                <GameIcon src={n.icon} style={{ filter: n.filter }} />
              </span>
              <span className={s.talentRank} style={{ borderColor: n.border, color: n.rankColor }}>{n.rank}</span>
            </div>
          ))}
        </div>
        <div className={s.talentButtons}>
          <span className={s.talentUndo} style={{ opacity: pending ? 1 : 0.5 }}>Undo</span>
          <span
            className={s.talentApply}
            style={{ opacity: pending ? 1 : 0.5, boxShadow: pending ? "var(--glow-arcane)" : "none" }}
          >
            Apply
          </span>
        </div>
      </div>
    </ClipFrame>
  );
}
