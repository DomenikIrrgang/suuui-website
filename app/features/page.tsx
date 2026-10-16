import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ComponentType, type ReactNode } from "react";
import { ClipFrames } from "@/components/demo/ClipFrames";
import { ClipMeters } from "@/components/demo/ClipMeters";
import { ClipNotifications } from "@/components/demo/ClipNotifications";
import { ClipTalents } from "@/components/demo/ClipTalents";
import { ClipWorldMap } from "@/components/demo/ClipWorldMap";
import { PresetsDemo } from "@/components/demo/PresetsDemo";
import {
  ButtonLink,
  Body,
  Diamond,
  Grid,
  Heading,
  PageIntro,
  Section,
  StatusList,
  Sublead,
  TextLink,
} from "@/components/ui";
import { getReleaseData } from "@/lib/releases";
import s from "./page.module.css";

type ClipProps = { ratio?: "16 / 10" | "21 / 9" };

export const metadata: Metadata = {
  title: "Features",
  description:
    "Unit frames, nameplates, action bars, cooldowns, casts and auras in one visual language, plus the world map, chat, bags and Blizzard's windows.",
};

type Feature = { title: string; text: string; isNew?: boolean; link?: { label: string; href: string } };

const groups: {
  id: string;
  title: string;
  intro: ReactNode;
  Clip: ComponentType<ClipProps>;
  /** Sits on a raised band, alternating with the plain sections */
  band?: boolean;
  features: Feature[];
}[] = [
  {
    id: "frames",
    band: true,
    title: "Frames",
    intro: "The bar is the frame: health, names and state without a stack of borders around them.",
    Clip: ClipFrames,
    features: [
      {
        title: "Unit frames",
        text: "Player, target, target of target, focus, pet and boss frames. Health as percent, value, both or none; a gradual low-health tint; incoming heals and absorbs; debuff-type borders and badges; raid target markers; offline state; adjustable size. Target and focus show buffs and debuffs apart, yours first.",
      },
      {
        title: "Party and raid frames",
        text: "Secure group frames for 5, 10, 20 and 40 players, with real-size previews in the settings. Debuffs you can remove show by type even in combat, with aggro, range fading, class-coloured names and sorting by role. Defensives and debuffs sit in their own groups beside each bar.",
      },
      {
        title: "Defensives",
        isNew: true,
        text: "A list you control of the buffs that count as defensives, every rank: Blessing of Protection, Shield Wall, Ice Block and more. They show beside party and raid frames, and the big ones mark the frame Warded, in combat too.",
      },
      {
        title: "Buff indicators",
        text: "Healer indicators per class and spec: icons, squares, borders or fills in any corner, shown while up or while missing, for your own group or the whole raid, per raid size.",
      },
      {
        title: "Nameplates",
        text: "Enemy plates with your debuffs, threat badges solo and in groups, casts with spell icon, target and interrupt state, quest objective marks and raid markers. Styled friendly plates in the open world.",
      },
      {
        title: "Cast and swing bars",
        text: "Your cast bar with its target; target, focus and boss casts that show whether you can interrupt them; and a swing timer that follows your cast bar.",
      },
      {
        title: "Auras",
        text: "Your buffs and debuffs, and your auras on other frames, drawn by the game itself so they stay correct in combat.",
      },
    ],
  },
  {
    id: "combat",
    title: "Combat",
    intro: (
      <>
        Your cooldowns, threat and the fight ahead, from the data the client actually gives.{" "}
        <Link href="/in-combat">What SuuUI can show in combat</Link>
      </>
    ),
    Clip: ClipMeters,
    features: [
      {
        title: "Action bars",
        text: "A dock for bars 1–4 plus bars 5–8, stance and pet bars, visibility rules (always, in combat, on mouseover), and a keybind mode: hover a button, press a key.",
      },
      {
        title: "Cooldown Manager",
        text: "SuuUI's own cooldown and aura tracker, with ready-made presets for every class and spec. Shared slots (one icon for several spells, or the best spell you know), collections, reminders for missing buffs, effects shown on cooldown icons, sounds, and conditions on anything: group or raid, classes in your group, role, stance or form, combat, instance, target type and talents.",
        link: { label: "Watch your spec's preset", href: "#presets" },
      },
      {
        title: "Alerts and threat",
        text: "Alerts for threat and aggro, and for being about to pull. A threat meter for your group. A pull countdown on the game's own countdown, so your whole group sees it, with or without a boss mod.",
      },
      {
        title: "Damage meter",
        text: "Damage, healing, interrupts, dispels, deaths and more, per fight or overall, on the game's own combat data.",
      },
      {
        title: "Encounter timeline and readiness",
        text: "Boss abilities riding toward “now”, also from DBM or BigWigs timers. A readiness panel shows whose big cooldowns are ready before the pull.",
      },
    ],
  },
  {
    id: "everyday",
    title: "Everyday",
    intro: "Chat, bags, the minimap and everything between pulls, in the same language as the fight.",
    Clip: ClipNotifications,
    features: [
      {
        title: "Chat",
        text: "Tabs, message categories, a global panel for public channels, conversations and a cleaner input field.",
      },
      {
        title: "Minimap and micro menu",
        text: "SuuUI's own minimap and micro menu, with the Jewel on the ring to open the settings.",
      },
      {
        title: "Bags",
        text: "Bags and bank with sorting, a search across all your characters, and selling junk at a vendor.",
      },
      {
        title: "Objective tracker",
        text: "Quests with their objectives and quest items, plus tracked profession recipes.",
      },
      {
        title: "Notifications",
        text: "One stack for repairs, full bags, ready checks, loot rolls, requests, battlegrounds, and friends and guild members coming online.",
      },
      { title: "Loot and tooltips", text: "The loot window and loot rolls, and the game's tooltips in SuuUI's look." },
      { title: "Campsite", text: "Alerts at a campfire: one nearby, resting by it, and Camp Benefits gained." },
      {
        title: "Settings window",
        text: "Searchable, every change live, previews at real size and plain-language descriptions.",
      },
      { title: "Edit mode", text: "Move every SuuUI frame on a snap grid, and reset one frame or all of them." },
      {
        title: "Profiles",
        text: "Any number of profiles, switched automatically by your role, with import and export.",
      },
    ],
  },
  {
    id: "windows",
    band: true,
    title: "Windows",
    intro: "Blizzard's windows in SuuUI's look, with the keys, tabs and slots you already know.",
    Clip: ClipTalents,
    features: [
      { title: "Character", text: "Forever's character window in SuuUI's look, with its stats and every tab." },
      {
        title: "Spellbook and talents",
        text: "A spellbook that shows cooldowns and the spells you can train. Talents planned until you press Apply, a level-up card with your new spells, and the Legacy window.",
      },
      {
        title: "Professions",
        text: "Your professions at a glance, recipe lists with filters, where each recipe is learned, and tracking.",
      },
      {
        title: "Social",
        text: "Friends, recent allies and friend requests. Raid groups where you drag members between groups.",
      },
      {
        title: "Guild",
        text: "Guild chat with the message of the day, a roster with class, notes and member details, the guild information and log, and guild settings: ranks, permissions, bank tabs.",
      },
      {
        title: "Group Finder",
        text: "One list of groups and players looking for groups, from the game's group finder and from public chat in English, Korean and Chinese, with what each group has and still needs. List yourself, post a chat ad, search Who, and get notes for groups that need you.",
      },
    ],
  },
  {
    id: "map",
    title: "World map",
    intro: "Forever's world map in SuuUI's look, with everything around you on it.",
    Clip: ClipWorldMap,
    features: [
      {
        title: "World map",
        isNew: true,
        text: "Opens large in the middle of the screen with your quest log beside it and the world still in view, or small under the micro menu. Your quests' markers in SuuUI's look, and map filters in its header.",
      },
      {
        title: "Map pins",
        isNew: true,
        text: "Quests you can pick up now, also those started by dropped items; dungeon and raid entrances with their levels; flight masters, services and trainers; rares and treasures; holiday quests while the holiday is on; and unexplored areas. Hover a quest and its pins stand out.",
      },
      {
        title: "Map marks",
        isNew: true,
        text: "Your own marks on the map and minimap (Ctrl+click): a name, one of eight symbols, the game's navigation arrow to them, and posting them to your group.",
      },
    ],
  },
];

export default async function FeaturesPage() {
  const { latest: latestRelease } = await getReleaseData();

  return (
    <>
      <PageIntro
        eyebrow="Features"
        title="Every frame, rebuilt"
        leadWidth={700}
        lead="Unit frames, nameplates, action bars, cooldowns, casts and auras share one visual language and stay quiet until something needs you. Every feature is a module you can switch off, and Blizzard's own frame comes back in its place."
      >
        <nav aria-label="On this page" className={s.jumpNav}>
          {groups.map((group) => (
            <Fragment key={group.id}>
              <Link href={`#${group.id}`} className={s.jumpLink}>
                {group.title}
              </Link>
              {group.id === "combat" && (
                <Link href="#presets" className={s.jumpLink}>
                  Presets
                </Link>
              )}
            </Fragment>
          ))}
          <Link href="#next" className={s.jumpLink}>
            Coming next
          </Link>
        </nav>
      </PageIntro>

      {groups.map((group) => (
        <Fragment key={group.id}>
          <Section id={group.id} aria-labelledby={`${group.id}-title`} tight band={group.band}>
            <div className={s.groupHead}>
              <Diamond />
              <Heading id={`${group.id}-title`}>{group.title}</Heading>
            </div>
            <Sublead className={s.groupIntro}>{group.intro}</Sublead>
            <div className={s.groupShot}>
              <group.Clip ratio="21 / 9" />
            </div>
            <Grid min={320} className={s.featureGrid}>
              {group.features.map((feature) => (
                <article key={feature.title} className={s.feature}>
                  {feature.isNew ? (
                    <div className={s.featureTitleRow}>
                      <Heading level={3} className={s.featureTitle}>
                        {feature.title}
                      </Heading>
                      <span className={s.newLabel}>New</span>
                    </div>
                  ) : (
                    <Heading level={3} className={s.featureTitle}>
                      {feature.title}
                    </Heading>
                  )}
                  <Body>{feature.text}</Body>
                  {feature.link && (
                    <TextLink href={feature.link.href} className={s.featureLink}>
                      {feature.link.label}
                    </TextLink>
                  )}
                </article>
              ))}
            </Grid>
          </Section>

          {group.id === "combat" && (
            <Section id="presets" aria-labelledby="presets-title" tight band>
              <div className={s.groupHead}>
                <Diamond />
                <Heading id="presets-title">Presets</Heading>
              </div>
              <Sublead className={s.groupIntro}>
                Every class and spec starts with a ready-made Cooldown Manager. Pick yours to watch it in a fight: procs
                lighting up, debuffs ticking on the target, cooldowns counting down and popping back ready.
              </Sublead>
              <div className={s.groupShot}>
                <PresetsDemo />
              </div>
            </Section>
          )}
        </Fragment>
      ))}

      <Section id="next" aria-labelledby="next-title" band>
        <div className={s.next}>
          <div className={s.nextIntro}>
            <Heading id="next-title" className={s.nextTitle}>
              Coming next
            </Heading>
            <Body className={s.nextText}>
              SuuUI grows in small steps, each one confirmed in game before the next begins.
            </Body>
            <ButtonLink href="/download" variant="primary" className={s.nextButton}>
              Download {latestRelease.version}
            </ButtonLink>
          </div>
          <StatusList
            className={s.nextList}
            itemClassName={s.nextItem}
            items={[
              { status: "next", text: "Merchant, mail and trainer: first versions in testing" },
              { status: "next", text: "Auction house and collections" },
              {
                status: "planned",
                text: "Density and accessibility presets, a performance and taint pass, and a plugin developer kit",
              },
            ]}
          />
        </div>
      </Section>
    </>
  );
}
