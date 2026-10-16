// Cooldown Manager presets per class and spec, generated from the addon's own preset data.
// Replace presets.json when the presets change, and update `presetsVersion` to match.
import data from "./presets.json";

export type PresetEntry = {
  /** Name of the spell, or of the group standing for several spells */
  n: string;
  /** A group's members, comma separated */
  m?: string;
  /** Conditions and options, separated by " · " */
  t?: string;
};

export const presetListKeys = ["procs", "buffs", "debuffs", "essential", "utility"] as const;
export type PresetListKey = (typeof presetListKeys)[number];

export type PresetSpec = { id: string; name: string; lists: Record<PresetListKey, PresetEntry[]> };
export type PresetClass = { id: string; name: string; color: string; specs: PresetSpec[] };

export const presets: PresetClass[] = data;

export const presetsVersion = "0.4.0-beta.5";
