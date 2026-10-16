"use client";

import { ClipFrame, GameIcon, OUT, POP, READY, SETTLE, cooling, type Ratio, type SlotState } from "./parts";
import { useTimeline } from "./useTimeline";
import s from "./clips.module.css";

const ICON = {
  clearcasting: "/icons/clearcasting.png",
  mageArmor: "/icons/mage-armor.png",
  arcaneIntellect: "/icons/arcane-intellect.png",
  arcanePower: "/icons/arcane-power.png",
  presenceOfMind: "/icons/presence-of-mind.png",
  fireBlast: "/icons/fire-blast.png",
  frostNova: "/icons/frost-nova.png",
  counterspell: "/icons/counterspell.png",
  blink: "/icons/blink.png",
  manaShield: "/icons/mana-shield.png",
  iceBlock: "/icons/ice-block.png",
  evocation: "/icons/evocation.png",
};

/** Cooldown Manager: a proc lights up, a cooldown counts down and pops back ready. */
export function ClipCooldowns({ ratio }: { ratio?: Ratio }) {
  const { t, paused, toggle } = useTimeline(60, 20);

  const timers: { icon: string; border: string; shadow: string; scale: string; transition: string; bar: string; time: string }[] = [];
  if (t >= 15 && t < 35) {
    timers.push({
      icon: ICON.clearcasting,
      border: "var(--arcane)",
      shadow: "var(--glow-arcane)",
      scale: t === 15 ? "0.86" : "1",
      transition: t === 15 ? "none" : `transform 180ms ${OUT}`,
      bar: `${Math.round(100 - (t - 15) * 5)}%`,
      time: String(15 - Math.floor((t - 15) / 10)),
    });
  }
  const resting = { border: "var(--gilt-hairline)", shadow: "none", scale: "1", transition: "none" };
  timers.push({ icon: ICON.mageArmor, ...resting, bar: "80%", time: "24m" });
  timers.push({ icon: ICON.arcaneIntellect, ...resting, bar: "68%", time: "41m" });

  const countdown = (start: number, end: number, label: string) => cooling((t - start) / (end - start), label);
  let fireBlast: SlotState = READY;
  if (t < 40) fireBlast = countdown(-8, 40, String(Math.ceil((40 - t) / 10)));
  else if (t === 40) fireBlast = POP;
  else if (t < 46) fireBlast = SETTLE;
  const frostNova = t >= 25 ? countdown(25, 275, String(25 - Math.floor((t - 25) / 10))) : READY;

  const essential = [
    { icon: ICON.arcanePower, ...READY },
    { icon: ICON.presenceOfMind, ...READY },
    { icon: ICON.fireBlast, ...fireBlast },
    { icon: ICON.frostNova, ...frostNova },
    { icon: ICON.counterspell, ...READY },
  ];
  const utility = [ICON.blink, ICON.manaShield, ICON.iceBlock, ICON.evocation];

  return (
    <ClipFrame
      label="Cooldown Manager: a proc lights up, a cooldown counts down and pops back ready"
      ratio={ratio}
      paused={paused}
      onToggle={toggle}
    >
      <div className={s.cdTimers}>
        {timers.map((a) => (
          <div
            key={a.icon}
            className={s.cdTimer}
            style={{ borderColor: a.border, boxShadow: a.shadow, transform: `scale(${a.scale})`, transition: a.transition }}
          >
            <GameIcon src={a.icon} />
            <div className={s.cdTimerBar} style={{ width: a.bar }} />
            <span className={s.cdTimerTime}>{a.time}</span>
          </div>
        ))}
      </div>
      <div className={s.cdEssential}>
        {essential.map((c) => (
          <div
            key={c.icon}
            className={s.cdBig}
            style={{ borderColor: c.border, boxShadow: c.shadow, transform: `scale(${c.scale})`, transition: c.transition }}
          >
            <GameIcon src={c.icon} style={{ filter: c.filter }} />
            <div className={s.sweep} style={{ background: c.sweep }} />
            {c.digits && <span className={s.cdDigits}>{c.digits}</span>}
          </div>
        ))}
      </div>
      <div className={s.cdUtility}>
        {utility.map((icon) => (
          <div key={icon} className={s.cdSmall}>
            <GameIcon src={icon} />
          </div>
        ))}
      </div>
    </ClipFrame>
  );
}
