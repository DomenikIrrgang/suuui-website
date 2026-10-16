"use client";

import type { CSSProperties, ReactNode } from "react";
import { ClipFrame, OUT, type Ratio } from "./parts";
import { useTimeline } from "./useTimeline";
import s from "./clips.module.css";

const LENGTH = 90;
const SPIN = 45;

/** The addon's map glyphs: 24 units, drawn as 1.9 strokes. */
const GLYPH = {
  wing: "M20 4C13 4 7 7 4 13l4 .5L5 18c5 0 9-1.5 12-4.5l-4-.5 5-3-4-.5c2.5-1.5 4.5-3.5 6-5.5z",
  swirl:
    "M13.5 12.0L14.1 12.8L14.3 13.9L13.9 15.2L12.8 16.4L11.1 17.2L9.0 17.2L6.8 16.3L5.0 14.6L3.8 12.0L3.5 8.9M11.2 13.3L10.3 13.4L9.2 13.0L8.2 12.0L7.8 10.5L8.0 8.6L9.0 6.8L10.8 5.4L13.3 4.6L16.1 4.9L18.9 6.2M11.2 10.7L11.6 9.8L12.5 9.0L13.9 8.8L15.4 9.1L16.9 10.2L18.0 12.0L18.3 14.3L17.7 16.8L16.1 19.1L13.6 20.9",
  skull: "M12 3a7 7 0 0 0-7 7c0 2.6 1.3 4.2 3 5.2V18h8v-2.8c1.7-1 3-2.6 3-5.2a7 7 0 0 0-7-7zM9.5 11h.01M14.5 11h.01M10 21v-3M14 21v-3",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  star: "M12.0 3.4L14.3 9.4L20.7 9.8L15.7 13.8L17.4 20.0L12.0 16.5L6.6 20.0L8.3 13.8L3.3 9.8L9.7 9.4Z",
};

type Pin = {
  id: string;
  x: number;
  y: number;
  char?: string;
  glyph?: keyof typeof GLYPH;
  color: string;
  edge?: string;
  small?: boolean;
};

const PINS: Pin[] = [
  { id: "salma", x: 67, y: 24, char: "!", color: "var(--quest-standard)" },
  { id: "furlbrow", x: 38, y: 17, char: "!", color: "var(--quest-trivial)" },
  { id: "gryan", x: 62, y: 42, char: "!", color: "var(--quest-standard)" },
  { id: "militia", x: 50, y: 62, char: "!", color: "var(--quest-difficult)" },
  { id: "flight", x: 54, y: 49, glyph: "wing", color: "var(--gilt-text)" },
  { id: "mail", x: 61, y: 57, glyph: "mail", color: "var(--ink)", small: true },
  { id: "reaper", x: 43, y: 35, glyph: "skull", color: "var(--ink)", edge: "var(--coin-silver)" },
  { id: "deadmines", x: 29, y: 79, glyph: "swirl", color: "var(--ink)" },
];

const IDLE = { x: 47, y: 90 };
const MARK = { x: 82, y: 80 };

function Glyph({ d, color, spin }: { d: string; color: string; spin?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className={s.mapGlyph} style={{ stroke: color, ...spin }}>
      <path d={d} />
    </svg>
  );
}

function Card({ x, y, left, children }: { x: number; y: number; left?: boolean; children: ReactNode }) {
  return (
    <div
      className={s.mapCard}
      style={{ left: `${x}%`, top: `${y}%`, transform: left ? "translate(calc(-100% - 3cqw), -50%)" : "translate(3cqw, -50%)" }}
    >
      {children}
    </div>
  );
}

/** World map: a quest's pin is ringed while the rest fade, a dungeon shows its levels, and a mark is placed. */
export function ClipWorldMap({ ratio }: { ratio?: Ratio }) {
  const { t, paused, toggle } = useTimeline(LENGTH, 24);

  const questHover = t >= 12 && t < 35;
  const dungeonHover = t >= 41 && t < 57;
  const marked = t >= 64 && t < 84;
  const placing = t >= 59 && t < 66;

  const cursor =
    t < 6 || t >= 84 ? IDLE : t < 35 ? { x: 67, y: 24 } : t < 57 ? { x: 29, y: 79 } : MARK;
  const pressed = t === 64;
  const angle = (t % SPIN) * (360 / SPIN);

  return (
    <ClipFrame
      label="World map: hovering a quest rings its pin while the rest fade, a dungeon shows its levels, and a map mark is placed"
      ratio={ratio}
      paused={paused}
      onToggle={toggle}
    >
      <div className={s.panel} style={{ left: "6cqw", top: "4.5cqw", width: "88cqw", height: "53cqw" }}>
        <div className={s.panelHead}>
          <span className={s.panelSub}>Eastern Kingdoms ›</span>
          <span className={s.panelTitle}>Westfall</span>
          <span className={s.mapFilters}>Map filters</span>
        </div>
        <div className={s.map}>
          <svg viewBox="0 0 832 420" preserveAspectRatio="none" className={s.mapArt}>
            <path d="M0 0H150C128 70 152 120 126 170 104 226 140 286 112 340 98 376 116 400 104 420H0Z" fill="#11151f" />
            <path d="M150 0C128 70 152 120 126 170 104 226 140 286 112 340 98 376 116 400 104 420" fill="none" stroke="rgba(201,167,90,0.22)" strokeWidth="2" />
            <path d="M300 60c60-24 130-10 160 30 22 30-6 70-56 78-60 10-130-6-140-48-6-24 8-48 36-60z" fill="#232331" />
            <path d="M560 70c50-20 120-6 140 30 16 30-14 58-60 62-56 6-112-12-116-46-2-20 12-36 36-46z" fill="#232331" />
            <path d="M600 300c46-20 120-10 150 26 18 24-6 52-48 58-52 8-120-2-130-36-4-20 6-36 28-48z" fill="#232331" />
            <path d="M180 360c40-40 120-60 200-40" fill="none" stroke="rgba(241,234,219,0.07)" strokeWidth="18" strokeLinecap="round" />
            <path d="M470 0C480 80 455 150 462 210 470 260 400 300 330 320 290 332 250 336 232 334" fill="none" stroke="rgba(241,234,219,0.16)" strokeWidth="3" strokeDasharray="10 8" />
            <path d="M462 210C540 230 640 220 832 236" fill="none" stroke="rgba(241,234,219,0.16)" strokeWidth="3" strokeDasharray="10 8" />
          </svg>

          {PINS.map((p) => {
            const ringed = questHover && p.id === "salma";
            const opacity = questHover ? (ringed ? 1 : 0.3) : 1;
            return (
              <span
                key={p.id}
                className={p.small ? s.mapPinSmall : s.mapPin}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  borderColor: p.edge ?? "var(--gilt-line)",
                  opacity,
                  boxShadow: ringed ? "0 0 0 0.3cqw var(--surface), 0 0 0 0.6cqw var(--ink)" : "none",
                  transition: `opacity 180ms ${OUT}, box-shadow 180ms ${OUT}`,
                }}
              >
                {p.char ? (
                  <span className={s.mapChar} style={{ color: p.color }}>
                    {p.char}
                  </span>
                ) : (
                  <Glyph
                    d={GLYPH[p.glyph!]}
                    color={p.color}
                    spin={
                      p.id === "deadmines"
                        ? { transform: `rotate(${angle}deg)`, transition: angle === 0 ? "none" : "transform 100ms linear" }
                        : undefined
                    }
                  />
                )}
              </span>
            );
          })}

          <span
            className={s.mapPin}
            style={{
              left: `${MARK.x}%`,
              top: `${MARK.y}%`,
              border: "0.3cqw solid var(--mark-star)",
              opacity: marked ? 1 : 0,
              transform: `translate(-50%, -50%) scale(${t === 64 ? 1.3 : 1})`,
              transition: t === 64 ? "opacity 120ms linear" : `transform 240ms ${OUT}, opacity 300ms ${OUT}`,
            }}
          >
            <Glyph d={GLYPH.star} color="var(--mark-star)" />
          </span>

          {questHover && (
            <Card x={67} y={24} left>
              <span className={s.mapCardTitle} style={{ color: "var(--quest-standard)" }}>
                Westfall Stew
              </span>
              <span className={s.mapCardLine}>Salma Saldean · Saldean&apos;s Farm</span>
              <span className={s.mapCardLine}>Also gives Goretusk Liver Pie</span>
            </Card>
          )}
          {dungeonHover && (
            <Card x={29} y={79}>
              <span className={s.mapCardTitle}>The Deadmines</span>
              <span className={s.mapCardLine}>Dungeon · Levels 17–26</span>
            </Card>
          )}
          {marked && t >= 66 && (
            <Card x={MARK.x} y={MARK.y} left>
              <span className={s.mapCardTitle}>Meet here</span>
              <span className={s.mapCardLine}>Your mark · Show the way</span>
              <span className={s.mapCardButton}>Post to party</span>
            </Card>
          )}

          <span
            className={s.mapCursor}
            style={{
              left: `${cursor.x}%`,
              top: `${cursor.y}%`,
              transform: `scale(${pressed ? 0.85 : 1})`,
              transition: `left 600ms ${OUT}, top 600ms ${OUT}, transform 100ms linear`,
            }}
          >
            <svg viewBox="0 0 24 24" className={s.mapCursorArrow}>
              <path d="M4 2l15 11-6.5 1 3.8 7.2-2.8 1.4-3.8-7.3L4 20z" fill="var(--ink)" stroke="var(--surface)" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            {placing && <span className={s.mapCursorHint}>Ctrl+click</span>}
          </span>
        </div>
      </div>
    </ClipFrame>
  );
}
