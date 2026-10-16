import { cx } from "./ui";
import s from "./Mark.module.css";

/**
 * Put this class on the element that should trigger the mark's hover shimmer: on hover or keyboard focus the
 * frame turns gold and light runs across the gem's facets; pressing it shrinks the mark a little.
 */
export const markHost = s.host;

/** The gem: the gilt frame, the arcane stone and its four facets of light. Drawn in a 100 × 100 box. */
function Gem({ shimmer }: { shimmer: "hover" | "loop" }) {
  return (
    <g className={cx(s.mark, shimmer === "loop" && s.loop)}>
      <polygon className={s.frame} points="50,6 94,50 50,94 6,50" fill="#131116" stroke="#C9A75A" strokeWidth="3.5" />
      <polygon points="50,18 82,50 50,82 18,50" fill="none" stroke="#C9A75A" strokeWidth="1.2" strokeOpacity="0.5" />
      <polygon points="50,31 69,50 50,69 31,50" fill="#3FD0FF" />
      <polygon points="50,31 50,50 31,50" fill="#FFFFFF" fillOpacity="0.45" />
      <polygon points="69,50 50,69 50,50" fill="#000000" fillOpacity="0.18" />
      <polygon className={s.f1} points="50,31 50,50 31,50" fill="#FFFFFF" />
      <polygon className={s.f2} points="50,31 69,50 50,50" fill="#FFFFFF" />
      <polygon className={s.f3} points="31,50 50,69 50,50" fill="#FFFFFF" />
      <polygon className={s.f4} points="69,50 50,69 50,50" fill="#FFFFFF" />
    </g>
  );
}

/** The SuuUI mark on its own. `shimmer="loop"` keeps the facets glinting, for waiting states. */
export function Mark({ size, shimmer = "hover", className }: { size: number; shimmer?: "hover" | "loop"; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" className={cx(s.svg, className)}>
      <Gem shimmer={shimmer} />
    </svg>
  );
}

/**
 * The crest: the mark between two gilt wings tipped with jewels.
 * `entrance` plays the loading screen's reveal (mark pops in, wings draw out, jewels fade in) and loops the shimmer.
 */
export function Crest({ id, entrance = false, className }: { id: string; entrance?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 400 120" aria-hidden="true" className={cx(s.svg, s.crest, entrance && s.entrance, className)}>
      <defs>
        <linearGradient id={`${id}-wl`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C9A75A" stopOpacity="0.15" />
          <stop offset="1" stopColor="#C9A75A" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`${id}-wr`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C9A75A" stopOpacity="0.85" />
          <stop offset="1" stopColor="#C9A75A" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect className={s.wingLeft} x="30" y="59.5" width="118" height="1" fill={`url(#${id}-wl)`} />
      <rect className={s.wingRight} x="252" y="59.5" width="118" height="1" fill={`url(#${id}-wr)`} />
      <polygon className={s.jewel} points="25,55 30,60 25,65 20,60" fill="#C9A75A" />
      <polygon className={s.jewel} points="375,55 380,60 375,65 370,60" fill="#C9A75A" />
      <g transform="translate(150 10)">
        <Gem shimmer={entrance ? "loop" : "hover"} />
      </g>
    </svg>
  );
}
