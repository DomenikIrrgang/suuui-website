import type { ComponentType, CSSProperties, ReactNode } from "react";
import { ClipCooldowns } from "@/components/demo/ClipCooldowns";
import { ClipFrames } from "@/components/demo/ClipFrames";
import { ClipGroupFinder } from "@/components/demo/ClipGroupFinder";
import { ClipMeters } from "@/components/demo/ClipMeters";
import { ClipNameplates } from "@/components/demo/ClipNameplates";
import { ClipSettings } from "@/components/demo/ClipSettings";
import { LiveHud } from "@/components/demo/LiveHud";
import { Crest, markHost } from "@/components/Mark";
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
import s from "./page.module.css";

const pillars = [
  {
    title: "One design system",
    text: "Every colour, size, font and motion comes from shared design tokens. Nothing is styled ad hoc, so every part of the UI reads the same way.",
  },
  {
    title: "Modular",
    text: "Every feature is a module you can switch off, and Blizzard's own frame comes back in its place. Plugins use the very same public API as the built-in modules.",
  },
  {
    title: "Combat-safe",
    text: "Built around the values the game hides from addons in combat: SuuUI never reads them, it hands them to the game to draw. No taint, no errors when you pull, in dungeons and raids too.",
  },
];

const highlights: { title: string; text: string; Clip: ComponentType }[] = [
  {
    title: "Unit and group frames",
    text: "Player, target, focus and boss frames, and group frames up to 40 players. Debuffs you can remove show by type, even in combat.",
    Clip: ClipFrames,
  },
  {
    title: "Cooldown Manager",
    text: "Your cooldowns, procs and auras with ready-made presets for every class and spec, plus sounds and conditions on anything.",
    Clip: ClipCooldowns,
  },
  {
    title: "Nameplates",
    text: "Your debuffs, threat badges, casts with their interrupt state and quest objective marks on every enemy plate.",
    Clip: ClipNameplates,
  },
  {
    title: "Damage and threat meters",
    text: "Damage, healing, interrupts, dispels and deaths from the game's own combat data, and a threat meter for your group.",
    Clip: ClipMeters,
  },
  {
    title: "Group Finder",
    text: "One list of groups from the game's group finder and from public chat in multiple languages, with what each group still needs.",
    Clip: ClipGroupFinder,
  },
  {
    title: "Settings and edit mode",
    text: "Search every option and see each change live, at real size. Move every frame on a snap grid, and switch profiles by role.",
    Clip: ClipSettings,
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
    text: "A big defensive, an external or a shield is active on the unit.",
  },
  {
    tag: "Magic",
    color: "var(--dispel-magic)",
    title: "Dispellable",
    text: "A debuff you can remove, coloured by its type: magic, curse, poison or disease.",
  },
];

const newInBeta = [
  {
    title: "Group Finder.",
    text: "Forever's group finder rebuilt, with groups posted in public chat in multiple languages joining the same list. List yourself, post a chat ad and search Who.",
  },
  {
    title: "Talents and Legacy.",
    text: "Plan your points across the three trees, then press Apply. The Legacy window shows your challenges and the reward track.",
  },
  {
    title: "Professions.",
    text: "Recipe lists with filters and sorting, where a recipe you don't know yet is learned, and tracked recipes in the objective tracker.",
  },
  {
    title: "Social and Guild.",
    text: "Friends, recent allies and raid groups you rearrange by dragging; the guild roster, notes, log and settings.",
  },
  {
    title: "Menus and invites.",
    text: "Right-click menus in SuuUI's look, and group invites that ask for your role as a notification.",
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
        Type <Code>/suu</Code> to open the settings, place your frames with Edit layout and load your spec&apos;s
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
        text: "Character, spellbook, talents and Legacy, professions, social and guild, group finder",
      },
      { status: "next", text: "World map and map pins" },
      { status: "planned", text: "Quest log, mail, merchant, trainer, auction house, collections" },
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
          <Lead className={s.heroLead}>
            SuuUI replaces WoW Forever&apos;s default interface with one consistent UI. Frames stay calm and legible,
            and colour, glow and motion appear only when something needs you: a cooldown coming ready, a debuff you
            can remove on your tank, a cast you can interrupt.
          </Lead>
          <ButtonRow className={s.heroButtons}>
            <ButtonLink href="/download" variant="primary">
              {download}
            </ButtonLink>
            <ButtonLink href="/features">Explore the features</ButtonLink>
          </ButtonRow>
          <div className={s.heroMeta}>
            <span className={s.tabular}>
              {latestRelease.channel} · released {formatDate(latestRelease.date, "short")}
            </span>
            <span>Free and open source</span>
            <span>
              Also on <a href={links.curseforge}>CurseForge</a> and <a href={links.wago}>Wago</a>
            </span>
          </div>
        </div>
        <div className={s.heroShot}>
          <div className={s.heroDemo}>
            <span aria-hidden="true" className={cx(s.corner, s.cornerTopLeft)} />
            <span aria-hidden="true" className={cx(s.corner, s.cornerBottomRight)} />
            <LiveHud />
          </div>
        </div>
      </section>

      <Section aria-labelledby="why-title" band>
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

      <Section aria-labelledby="features-title">
        <SectionHeader
          eyebrow="Features"
          title="Everything you watch in a fight, and everything between pulls"
          id="features-title"
        />
        <Sublead>
          From unit frames and nameplates to bags, chat and Blizzard&apos;s own windows, every frame is rebuilt in one
          design.
        </Sublead>
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
        <div className={s.blockTop}>
          <ButtonLink href="/features">See every feature</ButtonLink>
        </div>
      </Section>

      <Section aria-labelledby="signals-title" band>
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

      <Section aria-labelledby="new-title">
        <div className={s.split}>
          <div className={s.splitIntro}>
            <SectionHeader eyebrow="What's new" title="New in this beta" id="new-title" />
            <p className={s.versionLine}>
              Version {latestRelease.version} · {formatDate(latestRelease.date)}
            </p>
            <Sublead className={s.newLead}>
              Forever&apos;s own windows join the design: the group finder, talents and Legacy, professions, social
              and guild.
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

      <Section aria-labelledby="start-title" band>
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
        <Sublead>Built in small steps, each one confirmed in game before the next begins.</Sublead>
        <ol className={s.phases}>
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

      <Section aria-labelledby="community-title" band>
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
    </>
  );
}
