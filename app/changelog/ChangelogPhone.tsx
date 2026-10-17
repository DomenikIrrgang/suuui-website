"use client";

import { useEffect, useRef, useState } from "react";
import { MoreButton } from "@/components/Mobile";
import { bandClass, BandJewel, ButtonLink, cx, Tag } from "@/components/ui";
import type { Release } from "@/lib/releases";
import { formatDate, releaseAnchor } from "@/lib/site";
import { Items, Text } from "./ReleaseNotes";
import s from "./page.module.css";

const chevron = (className: string) => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/** One section of a release's notes (New, Changed, Fixed…), open until it's folded away. */
function NoteSection({ section }: { section: NonNullable<Release["notes"]>["sections"][number] }) {
  const [open, setOpen] = useState(true);
  const body = (
    <>
      {section.paragraphs.map((paragraph, j) => (
        <p key={j} className={s.sectionText}>
          <Text parts={paragraph} />
        </p>
      ))}
      {section.items.length > 0 && <Items items={section.items} />}
    </>
  );
  if (!section.title) return <section className={s.phoneSection}>{body}</section>;
  return (
    <section className={s.phoneSection} aria-label={section.title}>
      <h3 className={s.phoneSectionHeading}>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className={s.phoneSectionButton}>
          <span className={s.phoneSectionTitle}>{section.title}</span>
          {section.items.length > 0 && <span className={s.phoneSectionCount}>{section.items.length}</span>}
          {chevron(open ? `${s.phoneChevron} ${s.flipped}` : s.phoneChevron)}
        </button>
      </h3>
      <div hidden={!open} className={s.phoneSectionBody}>
        {body}
      </div>
    </section>
  );
}

/**
 * The changelog on a phone (each section is `mobile-only`): one release at a time, picked from a list of versions, with every other
 * release a tap away. A link to a release's anchor (#v040b5) opens that release.
 */
export function ChangelogPhone({ releases }: { releases: Release[] }) {
  const [version, setVersion] = useState(releases[0]?.version);
  const [allOpen, setAllOpen] = useState(false);
  const article = useRef<HTMLElement>(null);

  useEffect(() => {
    const fromHash = () => {
      const anchor = window.location.hash.slice(1);
      const match = releases.find((r) => releaseAnchor(r.version) === anchor);
      if (match) setVersion(match.version);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [releases]);

  const release = releases.find((r) => r.version === version) ?? releases[0];
  if (!release) return null;
  const others = releases.filter((r) => r.version !== release.version);

  const pick = (next: string) => {
    setVersion(next);
    setAllOpen(false);
    article.current?.scrollIntoView({ block: "start" });
  };

  return (
    <>
      <section aria-label="Pick a version" className={cx(s.phonePicker, "mobile-only")}>
        <div className={s.phoneContainer}>
          <label htmlFor="version" className={s.phoneLabel}>
            Version
          </label>
          <div className={s.phoneSelectWrap}>
            <select
              id="version"
              value={release.version}
              onChange={(e) => setVersion(e.target.value)}
              className={s.phoneSelect}
            >
              {releases.map((r, i) => (
                <option key={r.version} value={r.version}>
                  {r.version}
                  {i === 0 ? " · latest" : ""} · {formatDate(r.date, "dayMonth")}
                </option>
              ))}
            </select>
            {chevron(s.phoneSelectChevron)}
          </div>
        </div>
      </section>

      <section aria-labelledby="m-release-title" className={cx(s.phoneRelease, bandClass, "mobile-only")} ref={article}>
        <BandJewel />
        <div className={s.phoneContainer} key={release.version}>
          <header className={s.phoneHead}>
            <h2 id="m-release-title" className={s.phoneVersion}>
              {release.version}
            </h2>
            <Tag>{release.channel}</Tag>
            <span className={s.phoneDate}>{formatDate(release.date)}</span>
          </header>

          {release.notes ? (
            <>
              {release.notes.intro.map((paragraph, i) => (
                <p key={i} className={s.phoneIntro}>
                  <Text parts={paragraph} />
                </p>
              ))}
              {release.notes.sections.map((section, i) => (
                <NoteSection key={i} section={section} />
              ))}
            </>
          ) : (
            <p className={s.phoneIntro}>{release.summary}</p>
          )}
          <a href={release.url} className={s.phoneGithub}>
            Release on GitHub
          </a>
        </div>
      </section>

      {others.length > 0 && (
        <section aria-labelledby="m-all-title" className={cx(s.phoneAll, "mobile-only")}>
          <div className={s.phoneContainer}>
            <h2 id="m-all-title" className={s.phoneAllTitle}>
              Earlier releases
            </h2>
            <MoreButton expanded={allOpen} onClick={() => setAllOpen(!allOpen)} className={s.phoneAllButton}>
              {allOpen ? "Hide earlier releases" : `Show every release (${others.length} more)`}
            </MoreButton>
            {allOpen && (
              <ul className={s.phoneOthers}>
                {others.map((r) => (
                  <li key={r.version} className={s.phoneOther}>
                    <div className={s.phoneOtherHead}>
                      <span className={s.phoneOtherVersion}>{r.version}</span>
                      <span className={s.phoneDate}>{formatDate(r.date, "short")}</span>
                    </div>
                    {r.summary && <p className={s.phoneOtherSummary}>{r.summary}</p>}
                    <button type="button" onClick={() => pick(r.version)} className={s.phoneRead}>
                      Read the full notes
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      <section aria-label="Download" className={cx(s.phoneDownload, "mobile-only")}>
        <div className={s.phoneContainer}>
          <ButtonLink href="/download" variant="primary" className={s.phoneDownloadButton}>
            Get the latest on your computer
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
