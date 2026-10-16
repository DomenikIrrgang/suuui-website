"use client";

import { ClipFrame, type Ratio } from "./parts";
import { useTimeline } from "./useTimeline";
import s from "./clips.module.css";

/* Spell art from the WoW Forever client; the 116% background size crops the icons' own border. */
const ICON = {
  curseOfWeakness: "url(/icons/curse-of-weakness.png)",
  corruption: "url(/icons/corruption.png)",
  flameLash: "url(/icons/flame-lash.png)",
  shadowBolt: "url(/icons/shadow-bolt-volley.png)",
};

/** Nameplates: your target casts an interruptible spell, one mob is about to leave the tank, another pulls aggro. */
export function ClipNameplates({ ratio }: { ratio?: Ratio }) {
  const { t, paused, toggle } = useTimeline(50, 28);
  const a = (t % 25) / 25;
  const c = (t % 30) / 30;
  const losing = t >= 10 && t < 30;
  const aggro = t >= 25;

  return (
    <ClipFrame
      label="Nameplates: your target casts an interruptible spell, one mob is about to leave the tank, another pulls aggro"
      ratio={ratio}
      paused={paused}
      onToggle={toggle}
      stageClassName={s.npStage}
    >
      <div className={s.npTarget}>
        <div className={s.npAuras}>
          <div className={s.npAura} style={{ backgroundImage: ICON.curseOfWeakness }}>
            <span className={s.npAuraTime}>{18 - Math.floor(t / 10)}</span>
          </div>
          <div className={s.npAura} style={{ backgroundImage: ICON.corruption }}>
            <span className={s.npAuraTime}>12</span>
          </div>
        </div>
        <div className={s.npHead}>
          <span className={s.npName}>Cinder Acolyte</span>
          <span className={s.npPct}>62%</span>
        </div>
        <div className={s.npBar} style={{ borderColor: "var(--ink)" }}>
          <div className={s.unitFill} style={{ width: "62%" }} />
        </div>
        <div className={s.npCastArcane}>
          <div className={s.npCastArcaneFill} style={{ width: `${Math.round(a * 100)}%` }} />
        </div>
        <div className={s.npSpell}>
          <span className={s.npSpellIcon} style={{ borderColor: "var(--arcane)", backgroundImage: ICON.flameLash }} />
          <span className={s.nowrap}>Flame Lash</span>
          <span className={s.npKick} />
          <span className={s.npTime}>{((25 - (t % 25)) / 10).toFixed(1)}s</span>
        </div>
        <div className={s.npCastTarget}>
          <span className={s.muted}>›</span>
          <span style={{ color: "#69CCF0" }}>Kaelith</span>
        </div>
      </div>

      <div className={s.npOther} style={{ left: "4cqw", top: "36cqw" }}>
        <div className={s.npHeadRow}>
          <span className={s.npMarker} />
          <span className={s.npCount}>3/8</span>
          <span className={s.npName}>Ember Hound</span>
          {losing && <span className={s.npBadge} style={{ background: "var(--amber)" }}>Losing</span>}
          <span className={s.npPct} style={{ marginLeft: losing ? 0 : "auto" }}>81%</span>
        </div>
        <div className={s.npBar} style={{ borderColor: losing ? "var(--amber)" : "var(--gilt-hairline)" }}>
          <div className={s.unitFill} style={{ width: "81%" }} />
        </div>
      </div>

      <div className={s.npOther} style={{ left: "62cqw", top: "33cqw" }}>
        <div className={s.npHeadRow}>
          <span className={s.npName}>Ashbound Ritualist</span>
          {aggro && <span className={s.npBadge} style={{ background: "var(--ember)" }}>Aggro</span>}
          <span className={s.npPct} style={{ marginLeft: aggro ? 0 : "auto" }}>47%</span>
        </div>
        <div
          className={s.npBar}
          style={{
            borderColor: aggro ? "var(--ember)" : "var(--gilt-hairline)",
            boxShadow: aggro ? "0 0 10px #ff5a3673" : "none",
          }}
        >
          <div className={s.unitFill} style={{ width: "47%" }} />
        </div>
        <div className={s.npCastLocked}>
          <div className={s.npCastLockedFill} style={{ width: `${Math.round(c * 100)}%` }} />
          <svg viewBox="0 0 24 24" fill="none" stroke="#F1EADB" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={s.npLock}>
            <path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z" />
          </svg>
        </div>
        <div className={s.npSpell}>
          <span className={s.npSpellIcon} style={{ backgroundImage: ICON.shadowBolt }} />
          <span className={s.nowrap}>Shadow Bolt</span>
          <span className={s.npTime}>{((30 - (t % 30)) / 10).toFixed(1)}s</span>
        </div>
      </div>
    </ClipFrame>
  );
}
