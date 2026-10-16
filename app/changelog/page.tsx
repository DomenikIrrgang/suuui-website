import type { Metadata } from "next";
import { SectionNav } from "@/components/SectionNav";
import { ButtonLink, Container, PageIntro, Tag } from "@/components/ui";
import { getReleaseData } from "@/lib/releases";
import { formatDate, releaseAnchor } from "@/lib/site";
import { ReleaseNotes } from "./ReleaseNotes";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Every SuuUI release, newest first, written for players: what you'll notice in game.",
};

export default async function ChangelogPage() {
  const { releases } = await getReleaseData();

  return (
    <>
      <PageIntro
        eyebrow="Changelog"
        title="What's changed"
        lead="Every release, newest first, written for players: what you'll notice in game."
      />

      <Container className={s.layout}>
        <SectionNav
          title="Versions"
          numeric
          items={releases.map((release) => ({
            id: releaseAnchor(release.version),
            label: release.version,
            meta: formatDate(release.date, "dayMonth"),
          }))}
        >
          <ButtonLink href="/download" variant="primary" className={s.navButton}>
            Download the latest
          </ButtonLink>
        </SectionNav>

        <div className={s.entries}>
          {releases.map((release) => {
            const id = releaseAnchor(release.version);
            return (
              <article key={release.version} id={id} aria-labelledby={`${id}-title`}>
                <header className={s.entryHead}>
                  <h2 id={`${id}-title`} className={s.entryVersion}>
                    {release.version}
                  </h2>
                  <Tag>{release.channel}</Tag>
                  <span className={s.entryDate}>{formatDate(release.date)}</span>
                  <a href={release.url} className={s.entryLink}>
                    Release on GitHub
                  </a>
                </header>

                {release.notes ? (
                  <ReleaseNotes notes={release.notes} />
                ) : (
                  <p className={s.entryIntro}>
                    {release.summary} <a href={release.url}>Read the full notes on GitHub</a>.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </Container>
    </>
  );
}
