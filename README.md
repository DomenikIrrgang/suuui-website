# suuui-website

Website for the WoW Forever addon SuuUI, built with Next.js (App Router) and CSS Modules.

The design lives in the "SuuUI website" design canvas; colours, fonts and radii follow the SuuUI design system's
tokens (see `app/globals.css`).

## Develop

```sh
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

## Where things are

| Path | What |
| --- | --- |
| `lib/site.ts` | Every external link (GitHub, CurseForge, Wago, Discord). |
| `lib/releases.ts` | Releases from GitHub: versions, dates, notes, zips and the interface version, refreshed hourly. |
| `lib/release-notes.ts` | Turns a GitHub release's Markdown into the changelog. |
| `app/*/page.tsx` | One file per page: Home, Features, Download, Changelog, FAQ, Developers and more. |
| `components/ui.tsx` | Shared building blocks: sections, eyebrows, headings, buttons, cards, screenshot frames, roadmap status. |
| `components/Header.tsx`, `Footer.tsx` | Site header and footer. |
| `components/demo/` | The animated live HUD demo, the motion clips and the Cooldown Manager presets demo (Features › Presets). |
| `lib/presets.*` | Cooldown Manager presets per class and spec, from the addon's own preset data. |
| `lib/preset-icons.json`, `public/icons/preset-icons.png` | Every preset spell's icon from the WoW Forever client, as one sprite plus its per-class index. |
| `app/fonts/` | Marcellus SC and Figtree (SIL Open Font License), loaded with `next/font/local`. |
| `public/brand/` | Logo, crest, the SuuUI mark (full and small) and the GitHub and Discord marks. |
| `public/icons/` | Spell, talent and item icons for the demos, extracted from the WoW Forever client. |
| `app/icon.tsx`, `app/apple-icon.tsx` | Browser icons: the small mark at 16 and 24 px, the full mark at 32 px, 180 px for home screens. |
| `app/opengraph-image.png`, `app/changelog/opengraph-image.png` | Link previews: the site card, and the release card for the changelog. |

### Shipping a release

Publishing the release on GitHub is enough for the facts: within an hour the site shows the new version, its
date, Beta or Stable (the release's pre-release flag), its notes on the Changelog, its zip on Download, and the
interface version from the release's `release.json`. No code change or redeploy is needed.

The notes are the release's Markdown as written on GitHub. Keep to the usual shape: a `## <version> (<date>)`
heading, an optional intro paragraph, `### New` / `### Changed` / `### Fixed` sections, and `-` lists indented by two
spaces.

What stays by hand, when you want it:

1. A one-line summary for the Download page in `SUMMARIES` in `lib/releases.ts`. Without one, a summary is made
   from the notes.
2. The "New in this beta" list on the home page, and the roadmap.
3. The release card: update it in the design canvas and export it over `app/changelog/opengraph-image.png`
   (1200 × 630), with its text in `opengraph-image.alt.txt`.
4. Now and then, the `SNAPSHOT` in `lib/releases.ts`: what the site shows if GitHub can't be reached while it
   builds.

### Screenshots

Every screenshot is still a labelled placeholder frame. To use a real image, put it under `public/` and pass it
as `src` to the `Screenshot` component, e.g. `<Screenshot src="/shots/hud.png" caption="…" variant="hero" />`.
The caption becomes the image's alt text.

## Container

`next.config.ts` builds with `output: "standalone"`, and the `Dockerfile` packs that into a small image that runs as
the non-root `node` user on port 3000.

```sh
docker build -t suuui-website .
docker run -p 3000:3000 suuui-website
```

- `SITE_URL` (optional, e.g. `https://suuui.example`) sets the absolute base URL used in page metadata.
- Environment: `PORT` (default 3000) and `HOSTNAME` (default `0.0.0.0`).
- `GITHUB_TOKEN` (optional): a token for reading the releases. Without one, GitHub allows 60 requests an hour per
  address, which the hourly refresh stays well within.
- Each running server keeps its own cache of the pages it refreshes. With several replicas, each one checks GitHub
  on its own; that's fine at one request an hour each.

## Deployment

https://suuui.dev runs on the `suuui` droplet (fra1) as a Docker Compose stack in `/opt/suuui`: Traefik in front,
with a Let's Encrypt certificate for `suuui.dev` and `www.suuui.dev` (DNS challenge through DigitalOcean DNS), and
the app behind it. `www` redirects to the apex.
The same Traefik also serves https://wowlua.dev and https://registry.wowlua.dev for the separate `wowlua` stack in
`/opt/wowlua` (deployed by the wowlua-website repository), which joins this stack's `web` network as `wowlua-app` and
`wowlua-registry`; its certificate is `wowlua.dev` plus `*.wowlua.dev`.

Every push to `main` runs `.github/workflows/deploy.yml`, which:

1. builds the image and pushes it to `registry.digitalocean.com/suuui/suuui-website:<commit sha>`,
2. SSHes in as `deploy`, whose key can only run `suuui-deploy <sha>`: it pulls the tag, starts it, waits for the
   health check and rolls back to the previous tag if it fails,
3. keeps the newest 3 tags in the registry and starts garbage collection (the free tier holds 500 MB).

| Path in repo | On the droplet |
| --- | --- |
| `deploy/compose.yaml` | `/opt/suuui/compose.yaml` |
| `deploy/traefik/*.yml` | `/opt/suuui/traefik/` |
| `deploy/deploy.sh` | `/usr/local/bin/suuui-deploy` |
| `deploy/deploy-ssh.sh` | `/usr/local/bin/suuui-deploy-ssh` |

CI only ships the image. Changes to these files are copied over by hand, on purpose, so the CI key can't change
what runs as root:

```sh
scp deploy/compose.yaml root@suuui.dev:/opt/suuui/
scp deploy/traefik/*.yml root@suuui.dev:/opt/suuui/traefik/
ssh root@suuui.dev 'cd /opt/suuui && docker compose up -d'
```

Secrets, none of them in the repo:

- GitHub environment `production` (main only): `DIGITALOCEAN_ACCESS_TOKEN` (registry scopes only) and
  `DEPLOY_SSH_KEY`. `DEPLOY_HOST` and `DEPLOY_KNOWN_HOSTS` are plain variables.
- Droplet: `/opt/suuui/secrets/do_token` (DigitalOcean token with domain scopes, for the DNS challenge) and
  `/root/.docker/config.json` (read-only registry login). Both are root-only.
- Certificates: `/opt/suuui/traefik/acme/acme.json`.

Keep the placeholder TXT record `_acme-challenge.suuui.dev` in DigitalOcean DNS. DigitalOcean's nameservers keep
answering "does not exist" for a while about a name that was looked up before it existed, which made the DNS
challenge for the apex time out. With the placeholder the name always exists, and Traefik only adds its challenge
value next to it.
