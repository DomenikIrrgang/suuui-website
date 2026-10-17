import type { Metadata } from "next";
import Link from "next/link";
import { ShareLink } from "@/components/ShareLink";
import {
  ButtonLink,
  Body,
  bandClass,
  BandJewel,
  cx,
  Heading,
  PageIntro,
  Section,
  SectionHeader,
  Strong,
  Tag,
  TextLink,
} from "@/components/ui";
import { getReleaseData } from "@/lib/releases";
import { formatDate, links } from "@/lib/site";
import { EarlierReleases } from "./EarlierReleases";
import s from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/download" },
  title: "Download",
  description: "Get SuuUI for WoW Forever from GitHub, CurseForge or Wago Addons. Free and open source.",
};

const sources = [
  {
    title: "GitHub",
    text: "The zip file, to install by hand. The steps show while it downloads.",
    href: "/download/zip",
    cta: "Download zip",
    primary: true,
  },
  {
    title: "CurseForge",
    text: "Install and update it with the CurseForge app. Search for SuuUI.",
    href: links.curseforge,
    cta: "Open on CurseForge",
  },
  {
    title: "Wago Addons",
    text: "Install and update it with the Wago app. Search for SuuUI.",
    href: links.wago,
    cta: "Open on Wago",
  },
];

/** On a phone: the three ways to install, as rows that lead straight there. */
const phoneSources = [
  { title: "CurseForge", text: "The CurseForge app keeps it up to date.", href: links.curseforge },
  { title: "Wago Addons", text: "The Wago app keeps it up to date.", href: links.wago },
  { title: "Zip from GitHub", text: "To install by hand. Every release is kept here.", href: "/download/zip" },
];

const chevron = (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export default async function DownloadPage() {
  const { releases, latest: latestRelease, interfaceVersion } = await getReleaseData();

  const earlier = releases.slice(1);

  return (
    <>
      <PageIntro
        eyebrow="Download"
        title="Get SuuUI"
        lead={
          <>
            <span className="desktop-only">
              Free and open source, made for WoW Forever. Install it with your addon app and it stays up to date, or
              download the zip and install it by hand.
            </span>
            <span className="mobile-only">Free and open source, made for WoW Forever.</span>
          </>
        }
        compact
      >
        <div className={cx(s.computer, "mobile-only")}>
          <span aria-hidden="true" className={s.cornerTopLeft} />
          <span aria-hidden="true" className={s.cornerBottomRight} />
          <div className={s.computerHead}>
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gilt)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={s.computerIcon}>
              <path d="M3 5h18v11H3zM8 20h8M12 16v4" />
            </svg>
            <div>
              <h2 className={s.computerTitle}>SuuUI installs on your computer</h2>
              <p className={s.computerText}>
                Open this page on the computer you play on, or send yourself the link for later.
              </p>
            </div>
          </div>
          <div className={s.computerButtons}>
            <ShareLink />
            <ShareLink mode="copy" variant="secondary" />
          </div>
        </div>
      </PageIntro>

      <section aria-labelledby="m-latest-title" className={cx(s.phoneLatest, bandClass, "mobile-only")}>
        <BandJewel />
        <div className={s.container}>
          <div className={s.latestHead}>
            <h2 id="m-latest-title" className={s.latestLabel}>
              Latest release
            </h2>
            <Tag>{latestRelease.channel}</Tag>
          </div>
          <p className={s.version}>{latestRelease.version}</p>
          <p className={s.versionMeta}>
            Released {formatDate(latestRelease.date)} · Interface {interfaceVersion} · MIT License
          </p>
          <Body className={s.phoneSummary}>
            <Strong>In this release:</Strong> {latestRelease.summary}
          </Body>
          <span className={s.latestLinks}>
            <TextLink href="/changelog">Read the changelog</TextLink>
            <TextLink href="/compatibility">Known issues</TextLink>
          </span>

          <h3 className={s.waysTitle}>Three ways to install it</h3>
          <ul className={s.ways}>
            {phoneSources.map((source) => (
              <li key={source.title}>
                <Link href={source.href} className={s.way}>
                  <span className={s.wayText}>
                    <span className={s.wayName}>{source.title}</span>
                    <span className={s.wayNote}>{source.text}</span>
                  </span>
                  {chevron}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="m-older-title" className={cx(s.phoneOlder, "mobile-only")}>
        <div className={s.container}>
          <h2 id="m-older-title" className={s.phoneOlderTitle}>
            Every version, kept
          </h2>
          <EarlierReleases count={earlier.length}>
            <ul className={s.phoneRows}>
              {earlier.map((release) => (
                <li key={release.version} className={s.phoneRow}>
                  <div className={s.phoneRowHead}>
                    <span className={s.phoneRowVersion}>{release.version}</span>
                    <span className={s.releaseDate}>{formatDate(release.date, "short")}</span>
                  </div>
                  <p className={s.phoneRowSummary}>{release.summary}</p>
                </li>
              ))}
            </ul>
          </EarlierReleases>
          <p className={s.phoneSemver}>
            SuuUI follows semantic versioning. Betas end in <span className={s.mono}>-beta.N</span>. Until 1.0, a
            release you need to act on raises the middle number.
          </p>
        </div>
      </section>

      <section aria-labelledby="latest-title" className={cx(s.latestSection, "desktop-only")}>
        <div className={s.container}>
          <div className={s.latest}>
            <span aria-hidden="true" className={s.cornerTopLeft} />
            <span aria-hidden="true" className={s.cornerBottomRight} />
            <div className={s.latestHead}>
              <h2 id="latest-title" className={s.latestLabel}>
                Latest release
              </h2>
              <Tag>{latestRelease.channel}</Tag>
            </div>
            <p className={s.version}>{latestRelease.version}</p>
            <p className={s.versionMeta}>
              <span>Released {formatDate(latestRelease.date)}</span>
              <span>For WoW Forever, interface {interfaceVersion}</span>
              <span>MIT License</span>
            </p>
            <div className={s.sources}>
              {sources.map((source) => (
                <article key={source.title} className={s.source}>
                  <Heading level={3}>{source.title}</Heading>
                  <Body className={s.sourceText}>{source.text}</Body>
                  <ButtonLink
                    href={source.href}
                    variant={source.primary ? "primary" : "secondary"}
                    className={s.sourceButton}
                  >
                    {source.cta}
                  </ButtonLink>
                </article>
              ))}
            </div>
            <div className={s.latestFoot}>
              <Body className={s.latestSummary}>
                <Strong>In this release:</Strong> {latestRelease.summary}
              </Body>
              <span className={s.latestLinks}>
                <TextLink href="/changelog">Read the changelog</TextLink>
                <TextLink href="/compatibility">Known issues</TextLink>
              </span>
            </div>
          </div>
        </div>
      </section>

      <Section aria-labelledby="older-title" band className="desktop-only">
        <div className={s.columns}>
          <div className={s.olderColumn}>
            <SectionHeader eyebrow="Earlier releases" title="Every version, kept" id="older-title" size="h2Small" />
            <ul className={s.rows}>
              {earlier.map((release) => (
                <li key={release.version} className={s.release}>
                  <span className={s.releaseVersion}>{release.version}</span>
                  <span className={s.releaseDate}>{formatDate(release.date, "short")}</span>
                  <Body className={s.releaseSummary}>{release.summary}</Body>
                  <a href={release.url} className={s.releaseLink}>
                    Release on GitHub
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <aside aria-labelledby="versions-title" className={s.aside}>
            <Heading level={3} id="versions-title" className={s.asideTitle}>
              How versions work
            </Heading>
            <Body className={s.asideText}>
              SuuUI follows semantic versioning. Betas end in <span className={s.mono}>-beta.N</span>. Until 1.0, a
              release you need to act on, such as one that resets settings, raises the middle number.
            </Body>
            <Body className={s.asideText}>
              Building from source? See the <Link href="/developers">developer page</Link>.
            </Body>
          </aside>
        </div>
      </Section>
    </>
  );
}
