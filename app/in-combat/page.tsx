import type { Metadata } from "next";
import { BandJewel, bandClass, ButtonLink, Container, Heading, PageIntro, Strong, cx } from "@/components/ui";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "What SuuUI can show in combat",
  description:
    "During combat WoW Forever keeps many values secret from addons. What SuuUI shows live in every fight, what only between pulls, and what no addon can show.",
};

type Mark = "live" | "pulls" | "none";

const groups: { id: string; mark: Mark; title: string; band?: boolean; rows: { term: string; text: string }[] }[] = [
  {
    id: "live",
    band: true,
    mark: "live",
    title: "Live in every fight",
    rows: [
      {
        term: "Health, power and their percentages",
        text: "For everyone. The game draws them; SuuUI never calculates with them. The low-health colour comes from the game too. Your own health and power stay hidden from addons even out of combat.",
      },
      {
        term: "Buffs, debuffs, heals over time and shields",
        text: "Drawn by the game's own aura frames, with SuuUI choosing which kinds show where. In dungeon combat no addon can tell which spell an aura is, so lists like the Cooldown Manager's are filtered by the game itself.",
      },
      {
        term: "Incoming heals and absorbs",
        text: "Shown after the health bar, from the game's own heal prediction.",
      },
      {
        term: "Your cooldowns, casts and interrupt",
        text: "Whether a cooldown is running stays readable; the sweep and digits come from the game. Your interrupt's readiness counts from when you used it, so it's known even in boss fights.",
      },
      {
        term: "Enemy casts you can interrupt",
        text: "On target, focus, boss frames and nameplates, each with your own interrupt's state at its end.",
      },
      {
        term: "Who holds a mob, and who's over the tank",
        text: 'Readable on every mob, bosses included, so aggro borders, threat badges and the "about to pull" warning work everywhere. Threat percentages sort on ordinary mobs; on bosses they show but can\'t be compared, so the threat meter orders by state.',
      },
      {
        term: "Damage, healing, interrupts, dispels and deaths",
        text: "From Blizzard's own meter, which hands the rows over already ranked. The share of the total needs a division, so it appears when combat ends.",
      },
      {
        term: "Your swing timer",
        text: "Driven by the game's own timer. Without the combat log there's no parry haste or clip detection.",
      },
    ],
  },
  {
    id: "pulls",
    mark: "pulls",
    title: "Between pulls only",
    rows: [
      {
        term: "Your group's big cooldowns",
        text: "Each player's SuuUI shares its own cooldowns in the readiness panel before the pull. It hides on the pull and comes back when the fight ends.",
      },
      {
        term: "Talent and Legacy changes",
        text: "Planned until you press Apply, out of combat only. Character, reputation and similar windows don't open in combat.",
      },
      {
        term: "Switching profiles and modules",
        text: "A role change switches your profile when the fight ends, and turning a module on or off waits for the end of combat.",
      },
    ],
  },
  {
    id: "none",
    band: true,
    mark: "none",
    title: "Not available to any addon",
    rows: [
      {
        term: "Your group's cooldowns in a dungeon fight",
        text: "There's no combat log, other players' casts are hidden, and addon messages are blocked in all dungeon combat. SuuUI removes the slot rather than freeze a timer.",
      },
      {
        term: "Who interrupts first",
        text: "Other players' interrupts are hidden, so SuuUI shows only yours and never claims who goes first.",
      },
      {
        term: "A warning that a buff is missing",
        text: "In combat the game never tells an addon that an aura is missing. A missing one shows as a grey placeholder in its slot instead, and reminders work out of combat.",
      },
    ],
  },
];

/** Filled diamond: live; outlined diamond: between pulls; dash: not available. */
function Marker({ mark, large }: { mark: Mark; large?: boolean }) {
  return <span aria-hidden="true" className={cx(s.mark, s[mark], large && s.large)} />;
}

export default function InCombatPage() {
  return (
    <>
      <PageIntro
        eyebrow="In combat"
        title="What SuuUI can show in a fight"
        compact
        leadWidth={720}
        lead="During combat, and above all in dungeons and raids, WoW Forever keeps many values secret from addons. An addon can still show them, but it can't read them, compare them or do maths with them."
      >
        <p className={s.introMore}>
          SuuUI is built around that. It hands secret values straight to the game to draw, hides a slot when
          there&apos;s no data for it, and never shows a timer it can&apos;t trust. That&apos;s why it keeps working when
          you pull.
        </p>
      </PageIntro>

      <section aria-label="Legend" className={s.legendSection}>
        <Container className={s.legend}>
          <span className={s.legendItem}>
            <Marker mark="live" />
            <Strong>Live</Strong> in every fight
          </span>
          <span className={s.legendItem}>
            <Marker mark="pulls" />
            <Strong>Between pulls</Strong> only
          </span>
          <span className={s.legendItem}>
            <Marker mark="none" />
            <Strong>Not available</Strong> to any addon
          </span>
        </Container>
      </section>

      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`${group.id}-title`} className={cx(s.group, group.band && bandClass)}>
          {group.band && <BandJewel />}
          <Container>
            <Heading id={`${group.id}-title`} className={s.groupTitle}>
              <Marker mark={group.mark} large />
              {group.title}
            </Heading>
            <dl className={s.rows}>
              {group.rows.map((row) => (
                <div key={row.term} className={s.row}>
                  <dt className={s.term}>{row.term}</dt>
                  <dd className={s.text}>{row.text}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      ))}

      <section aria-labelledby="confirm-title" className={s.confirmSection}>
        <Container>
          <div className={s.confirm}>
            <div className={s.confirmText}>
              <Heading id="confirm-title" className={s.confirmTitle}>
                Tested on the client itself
              </Heading>
              <p className={s.confirmBody}>
                These come from probing the WoW Forever client in the open world and in dungeon combat. Boss fights and
                a few other details are still being confirmed; they&apos;re listed under Compatibility and known issues.
              </p>
            </div>
            <ButtonLink href="/compatibility" className={s.confirmButton}>
              Known issues
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
