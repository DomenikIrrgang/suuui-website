import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { SectionNav } from "@/components/SectionNav";
import { Code, Container, Heading, PageIntro } from "@/components/ui";
import { getReleaseData } from "@/lib/releases";
import { links } from "@/lib/site";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to what players ask most about SuuUI: installing, combat, layouts, settings and getting help.",
};

type Topic = { id: string; title: string; questions: { q: string; a: ReactNode }[] };

/** The questions, with the interface version of the current release filled in. */
const getTopics = (interfaceVersion: string): Topic[] => [
  {
    id: "start",
    title: "Getting started",
    questions: [
      {
        q: "What is SuuUI?",
        a: "A full interface replacement for WoW Forever, the classic-era game on the modern engine. It rebuilds unit frames, group frames, nameplates, action bars, cooldowns, chat, bags, the world map and Blizzard's windows in one design, and stays quiet until something needs your attention.",
      },
      {
        q: "Which version of the game does it work with?",
        a: `WoW Forever, interface ${interfaceVersion}. SuuUI is made for Forever's client and the rules it sets for addons, so it isn't meant for retail or other Classic versions.`,
      },
      {
        q: "Is it free?",
        a: "Yes. SuuUI is open source under the MIT License, and its typefaces are under the SIL Open Font License.",
      },
      {
        q: "Is it finished?",
        a: (
          <>
            It&apos;s in beta. The combat HUD, everyday play, most of Blizzard&apos;s windows and the world map with
            its pins are done. Merchant, mail and trainer are next, with first versions in testing, then the auction
            house and collections. The{" "}
            <Link href="/#roadmap">roadmap</Link> shows where things stand.
          </>
        ),
      },
      {
        q: "Where should I download it from?",
        a: (
          <>
            If you use the CurseForge or Wago app, install it there and updates arrive by themselves. Otherwise
            download the zip from GitHub. All three carry the same version; see <Link href="/download">Download</Link>.
          </>
        ),
      },
    ],
  },
  {
    id: "ingame",
    title: "In game",
    questions: [
      {
        q: "Does it work in dungeons, raids and combat?",
        a: "Yes. WoW Forever hides many values from addons in combat. SuuUI never reads them: it hands them to the game to draw. That keeps it free of taint and errors when you pull, in the open world, in dungeons and in raids.",
      },
      {
        q: "Why can't I see my group's cooldowns during a fight?",
        a: (
          <>
            In dungeon combat the client hides other players&apos; casts and blocks the messages addons send each
            other, so no addon can know them. Between pulls, each player&apos;s SuuUI shares its cooldowns in the
            readiness panel. SuuUI never shows a timer it can&apos;t trust.{" "}
            <Link href="/in-combat">What SuuUI can show in combat</Link>
          </>
        ),
      },
      {
        q: "Does it work with DBM, BigWigs and other addons?",
        a: (
          <>
            Yes. The encounter timeline can take boss timers from DBM or BigWigs, and the pull countdown (
            <Code>/suu pull</Code>) uses the game&apos;s own countdown, so your whole group sees it with or without a
            boss mod. For other addons, see <Link href="/compatibility">Compatibility</Link>.
          </>
        ),
      },
      {
        q: "Can I keep Blizzard's frame for one part?",
        a: (
          <>
            Yes. Every feature is a module. Turn one off under General › Modules, or with{" "}
            <Code>/suu disable &lt;id&gt;</Code>, and Blizzard&apos;s own frame comes back. <Code>/suu modules</Code>{" "}
            lists every module with its id. A few take effect after a reload; their row says so.
          </>
        ),
      },
    ],
  },
  {
    id: "layout",
    title: "Settings and layout",
    questions: [
      {
        q: "How do I move frames?",
        a: (
          <>
            Type <Code>/suu edit</Code>, press Edit layout under General › Appearance, or right-click the Jewel on the
            minimap. Drag frames on the snap grid, and reset one frame or all of them.
          </>
        ),
      },
      {
        q: "Can I have different layouts as tank, healer and DPS?",
        a: "Yes. Under General › Profiles, pick a profile for each role. SuuUI switches when your role changes, out of combat only.",
      },
      {
        q: "How do I share my setup with a friend?",
        a: "Export your profile as a string under General › Profiles and send it. Your friend imports it in the same place.",
      },
      {
        q: "Can I change settings from chat?",
        a: (
          <>
            Yes. <Code>/suu get</Code>, <Code>/suu set</Code> and <Code>/suu reset</Code> read, change or reset any
            setting. <Code>/suu help</Code> lists every command.
          </>
        ),
      },
    ],
  },
  {
    id: "help",
    title: "Help and the project",
    questions: [
      {
        q: "Something isn't working. How do I report it?",
        a: (
          <>
            Type <Code>/suu errors</Code> to list the errors SuuUI caught this session and <Code>/suu version</Code>{" "}
            for your versions. Then <a href={links.issues}>open an issue on GitHub</a> with what you did and what
            happened, or ask on <a href={links.discord}>Discord</a>.
          </>
        ),
      },
      {
        q: "How do I go back to the default interface?",
        a: "Disable SuuUI in the AddOns list, or turn single modules off under General › Modules to keep the rest.",
      },
      {
        q: "Can I write my own plugin?",
        a: (
          <>
            Yes. Plugins use the same public API as SuuUI&apos;s own modules, add their own settings sections and
            movable frames, and show up under Plugins in the settings. Start on the{" "}
            <Link href="/developers">developer page</Link>.
          </>
        ),
      },
      {
        q: "Is SuuUI made by Blizzard?",
        a: "No. SuuUI is a fan-made addon and is not affiliated with or endorsed by Blizzard Entertainment.",
      },
    ],
  },
];

export default async function FaqPage() {
  const { interfaceVersion } = await getReleaseData();
  const topics = getTopics(interfaceVersion);

  return (
    <>
      <PageIntro
        eyebrow="FAQ"
        title="Questions and answers"
        lead={
          <>
            What players ask most. Can&apos;t find yours? Ask on <a href={links.discord}>Discord</a> or open an issue on{" "}
            <a href={links.issues}>GitHub</a>.
          </>
        }
      />

      <Container className={s.layout}>
        <SectionNav title="Topics" items={topics.map((topic) => ({ id: topic.id, label: topic.title }))} />

        <div className={s.topics}>
          {topics.map((topic) => (
            <section key={topic.id} id={topic.id} aria-labelledby={`${topic.id}-title`}>
              <Heading id={`${topic.id}-title`} className={s.topicTitle}>
                {topic.title}
              </Heading>
              {topic.questions.map((item) => (
                <div key={item.q} className={s.question}>
                  <h3 className={s.q}>{item.q}</h3>
                  <p className={s.a}>{item.a}</p>
                </div>
              ))}
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
