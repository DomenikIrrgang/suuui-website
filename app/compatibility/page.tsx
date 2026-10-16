import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BandJewel,
  bandClass,
  ButtonLink,
  ButtonRow,
  Code,
  Container,
  Heading,
  PageIntro,
  SectionHeader,
  Strong,
  cx,
} from "@/components/ui";
import { getReleaseData } from "@/lib/releases";
import { links } from "@/lib/site";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Compatibility and known issues",
  description:
    "What SuuUI works alongside, what overlaps with it, and what's still being checked in this beta of the WoW Forever addon.",
};

type AddonRow = { name: string; text: string };

const addonLists: { id: string; title: string; intro: string; rows: AddonRow[] }[] = [
  {
    id: "with",
    title: "Works alongside",
    intro: "Addons SuuUI uses or leaves alone.",
    rows: [
      { name: "DBM", text: "Its boss timers ride on SuuUI's encounter timeline." },
      { name: "BigWigs", text: "The same: its timers feed the timeline." },
    ],
  },
  {
    id: "overlaps",
    title: "Overlaps with",
    intro:
      "Addons that replace the same frames. Pick one for each job: turn off the matching SuuUI module under General › Modules, or that addon's frames.",
    rows: [
      { name: "Full UI replacements", text: "Run one at a time." },
      {
        name: "Unit and raid frames, nameplates, bars, bags, chat",
        text: "Turn off SuuUI's module for that part to keep your other addon.",
      },
    ],
  },
];

const unconfirmed: { title: string; text: ReactNode }[] = [
  {
    title: "Boss fights",
    text: "What the client allows was probed in the open world and dungeon combat; boss encounters come next.",
  },
  {
    title: "Encounter timeline from the game",
    text: "Whether bosses send timeline data on Forever. When none arrives, the timeline hides; DBM and BigWigs timers still work.",
  },
  {
    title: "Debuff types you can remove",
    text: "Shown through the game's own dispel-type data, still to be confirmed on Forever.",
  },
  {
    title: '"Use now" spells',
    text: "Whether Overpower, Revenge, Riposte, Execute and the like report as usable in every combat situation. When they don't, they show as plain ready or unusable.",
  },
  {
    title: "Raids with a full group",
    text: "Raid frames, the threat meter and readiness with a full raid, and the pull countdown reaching everyone, are still to be seen.",
  },
  {
    title: "Map marks in a group",
    text: "Placing, naming and following a mark is confirmed; posting one to your group and a shared mark arriving are still to be seen.",
  },
  {
    title: "Holiday pins",
    text: "A holiday's quests and vendors show on the map only while it's on; first seen with Hallow's End.",
  },
  {
    title: "Battleground entry",
    text: "If the game keeps that answer for its own button, the button moves into the notification instead.",
  },
];

export default async function CompatibilityPage() {
  const { latest: latestRelease, interfaceVersion } = await getReleaseData();

  return (
    <>
      <PageIntro
        eyebrow="Compatibility"
        title="Compatibility and known issues"
        compact
        leadWidth={720}
        lead="What SuuUI works alongside, what overlaps with it, and what's still being checked in this beta."
      >
        <p className={s.version}>
          For SuuUI {latestRelease.version} on WoW Forever, interface {interfaceVersion}.
        </p>
      </PageIntro>

      <section aria-labelledby="with-title" className={cx(s.listsSection, bandClass)}>
        <BandJewel />
        <Container className={s.lists}>
          {addonLists.map((list) => (
            <div key={list.id} className={s.panel}>
              <Heading id={`${list.id}-title`} className={s.panelTitle}>
                {list.title}
              </Heading>
              <p className={s.panelIntro}>{list.intro}</p>
              <ul className={s.addons}>
                {list.rows.map((row, i) => (
                  <li key={i} className={s.addon}>
                    <span className={s.addonName}>{row.name}</span>
                    <span className={s.addonText}>{row.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Container>
      </section>

      <section aria-labelledby="issues-title" className={s.issuesSection}>
        <Container>
          <SectionHeader eyebrow="Known issues" title="In this beta" id="issues-title" size="h2Small" />
          <div className={s.openIssues}>
            <p className={s.openIssuesText}>
              <Strong>No open issues on GitHub right now.</Strong> Fixes in each release are listed in the{" "}
              <Link href="/changelog">changelog</Link>.
            </p>
            <ButtonLink href={links.issues} className={s.openIssuesButton}>
              Report an issue
            </ButtonLink>
          </div>

          <Heading level={3} className={s.unconfirmedTitle}>
            Still being confirmed in game
          </Heading>
          <p className={s.unconfirmedIntro}>
            Built and working as far as testing has reached, but not yet seen in every situation on the live client.
          </p>
          <ul className={s.unconfirmed}>
            {unconfirmed.map((item) => (
              <li key={item.title} className={s.unconfirmedRow}>
                <span className={s.unconfirmedName}>{item.title}</span>
                <span className={s.unconfirmedText}>{item.text}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="report-title" className={cx(s.reportSection, bandClass)}>
        <BandJewel />
        <Container>
          <div className={s.report}>
            <Heading id="report-title" className={s.reportTitle}>
              Found something?
            </Heading>
            <ol className={s.reportSteps}>
              <li>
                Type <Code>/suu errors</Code> to list what SuuUI caught this session.
              </li>
              <li>
                Type <Code>/suu version</Code> for the SuuUI and client versions.
              </li>
              <li>Open an issue on GitHub with what you did and what happened, or ask on Discord.</li>
            </ol>
            <ButtonRow className={s.reportButtons}>
              <ButtonLink href={links.issues}>Open an issue</ButtonLink>
              <ButtonLink href={links.discord}>Ask on Discord</ButtonLink>
            </ButtonRow>
          </div>
        </Container>
      </section>
    </>
  );
}
