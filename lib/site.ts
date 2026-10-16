// Every external link the site shows lives here. Releases come from GitHub (see releases.ts).

const repo = "https://github.com/DomenikIrrgang/suuui";

export const links = {
  github: repo,
  issues: `${repo}/issues`,
  releases: `${repo}/releases`,
  apiDocs: `${repo}/blob/main/Docs/API.md`,
  lfgDocs: `${repo}/blob/main/Docs/ForeverLFG.md`,
  examplePlugin: `${repo}/tree/main/Examples/SuuUI_HelloPlugin`,
  diagnostics: `${repo}/tree/main/src/Diagnostics`,
  wowlua: "https://github.com/DomenikIrrgang/wowlua",
  curseforge: "https://www.curseforge.com/wow/addons/suuui",
  wago: "https://addons.wago.io/addons/suuui",
  // TODO: replace with the real invite once the Discord server exists.
  discord: "https://discord.gg/YOUR-INVITE",
} as const;

export function releaseUrl(version: string) {
  return `${links.releases}/tag/v${version}`;
}

/** Anchor id for a release on the changelog page, e.g. "v030b1". */
export function releaseAnchor(version: string) {
  return "v" + version.replace(/-beta\./, "b").replace(/\./g, "");
}

const dateFormats = {
  long: { day: "numeric", month: "long", year: "numeric" },
  short: { day: "numeric", month: "short", year: "numeric" },
  dayMonth: { day: "numeric", month: "short" },
} satisfies Record<string, Intl.DateTimeFormatOptions>;

export function formatDate(iso: string, style: keyof typeof dateFormats = "long") {
  return new Intl.DateTimeFormat("en-GB", { ...dateFormats[style], timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
