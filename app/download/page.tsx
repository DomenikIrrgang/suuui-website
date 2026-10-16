import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Body, Heading, PageIntro, Section, SectionHeader, Strong, Tag, TextLink } from "@/components/ui";
import { getReleaseData } from "@/lib/releases";
import { formatDate, links } from "@/lib/site";
import s from "./page.module.css";

export const metadata: Metadata = {
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

export default async function DownloadPage() {
  const { releases, latest: latestRelease, interfaceVersion } = await getReleaseData();

  const earlier = releases.slice(1);

  return (
    <>
      <PageIntro
        eyebrow="Download"
        title="Get SuuUI"
        lead="Free and open source, made for WoW Forever. Install it with your addon app and it stays up to date, or download the zip and install it by hand."
        compact
      />

      <section aria-labelledby="latest-title" className={s.latestSection}>
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

      <Section aria-labelledby="older-title" band>
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
