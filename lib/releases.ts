// Releases come straight from GitHub: the version, date, channel, notes and zip of every release.
// Pages that use them are static and refreshed in the background at most once an hour, so a new
// release shows up on the site by itself, without a code change or a redeploy.
import { cache } from "react";
import { parseReleaseNotes, summarize, type ReleaseNotes } from "./release-notes";
import { links, releaseUrl } from "./site";

const REPO = "DomenikIrrgang/suuui";
/** How often, in seconds, the site checks GitHub for new releases. */
const REVALIDATE = 3600;

export type Release = {
  version: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  channel: "Beta" | "Stable";
  /** One line for the Download page */
  summary: string;
  /** Null when the notes couldn't be read; the changelog then links to GitHub instead. */
  notes: ReleaseNotes | null;
  url: string;
  zipUrl: string;
};

export type ReleaseData = {
  /** Newest first; the first entry is the current release. */
  releases: Release[];
  latest: Release;
  /** The WoW Forever interface version the current release is made for */
  interfaceVersion: string;
};

/**
 * Hand-written one-liners for the Download page. A release without one gets a summary made from
 * its notes, so this only needs an entry when that summary should read differently.
 */
const SUMMARIES: Record<string, string> = {
  "0.4.0-beta.5":
    "Defensives and Warded on party and raid frames, and buffs and debuffs apart on target, focus, party and raid frames.",
  "0.4.0-beta.4":
    "Online notes for friends and guild members, Battle.net invites that work, and aggro alerts only when someone holds the mobs.",
  "0.4.0-beta.3": "Quest markers on the world map show on every character.",
  "0.4.0-beta.2": "Skyborne characters see the quests they can pick up, and money without trailing zero coins.",
  "0.4.0-beta.1": "The world map in SuuUI's look, with map pins, an enlarged map and your own map marks.",
  "0.3.0-beta.1":
    "The Group Finder, Talents and Legacy windows, Professions, Social and Guild windows, and right-click menus in SuuUI's look.",
  "0.2.0-beta.2": "SuuUI on Wago Addons too; the addon is unchanged.",
  "0.2.0-beta.1": "The first public beta.",
};

const zipName = (version: string) => `SuuUI-${version}-github.zip`;
const zipUrlFor = (version: string) => `${links.releases}/download/v${version}/${zipName(version)}`;

/** What the site shows when GitHub can't be reached while building. Update it now and then. */
const SNAPSHOT: ReleaseData = (() => {
  const releases: Release[] = [
    { version: "0.4.0-beta.5", date: "2026-10-16" },
    { version: "0.4.0-beta.4", date: "2026-10-16" },
    { version: "0.4.0-beta.3", date: "2026-10-16" },
    { version: "0.4.0-beta.2", date: "2026-10-16" },
    { version: "0.4.0-beta.1", date: "2026-10-16" },
    { version: "0.3.0-beta.1", date: "2026-10-15" },
    { version: "0.2.0-beta.2", date: "2026-10-13" },
    { version: "0.2.0-beta.1", date: "2026-10-13" },
  ].map(({ version, date }): Release => ({
    version,
    date,
    channel: "Beta",
    summary: SUMMARIES[version] ?? "",
    notes: null,
    url: releaseUrl(version),
    zipUrl: zipUrlFor(version),
  }));
  return { releases, latest: releases[0], interfaceVersion: "16001" };
})();

type GitHubRelease = {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  published_at: string | null;
  html_url: string;
  body: string | null;
  assets: { name: string; browser_download_url: string }[];
};

function headers(): HeadersInit {
  const h: Record<string, string> = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  // Optional: a token lifts GitHub's limit of 60 requests an hour per address.
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: "force-cache", next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`GET ${url}: ${res.status}`);
  return res.json() as Promise<T>;
}

function toRelease(r: GitHubRelease): Release {
  const version = r.tag_name.replace(/^v/, "");
  const notes = r.body ? parseReleaseNotes(r.body) : null;
  const zip = r.assets.find((a) => a.name === zipName(version)) ?? r.assets.find((a) => /-github\.zip$/.test(a.name) && !/-maps/.test(a.name));
  return {
    version,
    date: notes?.date ?? (r.published_at ?? "").slice(0, 10),
    channel: r.prerelease ? "Beta" : "Stable",
    summary: SUMMARIES[version] ?? (notes ? summarize(notes) : ""),
    notes,
    url: r.html_url,
    zipUrl: zip?.browser_download_url ?? zipUrlFor(version),
  };
}

async function fetchReleaseData(): Promise<ReleaseData> {
  const list = await getJson<GitHubRelease[]>(`https://api.github.com/repos/${REPO}/releases?per_page=50`, {
    headers: headers(),
  });
  const published = list.filter((r) => !r.draft && r.published_at);
  if (!published.length) throw new Error("no published releases");
  const releases = published.map(toRelease);

  // The interface version comes from the release.json packaged with the newest release.
  let interfaceVersion = SNAPSHOT.interfaceVersion;
  const manifest = published[0].assets.find((a) => a.name === "release.json");
  if (manifest) {
    try {
      const json = await getJson<{ releases?: { metadata?: { interface?: number }[] }[] }>(manifest.browser_download_url);
      const found = json.releases?.[0]?.metadata?.[0]?.interface;
      if (found) interfaceVersion = String(found);
    } catch {
      // Keep the last known interface version.
    }
  }
  return { releases, latest: releases[0], interfaceVersion };
}

/** All releases, newest first. Shared by every page rendered in the same request or build. */
export const getReleaseData = cache(async (): Promise<ReleaseData> => {
  try {
    return await fetchReleaseData();
  } catch (error) {
    // While the server runs, fail the refresh so it keeps serving the last good pages.
    // While building (or developing), fall back to the snapshot so the site still renders.
    const building = process.env.NEXT_PHASE === "phase-production-build";
    if (process.env.NODE_ENV === "production" && !building) throw error;
    console.warn(`Releases: using the built-in snapshot (${(error as Error).message})`);
    return SNAPSHOT;
  }
});
