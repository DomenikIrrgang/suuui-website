import type { ComponentType, CSSProperties, ReactNode } from "react";
import { ClipCooldowns } from "@/components/demo/ClipCooldowns";
import { ClipFrames } from "@/components/demo/ClipFrames";
import { ClipGroupFinder } from "@/components/demo/ClipGroupFinder";
import { ClipMeters } from "@/components/demo/ClipMeters";
import { ClipNameplates } from "@/components/demo/ClipNameplates";
import { ClipWorldMap } from "@/components/demo/ClipWorldMap";
import { LiveHud } from "@/components/demo/LiveHud";
import { Crest, markHost } from "@/components/Mark";
import { DesktopOnly } from "@/components/Responsive";
import {
  Body,
  ButtonLink,
  ButtonRow,
  Card,
  Code,
  cx,
  Diamond,
  Grid,
  Heading,
  Lead,
  Section,
  SectionHeader,
  StatusList,
  Strong,
  Sublead,
  TextLink,
  type Status,
} from "@/components/ui";
import { getReleaseData } from "@/lib/releases";
import { formatDate, links } from "@/lib/site";
import {
  MobileDemo,
  MobileDiscord,
  MobileFeatures,
  MobileNews,
  MobileReady,
  MobileRoadmap,
  MobileSignals,
  MobileWhy,
  type MobilePhase,
} from "./HomeMobile";
import s from "./page.module.css";

const pillars = [
  {
    title: "One design system",
    short: "Every colour, size and motion comes from one set of tokens.",
    text: "Every colour, size, font and motion comes from shared design tokens. Nothing is styled ad hoc, so every part of the UI reads the same way.",
  },
  {
    title: "Modular",
    short: "Switch any part off and Blizzard's own frame comes back.",
    text: "Every feature is a module you can switch off, and Blizzard's own frame comes back in its place. Plugins use the very same public API as the built-in modules.",
  },
  {
    title: "Combat-safe",
    short: "It never reads what the game hides, so no taint and no errors when you pull.",
    text: "Built around the values the game hides from addons in combat: SuuUI never reads them, it hands them to the game to draw. No taint, no errors when you pull, in dungeons and raids too.",
  },
];

/** `short` and `href`: on a phone each highlight is a link to its part of the Features page. */
const highlights: { title: string; text: string; short: string; href: string; Clip: ComponentType }[] = [
  {
    title: "Unit and group frames",
    short: "Debuffs you can remove and defensives beside each bar.",
    href: "/features#frames",
    text: "Player, target, focus and boss frames, and group frames up to 40 players. Debuffs you can remove show by type and defensives beside each bar, even in combat.",
    Clip: ClipFrames,
  },
  {
    title: "Cooldown Manager",
    short: "Ready-made presets for every class and spec.",
    href: "/features#combat",
    text: "Your cooldowns, procs and auras with ready-made presets for every class and spec, plus sounds and conditions on anything.",
    Clip: ClipCooldowns,
  },
  {
    title: "Nameplates",
    short: "Your debuffs, threat and the casts you can interrupt.",
    href: "/features#frames",
    text: "Your debuffs, threat badges, casts with their interrupt state and quest objective marks on every enemy plate.",
    Clip: ClipNameplates,
  },
  {
    title: "Damage and threat meters",
    short: "From the game's own combat data.",
    href: "/features#combat",
    text: "Damage, healing, interrupts, dispels and deaths from the game's own combat data, and a threat meter for your group.",
    Clip: ClipMeters,
  },
  {
    title: "World map",
    short: "Pins for quests, dungeons, trainers and rares.",
    href: "/features#map",
    text: "Pins for everything around you: quests you can pick up, dungeon entrances with their levels, flight masters, trainers and rares. Hover a quest and its pins stand out.",
    Clip: ClipWorldMap,
  },
  {
    title: "Group Finder",
    short: "Groups from the finder and public chat in one list.",
    href: "/features#windows",
    text: "One list of groups from the game's group finder and from public chat in English, Korean and Chinese, with what each group still needs.",
    Clip: ClipGroupFinder,
  },
];

const signals: { tag: string; color?: string; title: string; text: string }[] = [
  {
    tag: "Ready",
    color: "var(--arcane)",
    title: "Act now",
    text: "A cooldown that is up, a cast you can interrupt, a quest ready to turn in.",
  },
  {
    tag: "Aggro",
    color: "var(--ember)",
    title: "Danger",
    text: "Something will hurt you or someone: aggro on a non-tank, low health, a lethal cast.",
  },
  {
    tag: "Losing",
    color: "var(--amber)",
    title: "Warning",
    text: "Heading toward trouble: low mana, an aura about to expire, a tank about to lose a mob.",
  },
  {
    tag: "Healing",
    title: "Healing",
    text: "Health on its way: incoming heals after the health bar, heals over time.",
  },
  {
    tag: "Warded",
    color: "var(--ward)",
    title: "Protected",
    text: "A big defensive or an external is up on the unit: Shield Wall, Ice Block, Blessing of Protection.",
  },
  {
    tag: "Magic",
    color: "var(--dispel-magic)",
    title: "Dispellable",
    text: "A debuff you can remove, coloured by its type: magic, curse, poison or disease.",
  },
];

/** On a phone the items with a `short` text show first, and the rest once opened. */
const newInBeta: { title: string; text: string; short?: string }[] = [
  {
    title: "World map.",
    short: "Forever's map in SuuUI's look, with your quest log beside it.",
    text: "Forever's world map in SuuUI's look. It opens large in the middle of the screen, with your quest log beside it and the world still in view.",
  },
  {
    title: "Map pins.",
    short: "Quests, dungeons, trainers and rares, with filters.",
    text: "Quests you can pick up, dungeon and raid entrances with their levels, flight masters, trainers, rares and treasures, with filters in the map's header.",
  },
  {
    title: "Map marks.",
    text: "Ctrl+click the map to place your own mark, follow it with the game's arrow, and post it to your group.",
  },
  {
    title: "Defensives and Warded.",
    short: "Group frames show real defensives, and the big ones mark the frame.",
    text: "Party and raid frames show real defensives, from a list you control, and the big ones mark the frame Warded.",
  },
  {
    title: "Buffs and debuffs apart.",
    text: "On target, focus, party and raid frames, buffs and debuffs each keep their own side, yours first.",
  },
];

const steps: { title: string; text: ReactNode }[] = [
  {
    title: "Install",
    text: "Get SuuUI from CurseForge or Wago Addons, or download the zip from GitHub and unpack it into your AddOns folder.",
  },
  {
    title: "Enable",
    text: (
      <>
        Start the game, or type <Code>/reload</Code>, and make sure SuuUI is enabled in the AddOns list.
      </>
    ),
  },
  {
    title: "Make it yours",
    text: (
      <>
        Type <Code>/suu</Code> to open the settings, place your frames with Edit layout and check your spec&apos;s
        Cooldown Manager preset.
      </>
    ),
  },
];

const roadmap: { phase: string; title: string; items: { status: Status; text: string }[] }[] = [
  {
    phase: "Phase 0",
    title: "Foundation",
    items: [
      {
        status: "done",
        text: "Tokens and fonts, core services, the module system and plugin API, settings window and edit mode",
      },
    ],
  },
  {
    phase: "Phase 1",
    title: "Combat HUD",
    items: [
      {
        status: "done",
        text: "Unit frames, cast bars and swing timer, auras, action bars, Cooldown Manager, party and raid frames, nameplates, alerts and threat meter, damage meter, encounter timeline and readiness",
      },
    ],
  },
  {
    phase: "Phase 2",
    title: "World and everyday play",
    items: [
      {
        status: "done",
        text: "Minimap, chat, objective tracker, notifications, bags and bank, loot, tooltips, campsite",
      },
    ],
  },
  {
    phase: "Phase 3",
    title: "Blizzard windows",
    items: [
      {
        status: "done",
        text: "Character, spellbook, talents and Legacy, professions, social and guild, group finder, world map, quest log and map pins",
      },
      { status: "next", text: "Merchant, mail and trainer: first versions in testing" },
      { status: "next", text: "Auction house and collections" },
    ],
  },
  {
    phase: "Phase 4",
    title: "Depth and release",
    items: [
      {
        status: "planned",
        text: "Density and accessibility presets, a performance and taint pass, a plugin developer kit, and the 1.0 release",
      },
    ],
  },
];

/** Where things stand, in three lines, for the phone layout's roadmap card. */
const roadmapSummary = {
  done: "The combat HUD, everyday play, Blizzard's windows and the world map",
  next: "Merchant, mail and trainer, first versions in testing; then the auction house and collections",
  later: "Density and accessibility presets, a performance and taint pass, a plugin developer kit, and 1.0",
};

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

/** Each phase as one line of text, with what's next in it named after what's done. */
const mobilePhases: MobilePhase[] = roadmap.map((phase, i) => {
  const done = phase.items.filter((item) => item.status === "done").map((item) => item.text);
  const next = phase.items.filter((item) => item.status === "next").map((item) => lowerFirst(item.text));
  const planned = phase.items.filter((item) => item.status === "planned").map((item) => item.text);
  const status = next.length > 0 ? "In progress" : planned.length > 0 ? "Planned" : "Done";
  const text = [...done, ...planned].join(". ") + (next.length > 0 ? `. Next: ${next.join("; ")}.` : "");
  return { number: i, title: phase.title, status, text };
});

export default async function HomePage() {
  const { latest: latestRelease, interfaceVersion } = await getReleaseData();

  const download = `Download ${latestRelease.version}`;

  return (
    <>
      <section aria-labelledby="hero-title" className={s.hero}>
        <div className={s.heroInner}>
          <span aria-hidden="true" className={cx(s.crestHost, markHost)}>
            <Crest id="hero" className={s.crest} />
          </span>
          <p className={s.kicker}>The interface for WoW Forever</p>
          <Heading level={1} id="hero-title" className={s.heroTitle}>
            Quiet until it matters
          </Heading>
          <Lead className={cx(s.heroLead, "desktop-only")}>
            SuuUI replaces WoW Forever&apos;s default interface with one consistent UI. Frames stay calm and legible,
            and colour, glow and motion appear only when something needs you: a cooldown coming ready, a debuff you
            can remove on your tank, a cast you can interrupt.
          </Lead>
          <Lead className={cx(s.heroLead, "mobile-only")}>
            One consistent interface for WoW Forever. Calm until something needs you: a cooldown coming ready, a
            debuff on your tank, a cast you can interrupt.
          </Lead>
          <ButtonRow className={cx(s.heroButtons, "desktop-only")}>
            <ButtonLink href="/download" variant="primary">
              {download}
            </ButtonLink>
            <ButtonLink href="/features">Explore the features</ButtonLink>
          </ButtonRow>
          <div className={cx(s.heroButtonsPhone, "mobile-only")}>
            <ButtonLink href="/features" variant="primary">
              Explore the features
            </ButtonLink>
            <ButtonLink href="/download">Get it on your computer</ButtonLink>
          </div>
          <div className={cx(s.heroMeta, "desktop-only")}>
            <span className={s.tabular}>
              {latestRelease.channel} · released {formatDate(latestRelease.date, "short")}
            </span>
            <span>Free and open source</span>
            <span>
              Also on <a href={links.curseforge}>CurseForge</a> and <a href={links.wago}>Wago</a>
            </span>
          </div>
          <p className={cx(s.heroMetaPhone, "mobile-only")}>
            {latestRelease.channel} {latestRelease.version} · Free and open source
          </p>
        </div>
        <div className={cx(s.heroShot, "desktop-only")}>
          <div className={s.heroDemo}>
            <span aria-hidden="true" className={cx(s.corner, s.cornerTopLeft)} />
            <span aria-hidden="true" className={cx(s.corner, s.cornerBottomRight)} />
            <DesktopOnly>
              <LiveHud />
            </DesktopOnly>
          </div>
        </div>
      </section>

      <MobileDemo />

      <Section aria-labelledby="why-title" band className="desktop-only">
        <SectionHeader eyebrow="Why SuuUI" title="One interface, built for the client as it is" id="why-title" />
        <Grid className={s.blockTop}>
          {pillars.map((pillar) => (
            <Card key={pillar.title}>
              <Diamond className={s.pillarDiamond} />
              <Heading level={3}>{pillar.title}</Heading>
              <Body>{pillar.text}</Body>
            </Card>
          ))}
        </Grid>
      </Section>

      <MobileWhy pillars={pillars} />

      <Section aria-labelledby="features-title" className="desktop-only">
        <SectionHeader
          eyebrow="Features"
          title="Everything you watch in a fight, and everything between pulls"
          id="features-title"
        />
        <Sublead>
          From unit frames and nameplates to bags, chat, the world map and Blizzard&apos;s own windows, every frame is
          rebuilt in one design.
        </Sublead>
        <DesktopOnly>
          <Grid min={320} className={s.highlights}>
            {highlights.map((item) => (
              <article key={item.title} className={s.highlight}>
                <item.Clip />
                <div className={s.highlightText}>
                  <Heading level={3}>{item.title}</Heading>
                  <Body>{item.text}</Body>
                </div>
              </article>
            ))}
          </Grid>
        </DesktopOnly>
        <div className={s.blockTop}>
          <ButtonLink href="/features">See every feature</ButtonLink>
        </div>
      </Section>

      <MobileFeatures features={highlights.map(({ title, short, href }) => ({ title, short, href }))} />

      <Section aria-labelledby="signals-title" band className="desktop-only">
        <SectionHeader eyebrow="The design" title="Colour always means something" id="signals-title" />
        <Sublead className={s.wideSublead}>
          Everything sits in quiet neutrals until it has something to say. Each colour on screen is one of six
          signals, and each signal also comes with a word, a shape or a position, so nothing relies on colour alone.
        </Sublead>
        <Grid className={s.signals} style={{ gap: 20 }}>
          {signals.map((signal) => (
            <Card key={signal.title} className={s.signal}>
              {signal.color ? (
                <span className={s.signalTag} style={{ "--signal": signal.color } as CSSProperties}>
                  {signal.tag}
                </span>
              ) : (
                <span aria-hidden="true" className={s.healBar}>
                  <span className={s.healFill} />
                  <span className={s.healIncoming} />
                </span>
              )}
              <Heading level={3} className={s.signalTitle}>
                {signal.title}
              </Heading>
              <Body className={s.signalText}>{signal.text}</Body>
            </Card>
          ))}
        </Grid>
      </Section>

      <MobileSignals signals={signals} />

      <MobileDiscord />

      <Section aria-labelledby="new-title" className="desktop-only">
        <div className={s.split}>
          <div className={s.splitIntro}>
            <SectionHeader eyebrow="What's new" title="New in this beta" id="new-title" />
            <p className={s.versionLine}>
              Version {latestRelease.version} · {formatDate(latestRelease.date)}
            </p>
            <Sublead className={s.newLead}>
              The world map joins the design, with pins for everything around you, and party and raid frames learn
              which buffs are real defensives.
            </Sublead>
            <ButtonLink href="/changelog" className={s.newButton}>
              Read the changelog
            </ButtonLink>
          </div>
          <ul className={s.newList}>
            {newInBeta.map((item) => (
              <li key={item.title} className={s.newItem}>
                <Diamond size={6} className={s.newDiamond} />
                <Body>
                  <Strong>{item.title}</Strong> {item.text}
                </Body>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <MobileNews
        versionLine={`Version ${latestRelease.version} · ${formatDate(latestRelease.date)}`}
        items={newInBeta}
      />

      <Section aria-labelledby="start-title" band className="desktop-only">
        <SectionHeader eyebrow="Get started" title="Three steps to a new interface" id="start-title" />
        <Grid as="ol" className={s.steps}>
          {steps.map((step, i) => (
            <li key={step.title} className={s.step}>
              <span aria-hidden="true" className={s.stepNumber}>
                <span className={s.stepFrame} />
                <span className={s.stepDigit}>{i + 1}</span>
              </span>
              <Heading level={3}>{step.title}</Heading>
              <Body>{step.text}</Body>
            </li>
          ))}
        </Grid>
        <div className={s.startFoot}>
          <ButtonLink href="/download" variant="primary">
            {download}
          </ButtonLink>
          <TextLink href="/guide">Read the getting started guide</TextLink>
          <span className={s.requirement}>Needs the WoW Forever client, interface {interfaceVersion}</span>
        </div>
      </Section>

      <Section id="roadmap" aria-labelledby="roadmap-title">
        <SectionHeader eyebrow="Roadmap" title="Where SuuUI is going" id="roadmap-title" />
        <Sublead className="desktop-only">
          Built in small steps, each one confirmed in game before the next begins.
        </Sublead>
        <MobileRoadmap phases={mobilePhases} summary={roadmapSummary} />
        <ol className={cx(s.phases, "desktop-only")}>
          {roadmap.map((phase) => (
            <li key={phase.phase} className={s.phase}>
              <div className={s.phaseHead}>
                <span className={s.phaseLabel}>{phase.phase}</span>
                <Heading level={3}>{phase.title}</Heading>
              </div>
              <StatusList items={phase.items} className={s.phaseItems} />
            </li>
          ))}
        </ol>
      </Section>

      <Section aria-labelledby="community-title" band className="desktop-only">
        <h2 id="community-title" className="visually-hidden">
          Community and support
        </h2>
        <Grid min={360}>
          <Card className={s.communityCard}>
            <Heading level={3} className={s.communityTitle}>
              Join the Discord
            </Heading>
            <Body className={s.communityText}>
              Ask questions, share your layouts and profiles, and follow what&apos;s coming next.
            </Body>
            <ButtonLink href={links.discord} className={s.communityButton}>
              Join on Discord
            </ButtonLink>
          </Card>
          <Card className={s.communityCard}>
            <Heading level={3} className={s.communityTitle}>
              Found a bug?
            </Heading>
            <Body className={s.communityText}>
              Type <Code>/suu errors</Code> to list what SuuUI caught, then open an issue on GitHub with what you did
              and what happened.
            </Body>
            <ButtonLink href={links.issues} className={s.communityButton}>
              Open an issue
            </ButtonLink>
          </Card>
        </Grid>
      </Section>

      <MobileReady />
    </>
  );
}
