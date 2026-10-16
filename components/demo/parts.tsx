import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/components/ui";
import s from "./demo.module.css";

export type Ratio = "16 / 10" | "21 / 9";

/** The arcane ease-out and the ember ease-in the design uses for state changes. */
export const OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
export const IN = "cubic-bezier(0.7, 0, 0.84, 0)";
export const IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

export const pct = (v: number) => `${Math.round(v)}%`;

export function PlayToggle({
  paused,
  onToggle,
  noun = "animation",
  className,
}: {
  paused: boolean;
  onToggle: () => void;
  noun?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? `Play the ${noun}` : `Pause the ${noun}`}
      className={cx(s.toggle, className)}
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d={paused ? "M8 5l11 7-11 7V5z" : "M8 5v14M16 5v14"} />
      </svg>
    </button>
  );
}

/**
 * A motion clip: a 16:10 stage, sized by height and centred, inside a frame of the chosen ratio.
 * Everything on the stage is sized in cqw of the stage.
 */
export function ClipFrame({
  label,
  ratio = "16 / 10",
  paused,
  onToggle,
  stageClassName,
  children,
}: {
  label: string;
  ratio?: Ratio;
  paused: boolean;
  onToggle: () => void;
  stageClassName?: string;
  children: ReactNode;
}) {
  return (
    <figure role="group" aria-label={label} className={s.clip} style={{ aspectRatio: ratio }}>
      <div aria-hidden="true" className={cx(s.stage, stageClassName)}>
        {children}
      </div>
      <PlayToggle paused={paused} onToggle={onToggle} className={s.clipToggle} />
    </figure>
  );
}

/** A spell or item icon from the game, enlarged a little so its own dark rim is cropped by the slot. */
export function GameIcon({ src, style }: { src: string; style?: CSSProperties }) {
  return (
    <span className={s.iconLayer} style={style}>
      <img src={src} alt="" className={s.icon} />
    </span>
  );
}

export type Role = "tank" | "heal" | "dps";

const rolePath: Record<Role, string> = {
  tank: "M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z",
  heal: "M12 5v14M5 12h14",
  dps: "M19 5L9 15M19 5h-4M19 5v4M7 13l4 4M8.5 15.5L5 19",
};

/** SuuUI's own role marks, drawn as strokes. */
export function RoleIcon({
  role,
  color,
  strokeWidth,
  className,
}: {
  role: Role;
  color: string;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={strokeWidth ?? (role === "heal" ? 2.4 : 2.2)}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ stroke: color }}
    >
      <path d={rolePath[role]} />
    </svg>
  );
}

/** Ghost of lost health that lingers, then drains away. */
export function ghostOf(t: number, events: { t: number; from: number; to: number }[], health: number) {
  for (const e of events) {
    if (t >= e.t && t < e.t + 2) return { left: pct(e.to), width: pct(e.from - e.to), transition: "none" };
    if (t >= e.t + 2 && t < e.t + 9) return { left: pct(e.to), width: "0%", transition: `width 420ms ${IN} 150ms` };
  }
  return { left: pct(health), width: "0%", transition: "none" };
}

/** Cooldown state of an icon slot. */
export type SlotState = {
  border: string;
  shadow: string;
  filter: string;
  sweep: string;
  digits: string;
  scale: string;
  transition: string;
};

export const READY: SlotState = {
  border: "var(--arcane)",
  shadow: "none",
  filter: "none",
  sweep: "transparent",
  digits: "",
  scale: "1",
  transition: "none",
};

export function cooling(fraction: number, digits: string): SlotState {
  const deg = Math.round(fraction * 360);
  return {
    border: "var(--gilt-hairline)",
    shadow: "none",
    filter: "grayscale(1) brightness(0.62)",
    sweep: `conic-gradient(transparent 0deg ${deg}deg, rgba(0, 0, 0, 0.62) ${deg}deg 360deg)`,
    digits,
    scale: "1",
    transition: "none",
  };
}

/** The frame a cooldown comes back: an arcane flash and a small press. */
export const POP: SlotState = { ...READY, shadow: "0 0 0 2px var(--arcane), 0 0 16px var(--arcane)", scale: "0.86" };
export const SETTLE: SlotState = { ...READY, transition: `transform 180ms ${OUT}, box-shadow 240ms ${OUT}` };
