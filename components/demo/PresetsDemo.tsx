"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { cx } from "@/components/ui";
import iconSprite from "@/lib/preset-icons.json";
import { presets, presetsVersion, type PresetEntry } from "@/lib/presets";
import { OUT, PlayToggle } from "./parts";
import { useTimeline } from "./useTimeline";
import s from "./PresetsDemo.module.css";

const LOOP = 160;

/* ---------- Icons: one sprite of every preset spell, extracted from the WoW Forever client ---------- */

const sprite = iconSprite as { cols: number; rows: number; icons: Record<string, Record<string, number>> };
/** Each cell is drawn at 116% so the icon's own dark rim is cropped by the slot. */
const CELL = 116;

function iconIndex(classId: string, entry: PresetEntry) {
  const map = sprite.icons[classId] ?? {};
  if (map[entry.n] !== undefined) return map[entry.n];
  for (const name of entry.m ? entry.m.split(", ") : []) if (map[name] !== undefined) return map[name];
  return -1;
}

function SpellIcon({ index }: { index: number }) {
  if (index < 0) return null;
  const col = index % sprite.cols;
  const row = Math.floor(index / sprite.cols);
  return (
    <img
      src="/icons/preset-icons.png"
      alt=""
      className={s.sprite}
      style={{
        width: `${sprite.cols * CELL}%`,
        height: `${sprite.rows * CELL}%`,
        left: `${-(col * CELL + 8)}%`,
        top: `${-(row * CELL + 8)}%`,
      }}
    />
  );
}

/* ---------- What each slot shows at a given moment of the loop ---------- */

type SlotState = {
  border?: string;
  shadow?: string;
  filter?: string;
  opacity?: string;
  sweep?: string;
  digits?: string;
  scale?: string;
  transition?: string;
  ring?: boolean;
  bar?: string;
};

const READY: SlotState = {};
const ARCANE_GLOW = "0 0 8px #3fd0ff66";

/** The stance or form a spec fights in; entries tied to another stance stay hidden. */
const STANCE: Record<string, string> = {
  "warrior:unspecced": "Battle Stance",
  "warrior:arms": "Battle Stance",
  "warrior:fury": "Berserker Stance",
  "warrior:protection": "Defensive Stance",
  "druid:unspecced": "Caster form",
  "druid:balance": "Moonkin Form",
  "druid:feralcat": "Cat Form",
  "druid:feralbear": "Bear Form",
  "druid:restoration": "Caster form",
  "priest:shadow": "Shadowform",
};

/** Abilities that light up when they become usable, before they are pressed. */
const REACTIVE = /^(Overpower|Revenge|Riposte|Mongoose Bite|Counterattack|Hammer of Wrath|Execute|Victory Rush)$/;

const tagsOf = (e: PresetEntry) => (e.t ? e.t.split(" · ") : []);
const showsEffect = (e: PresetEntry) => tagsOf(e).includes("Shows its effect");

function cooldownState(e: PresetEntry, uses: { at: number; cd: number }[], t: number): SlotState {
  const effect = showsEffect(e) ? 25 : 0;
  const reactive = REACTIVE.test(e.n);
  for (const u of uses) {
    const end = u.at + effect + u.cd;
    if (reactive && t >= u.at - 18 && t < u.at) return { shadow: ARCANE_GLOW, ring: true };
    if (t >= u.at && t < u.at + effect) {
      return {
        border: "var(--gilt)",
        shadow: "0 0 8px #f4e7c14d, inset 0 0 6px #f4e7c133",
        digits: String(Math.ceil((u.at + effect - t) / 10)),
        bar: `${Math.round((100 * (u.at + effect - t)) / effect)}%`,
      };
    }
    if (t >= u.at + effect && t < end) {
      const deg = Math.round(((t - u.at - effect) / u.cd) * 360);
      return {
        border: "var(--gilt-hairline)",
        filter: "grayscale(1) brightness(0.62)",
        sweep: `conic-gradient(transparent 0deg ${deg}deg, rgba(0, 0, 0, 0.62) ${deg}deg 360deg)`,
        digits: String(Math.ceil((end - t) / 10)),
      };
    }
    if (t === end) return { shadow: "0 0 0 2px var(--arcane), 0 0 16px var(--arcane)", scale: "0.86" };
    if (t > end && t <= end + 4) return { transition: `transform 180ms ${OUT}, box-shadow 240ms ${OUT}` };
  }
  return READY;
}

function frame(classId: string, specId: string, lists: Record<string, PresetEntry[]>, t: number) {
  const stance = STANCE[`${classId}:${specId}`] ?? null;
  const visible = (e: PresetEntry) => {
    for (const tag of tagsOf(e)) {
      if (tag === "Out of combat") return false;
      if (tag.startsWith("Not in ")) {
        if (tag.slice(7) === stance) return false;
        continue;
      }
      if (/Stance|Form|form|Stealth|Shadowform/.test(tag) && !tag.split(" or ").includes(stance ?? "")) return false;
    }
    return true;
  };
  const of = (key: string) => (lists[key] ?? []).filter(visible);
  const [E, U, P, B, D] = ["essential", "utility", "procs", "buffs", "debuffs"].map(of);

  const essential = E.map((e, i) => {
    const at = 8 + i * 15;
    const effect = showsEffect(e) ? 25 : 0;
    const cd = Math.max(20, Math.min([40, 60, 80][i % 3], 150 - at - effect));
    const uses = [{ at, cd }];
    const again = at + effect + cd + 10;
    if (i === 0 && again + effect + 30 < 156) uses.push({ at: again, cd: 30 });
    return { entry: e, state: cooldownState(e, uses, t) };
  });

  const utility = U.map((e, i) => {
    const plans = [{ at: 64, cd: 60 }, { at: 100, cd: 40 }];
    if (i > 1) return { entry: e, state: READY };
    const p = plans[i];
    const effect = showsEffect(e) ? 25 : 0;
    const cd = Math.max(20, Math.min(p.cd, 154 - p.at - effect));
    return { entry: e, state: cooldownState(e, [{ at: p.at, cd }], t) };
  });

  const auras: { entry: PresetEntry; state: SlotState }[] = [];
  const windows = [[30, 58], [92, 116]];
  P.forEach((e, j) => {
    const w = windows[j];
    if (!w || t < w[0] || t >= w[1]) return;
    auras.push({
      entry: e,
      state: {
        border: "var(--arcane)",
        shadow: ARCANE_GLOW,
        scale: t === w[0] ? "0.86" : "1",
        transition: t === w[0] ? "none" : `transform 180ms ${OUT}`,
        bar: `${Math.round((100 * (w[1] - t)) / (w[1] - w[0]))}%`,
        digits: String(Math.ceil((w[1] - t) / 10)),
      },
    });
  });
  const BUFF_TIMES = ["28m", "9m", "41m", "14m", "52m", "6m"];
  B.forEach((e, k) => auras.push({ entry: e, state: { bar: `${88 - k * 13}%`, digits: BUFF_TIMES[k % BUFF_TIMES.length] } }));

  const debuffs = D.map((e, k) => {
    let up: number | null = null;
    for (const a of [12 + k * 14, 92 + k * 14]) if (t >= a && t < a + 70) up = a;
    if (up === null) return { entry: e, state: { filter: "grayscale(1) brightness(0.7)", opacity: "0.42" } as SlotState };
    return {
      entry: e,
      state: { bar: `${Math.round((100 * (up + 70 - t)) / 70)}%`, digits: String(Math.ceil((up + 70 - t) / 10) + 5) },
    };
  });

  return { essential, utility, auras, debuffs };
}

/* ---------- Slots ---------- */

function Slot({
  classId,
  entry,
  state,
  size,
}: {
  classId: string;
  entry: PresetEntry;
  state: SlotState;
  size: "aura" | "debuff" | "essential" | "utility";
}) {
  const timer = size === "aura" || size === "debuff";
  return (
    <div
      className={cx(s.slot, s[size])}
      style={{
        borderColor: state.border,
        boxShadow: state.shadow,
        opacity: state.opacity,
        transform: state.scale ? `scale(${state.scale})` : undefined,
        transition: state.transition,
      }}
    >
      <div className={s.art} style={{ filter: state.filter }}>
        <SpellIcon index={iconIndex(classId, entry)} />
      </div>
      {state.sweep && <div className={s.sweep} style={{ background: state.sweep }} />}
      {state.ring && <div className={s.ring} />}
      {state.bar && <div className={s.bar} style={{ width: state.bar }} />}
      {state.digits && <span className={timer ? s.timerDigits : s.cooldownDigits}>{state.digits}</span>}
    </div>
  );
}

/** Pick a class and spec to watch its ready-made Cooldown Manager in a fight. */
export function PresetsDemo() {
  const [classIndex, setClassIndex] = useState(0);
  const [specIndex, setSpecIndex] = useState(0);
  const { t, paused, toggle, restart } = useTimeline(LOOP, 44);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const cls = presets[classIndex];
  const spec = cls.specs[specIndex] ?? cls.specs[0];
  const { essential, utility, auras, debuffs } = frame(cls.id, spec.id, spec.lists, t);

  function pickClass(i: number) {
    setClassIndex(i);
    setSpecIndex(0);
    restart();
  }

  function pickSpec(i: number) {
    setSpecIndex(i);
    restart();
  }

  // Arrow keys move between the spec tabs, as in any tab list.
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    const last = cls.specs.length - 1;
    const next = {
      ArrowRight: specIndex === last ? 0 : specIndex + 1,
      ArrowLeft: specIndex === 0 ? last : specIndex - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    pickSpec(next);
    tabs.current[next]?.focus();
  }

  return (
    <div>
      <div role="group" aria-label="Class" className={s.classes}>
        {presets.map((c, i) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={i === classIndex}
            onClick={() => pickClass(i)}
            className={cx(s.classButton, i === classIndex && s.classPressed)}
            style={{ "--class": c.color } as CSSProperties}
          >
            <span aria-hidden="true" className={s.classMark} />
            {c.name}
          </button>
        ))}
      </div>

      <div role="tablist" aria-label="Spec" className={s.tabs}>
        {cls.specs.map((p, i) => {
          const active = i === specIndex;
          return (
            <button
              key={`${cls.id}-${p.id}`}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls="presets-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => pickSpec(i)}
              onKeyDown={onTabKey}
              className={cx(s.tab, active && s.tabActive)}
            >
              {p.name}
              {active && (
                <>
                  <span aria-hidden="true" className={s.tabRule} />
                  <span aria-hidden="true" className={s.tabMarker} />
                </>
              )}
            </button>
          );
        })}
      </div>

      <figure
        id="presets-panel"
        role="tabpanel"
        aria-label={`${cls.name}, ${spec.name}: the Cooldown Manager in combat`}
        className={s.stage}
      >
        <div aria-hidden="true" className={s.manager}>
          <div className={s.topRow}>
            {auras.map(({ entry, state }) => (
              <Slot key={`a-${entry.n}`} classId={cls.id} entry={entry} state={state} size="aura" />
            ))}
            {debuffs.length > 0 && (
              <span className={s.divider}>
                <span className={s.dividerLine} />
                <span className={s.dividerJewel} />
                <span className={s.dividerLine} />
              </span>
            )}
            {debuffs.map(({ entry, state }) => (
              <Slot key={`d-${entry.n}`} classId={cls.id} entry={entry} state={state} size="debuff" />
            ))}
          </div>
          <div className={s.essentialRow}>
            {essential.map(({ entry, state }) => (
              <Slot key={`e-${entry.n}`} classId={cls.id} entry={entry} state={state} size="essential" />
            ))}
          </div>
          <div className={s.utilityRow}>
            {utility.map(({ entry, state }) => (
              <Slot key={`u-${entry.n}`} classId={cls.id} entry={entry} state={state} size="utility" />
            ))}
          </div>
        </div>
        <PlayToggle paused={paused} onToggle={toggle} className={s.toggle} />
      </figure>
      <p className={s.caption}>
        Timings are sped up so one loop shows the whole setup. Presets as of {presetsVersion}; change any of it in
        Frames › Cooldown Manager.
      </p>
    </div>
  );
}
