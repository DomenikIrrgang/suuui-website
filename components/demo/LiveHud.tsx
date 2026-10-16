"use client";

import { GameIcon, OUT, PlayToggle, POP, READY, RoleIcon, SETTLE, cooling, ghostOf, pct, type SlotState } from "./parts";
import { useTimeline } from "./useTimeline";
import s from "./LiveHud.module.css";

const LOW = "linear-gradient(90deg, #5A1E12, #B53D1E)";
const NORMAL = "linear-gradient(90deg, var(--unit-fill-deep), var(--unit-fill))";
const FADE = `opacity 240ms ${OUT}`;

const ICON = {
  riptide: "/icons/riptide.png",
  naturesSwiftness: "/icons/natures-swiftness.png",
  manaTideTotem: "/icons/mana-tide-totem.png",
  earthShock: "/icons/earth-shock.png",
  waterShield: "/icons/water-shield.png",
  manaSpringTotem: "/icons/mana-spring-totem.png",
  healingWave: "/icons/healing-wave.png",
  shadowBoltVolley: "/icons/shadow-bolt-volley.png",
};

type Unit = {
  name: string;
  color: string;
  role: "tank" | "dps";
  top: string;
  health: number;
  ghost: ReturnType<typeof ghostOf>;
  incoming?: boolean;
  power?: string;
  powerColor?: string;
  border?: string | null;
  shadow?: string | null;
  badge?: string | null;
  badgeColor?: string;
};

function captionAt(t: number) {
  if (t >= 20 && t < 34) return "The pull: the boss casts Shadow Volley. It can be interrupted, and your interrupt is ready.";
  if (t >= 34 && t < 36) return "Interrupted. Earth Shock starts its cooldown.";
  if (t >= 36 && t < 52) return "A poison you can remove lands on the tank: the border and the badge say so.";
  if (t >= 52 && t < 60) return "Cleansed. Healing Wave is on its way: the incoming heal shows after the health bar.";
  if (t >= 60 && t < 80) return "The mage pulls aggro: an ember border, a badge and an alert with the facts.";
  if (t >= 80 && t < 94) return "The tank takes the boss back. Earth Shock counts down in the Cooldown Manager.";
  if (t >= 94 && t < 98) return "Your interrupt is ready again: it pops back with an arcane edge.";
  if (t >= 98) return "The fight ends and everything settles back to rest.";
  return "Out of combat, every frame rests at 60%. Nothing asks for your attention.";
}

/** The home page's live HUD: one dungeon pull, 12 seconds, on a loop. */
export function LiveHud() {
  const { t, paused, toggle } = useTimeline(120, 62);
  const combat = t >= 20 && t < 98;
  const frameOpacity = combat ? 1 : 0.6;

  let bH = 100;
  if (t >= 20) bH = 92;
  if (t >= 36) bH = 64;
  if (t >= 66) bH = 89;
  if (t >= 98) bH = 100;
  const bPoison = t >= 36 && t < 52;

  let kH = 100;
  if (t >= 20) kH = 95;
  if (t >= 60) kH = 31;
  if (t >= 84) kH = 72;
  if (t >= 98) kH = 100;
  const kAggro = t >= 60 && t < 80;

  const yH = combat ? 88 : 100;

  const party: Unit[] = [
    {
      name: "Brannoc", color: "#C79C6E", role: "tank", top: "9.4cqw", health: bH,
      ghost: ghostOf(t, [{ t: 36, from: 92, to: 64 }], bH), incoming: t >= 52 && t < 66,
      power: combat ? "46%" : "0%", powerColor: "#B4596B",
      border: bPoison ? "#45E0A8" : null, badge: bPoison ? "Poison" : null, badgeColor: "#45E0A8",
    },
    {
      name: "Kaelith", color: "#69CCF0", role: "dps", top: "12.5cqw", health: kH,
      ghost: ghostOf(t, [{ t: 60, from: 95, to: 31 }], kH),
      border: kAggro ? "var(--ember)" : null, shadow: kAggro ? "0 0 10px #ff5a3673" : null,
      badge: kAggro ? "Aggro" : null, badgeColor: "var(--ember)",
    },
    { name: "Ysolde", color: "#F58CBA", role: "dps", top: "15.6cqw", health: yH, ghost: ghostOf(t, [], yH) },
  ];

  let shock: SlotState = READY;
  if (t >= 34 && t < 94) shock = cooling((t - 34) / 60, String(Math.ceil((94 - t) / 10)));
  else if (t === 94) shock = POP;
  else if (t >= 95 && t < 100) shock = SETTLE;
  const essential = [
    { icon: ICON.riptide, ...READY },
    { icon: ICON.naturesSwiftness, ...READY },
    { icon: ICON.manaTideTotem, ...READY },
    { icon: ICON.earthShock, ...shock },
  ];
  const buffs = [
    { icon: ICON.waterShield, time: "9m", bar: "90%" },
    {
      icon: ICON.manaSpringTotem,
      time: combat ? `1:${String(52 - Math.floor((t - 20) / 10)).padStart(2, "0")}` : "2:00",
      bar: combat ? `${Math.round(100 - (t - 20) / 1.2)}%` : "100%",
    },
  ];

  const castOn = t >= 22 && t < 34;
  const playerCastOn = t >= 52 && t < 66;
  const alert = t >= 60 && t < 80;
  const targetOn = t >= 20 && t < 96;
  const targetH = t >= 20 && t < 96 ? Math.max(1, 100 - (t - 20) * (99 / 76)) : 100;
  const playerPct = combat ? "94%" : "100%";

  return (
    <figure role="group" aria-label="Live demo of the SuuUI interface in a dungeon pull" className={s.hud}>
      <div aria-hidden="true" className={s.scene}>
        <div className={s.partyHeader} style={{ opacity: frameOpacity }}>
          <span className={s.partyLabel}>Party</span>
          <span className={s.partyRule} />
        </div>

        {party.map((u) => (
          <div
            key={u.name}
            className={s.unit}
            style={{
              top: u.top,
              opacity: frameOpacity,
              borderColor: u.border ?? "var(--gilt-hairline)",
              boxShadow: u.shadow ?? "none",
            }}
          >
            <div className={s.fill} style={{ width: pct(u.health), background: u.health < 35 ? LOW : NORMAL }} />
            <div className={s.ghost} style={u.ghost} />
            <div className={s.incoming} style={{ left: pct(u.health), width: u.incoming ? "25%" : "0%" }} />
            <div className={s.power} style={{ width: u.power ?? "0%", background: u.powerColor ?? "transparent" }} />
            <div className={s.unitRow}>
              <RoleIcon role={u.role} color={u.role === "tank" ? "var(--ink)" : "var(--ink-muted)"} className={s.role} />
              <span className={s.unitName} style={{ color: u.color }}>{u.name}</span>
              {u.badge && <span className={s.badge} style={{ background: u.badgeColor }}>{u.badge}</span>}
              <span className={s.unitPct} style={{ marginLeft: u.badge ? 0 : "auto" }}>{pct(u.health)}</span>
            </div>
          </div>
        ))}

        <div
          className={s.alert}
          style={{ opacity: alert ? 1 : 0, transform: `translate(-50%, ${alert ? "0" : "-0.55cqw"})` }}
        >
          <span className={s.alertTipLeft} />
          <span className={s.alertTipRight} />
          <span className={s.alertTitle}>Kaelith has drawn aggro</span>
          <span className={s.alertFacts}>108% threat · 31% health · Ice Block ready</span>
        </div>

        <div className={s.buffs} style={{ opacity: frameOpacity }}>
          {buffs.map((b) => (
            <div key={b.icon} className={s.buff}>
              <GameIcon src={b.icon} />
              <div className={s.buffBar} style={{ width: b.bar }} />
              <span className={s.buffTime}>{b.time}</span>
            </div>
          ))}
        </div>

        <div className={s.essential} style={{ opacity: frameOpacity }}>
          {essential.map((c) => (
            <div
              key={c.icon}
              className={s.cooldown}
              style={{ borderColor: c.border, boxShadow: c.shadow, transform: `scale(${c.scale})`, transition: c.transition }}
            >
              <GameIcon src={c.icon} style={{ filter: c.filter }} />
              <div className={s.sweep} style={{ background: c.sweep }} />
              {c.digits && <span className={s.digits}>{c.digits}</span>}
            </div>
          ))}
        </div>

        <div className={s.playerCast} style={{ opacity: playerCastOn ? 1 : 0 }}>
          <div className={s.castIcon}>
            <GameIcon src={ICON.healingWave} />
          </div>
          <div className={s.castBar}>
            <div className={s.castFill} style={{ width: `${Math.round((playerCastOn ? (t - 52) / 14 : 0) * 100)}%` }} />
            <div className={s.castRow}>
              <span className={s.nowrap}>
                Healing Wave <span className={s.muted}>›</span> <span style={{ color: "#C79C6E" }}>Brannoc</span>
              </span>
              <span className={s.castTime}>{playerCastOn ? `${((14 - (t - 52)) / 10).toFixed(1)}s` : ""}</span>
            </div>
          </div>
        </div>

        <div className={s.player} style={{ opacity: frameOpacity }}>
          <div className={s.playerClip}>
            <div className={s.fill} style={{ width: playerPct, background: NORMAL }} />
            <div className={s.mana} style={{ width: combat ? `${Math.round(100 - (t - 20) * 0.35)}%` : "100%" }} />
            <div className={s.anchorInset} />
          </div>
          <span className={s.cornerTopLeft} />
          <span className={s.cornerBottomRight} />
          <div className={s.playerRow}>
            <RoleIcon role="heal" color="var(--ink)" className={s.playerRole} />
            <span className={s.playerName}>Thessaly</span>
            <span className={s.playerPct}>{playerPct}</span>
          </div>
        </div>

        <div className={s.target} style={{ opacity: targetOn ? 1 : 0 }}>
          <div className={s.targetBar}>
            <div className={s.fill} style={{ width: pct(targetH), background: NORMAL }} />
            <div className={s.targetRow}>
              <span className={s.targetMark} />
              <span className={s.targetName}>Ashmaw the Devourer</span>
              <span className={s.targetLevel}>?? Boss</span>
              <span className={s.targetPct}>{pct(targetH)}</span>
            </div>
          </div>
          <div className={s.targetCast} style={{ opacity: castOn ? 1 : 0 }}>
            <div className={s.enemyCastIcon}>
              <GameIcon src={ICON.shadowBoltVolley} />
            </div>
            <div className={s.enemyCastBar}>
              <div className={s.enemyCastFill} style={{ width: `${Math.round((castOn ? (t - 22) / 16 : 0) * 100)}%` }} />
              <div className={s.enemyCastRow}>
                <span className={s.nowrap}>Shadow Volley</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="#3FD0FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={s.interruptible}>
                  <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8.5 8.5l7 7M15.5 8.5l-7 7" />
                </svg>
                <span className={s.castTime}>{castOn ? `${((16 - (t - 22)) / 10).toFixed(1)}s` : ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <figcaption className={s.caption}>
        <span aria-hidden="true" className={s.captionLabel}>Live demo</span>
        <span className={s.captionText}>{captionAt(t)}</span>
        <PlayToggle paused={paused} onToggle={toggle} noun="demo" className={s.toggle} />
      </figcaption>
    </figure>
  );
}
