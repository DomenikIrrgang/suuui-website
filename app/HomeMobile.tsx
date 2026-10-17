"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { MoreButton } from "@/components/Mobile";
import { ShareLink } from "@/components/ShareLink";
import { BandJewel, bandClass, ButtonLink, Code, Container, cx, Diamond, Eyebrow, Heading } from "@/components/ui";
import { links } from "@/lib/site";
import s from "./HomeMobile.module.css";

/*
 * The home page's phone layout, for people discovering SuuUI: a small demo they can tap through, the
 * features as links, and shorter text everywhere with the full text a tap away.
 */

type Short = { title: string; text: string; short?: string };

function MobileSection({
  band,
  labelledBy,
  label,
  id,
  className,
  children,
}: {
  band?: boolean;
  labelledBy?: string;
  label?: string;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      aria-label={label}
      className={cx("mobile-only", s.section, band && bandClass, className)}
    >
      {band && <BandJewel />}
      <Container>{children}</Container>
    </section>
  );
}

/* ---------- Demo: three moments of a fight, then the whole HUD ---------- */

const tabs = [
  { id: "party", label: "Party", caption: "Party frames" },
  { id: "cooldowns", label: "Cooldowns", caption: "The Cooldown Manager" },
  { id: "alert", label: "Alert", caption: "An aggro alert" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function UnitBar({
  name,
  color,
  health,
  border,
  glow,
  badge,
  power,
  fill,
  role = "dps",
}: {
  name: string;
  color: string;
  health: number;
  border?: string;
  glow?: boolean;
  badge?: { label: string; color: string };
  power?: number;
  fill?: string;
  role?: "tank" | "dps" | "none";
}) {
  return (
    <div className={s.unit} style={{ borderColor: border, boxShadow: glow ? `0 0 10px ${border}73` : undefined }}>
      <div className={s.unitFill} style={{ width: `${health}%`, background: fill }} />
      {power !== undefined && <div className={s.unitPower} style={{ width: `${power}%` }} />}
      <div className={s.unitRow}>
        {role === "tank" && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={s.unitRole}>
            <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
          </svg>
        )}
        {role === "dps" && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={cx(s.unitRole, s.unitRoleMuted)}>
            <path d="M19 5L9 15M19 5h-4M19 5v4M7 13l4 4M8.5 15.5L5 19" />
          </svg>
        )}
        <span className={s.unitName} style={{ color }}>
          {name}
        </span>
        {badge && (
          <span className={s.badge} style={{ background: badge.color }}>
            {badge.label}
          </span>
        )}
        <span className={cx(s.unitPct, !badge && s.unitPctAlone)}>{health}%</span>
      </div>
    </div>
  );
}

function Icon({ src, size, ready, children }: { src: string; size: "small" | "large"; ready?: boolean; children?: ReactNode }) {
  return (
    <div className={cx(s.icon, size === "large" ? s.iconLarge : s.iconSmall, ready && s.iconReady)}>
      <Image src={src} alt="" width={64} height={64} className={s.iconImage} />
      {children}
    </div>
  );
}

function DemoPanel({ tab }: { tab: TabId }) {
  if (tab === "cooldowns") {
    return (
      <>
        <div aria-hidden="true" className={s.cooldowns}>
          <div className={s.iconRow}>
            <Icon src="/icons/water-shield.png" size="small">
              <span className={s.iconDuration} style={{ width: "90%" }} />
              <span className={s.iconTime}>9m</span>
            </Icon>
            <Icon src="/icons/mana-spring-totem.png" size="small">
              <span className={s.iconDuration} style={{ width: "72%" }} />
              <span className={s.iconTime}>1:44</span>
            </Icon>
          </div>
          <div className={cx(s.iconRow, s.iconRowLarge)}>
            <Icon src="/icons/riptide.png" size="large" ready />
            <Icon src="/icons/natures-swiftness.png" size="large" ready />
            <Icon src="/icons/mana-tide-totem.png" size="large" ready />
            <div className={cx(s.icon, s.iconLarge, s.iconCooling)}>
              <Image src="/icons/earth-shock.png" alt="" width={64} height={64} className={s.iconImage} />
              <span className={s.sweep} />
              <span className={s.iconCount}>6</span>
            </div>
          </div>
        </div>
        <figcaption className={s.demoCaption}>
          Earth Shock counts down in the Cooldown Manager. Everything ready keeps an arcane edge.
        </figcaption>
      </>
    );
  }

  if (tab === "alert") {
    return (
      <>
        <div aria-hidden="true" className={s.alertStack}>
          <div className={s.alert}>
            <span className={cx(s.alertGem, s.alertGemLeft)} />
            <span className={cx(s.alertGem, s.alertGemRight)} />
            <span className={s.alertTitle}>Kaelith has drawn aggro</span>
            <span className={s.alertFacts}>108% threat · 31% health · Ice Block ready</span>
          </div>
          <UnitBar
            name="Kaelith"
            color="#69CCF0"
            health={31}
            border="var(--ember)"
            glow
            fill="linear-gradient(90deg, #5A1E12, #B53D1E)"
            badge={{ label: "Aggro", color: "var(--ember)" }}
            role="none"
          />
        </div>
        <figcaption className={s.demoCaption}>
          The mage pulls aggro: an ember border, a badge and an alert with the facts.
        </figcaption>
      </>
    );
  }

  return (
    <>
      <div aria-hidden="true" className={s.party}>
        <div className={s.partyHead}>
          <span className={s.partyLabel}>Party</span>
          <span className={s.partyRule} />
        </div>
        <UnitBar
          name="Brannoc"
          color="#C79C6E"
          health={64}
          power={46}
          border="#45E0A8"
          badge={{ label: "Poison", color: "#45E0A8" }}
          role="tank"
        />
        <UnitBar name="Kaelith" color="#69CCF0" health={95} />
        <UnitBar name="Ysolde" color="#F58CBA" health={88} />
      </div>
      <figcaption className={s.demoCaption}>
        A poison you can remove lands on the tank: the border and the badge say so.
      </figcaption>
    </>
  );
}

export function MobileDemo() {
  const [tab, setTab] = useState<TabId>("party");
  const current = tabs.find((t) => t.id === tab) ?? tabs[0];

  return (
    <MobileSection labelledBy="m-demo-title" className={s.demoSection}>
      <h2 id="m-demo-title" className="visually-hidden">
        Live demo
      </h2>
      <div role="tablist" aria-label="Live demo" className={s.tabs}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`m-demo-tab-${t.id}`}
            aria-selected={t.id === tab}
            aria-controls="m-demo-panel"
            className={cx(s.tab, t.id === tab && s.tabSelected)}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <figure
        id="m-demo-panel"
        role="tabpanel"
        aria-label={`Live demo: ${current.caption}`}
        className={s.demoPanel}
      >
        <span aria-hidden="true" className={cx(s.corner, s.cornerTopLeft)} />
        <span aria-hidden="true" className={cx(s.corner, s.cornerBottomRight)} />
        <DemoPanel tab={tab} />
      </figure>
      <ButtonLink href="/demo" className={s.wideButton}>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 5l11 7-11 7V5z" />
        </svg>
        Watch the full demo
      </ButtonLink>
      <p className={s.demoHint}>The whole HUD in a fight. Turn your phone sideways.</p>
    </MobileSection>
  );
}

/* ---------- Why SuuUI ---------- */

export function MobileWhy({ pillars }: { pillars: Short[] }) {
  const [open, setOpen] = useState(false);
  return (
    <MobileSection band labelledBy="m-why-title">
      <Eyebrow>Why SuuUI</Eyebrow>
      <Heading id="m-why-title" className={s.title}>
        Built for the client as it is
      </Heading>
      <ul className={s.pillars}>
        {pillars.map((pillar) => (
          <li key={pillar.title} className={s.pillar}>
            <Diamond className={s.pillarDiamond} />
            <div>
              <Heading level={3} className={s.pillarTitle}>
                {pillar.title}
              </Heading>
              <p className={s.text}>{open ? pillar.text : (pillar.short ?? pillar.text)}</p>
            </div>
          </li>
        ))}
      </ul>
      <MoreButton expanded={open} onClick={() => setOpen(!open)}>
        {open ? "Show less" : "Read more"}
      </MoreButton>
    </MobileSection>
  );
}

/* ---------- Features as links ---------- */

export function MobileFeatures({ features }: { features: { title: string; short: string; href: string }[] }) {
  return (
    <MobileSection labelledBy="m-features-title">
      <Eyebrow>Features</Eyebrow>
      <Heading id="m-features-title" className={s.title}>
        Everything you watch in a fight
      </Heading>
      <ul className={s.linkRows}>
        {features.map((feature) => (
          <li key={feature.title} className={s.linkRowItem}>
            <Link href={feature.href} className={s.linkRow}>
              <span className={s.linkRowText}>
                <span className={s.linkRowTitle}>{feature.title}</span>
                <span className={s.linkRowShort}>{feature.short}</span>
              </span>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={s.linkRowChevron}>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
      <ButtonLink href="/features" className={s.wideButton}>
        See every feature
      </ButtonLink>
    </MobileSection>
  );
}

/* ---------- Signals: tap one to read it ---------- */

export function MobileSignals({ signals }: { signals: { tag: string; color?: string; title: string; text: string }[] }) {
  const [picked, setPicked] = useState(signals[0]?.tag);
  const current = signals.find((signal) => signal.tag === picked) ?? signals[0];

  return (
    <MobileSection band labelledBy="m-signals-title">
      <Eyebrow>The design</Eyebrow>
      <Heading id="m-signals-title" className={s.title}>
        Colour always means something
      </Heading>
      <p className={cx(s.text, s.intro)}>Six signals, each with a word or a shape too. Tap one.</p>
      <div role="group" aria-label="Signals" className={s.signals}>
        {signals.map((signal) => (
          <button
            key={signal.tag}
            type="button"
            aria-pressed={signal.tag === current.tag}
            className={cx(s.signal, signal.tag === current.tag && s.signalPicked)}
            onClick={() => setPicked(signal.tag)}
          >
            <span className={s.signalTag} style={{ "--signal": signal.color ?? "#9dff5c" } as CSSProperties}>
              {signal.tag}
            </span>
            <span className={s.signalTitle}>{signal.title}</span>
          </button>
        ))}
      </div>
      <p role="status" className={s.signalText}>
        <strong>{current.title}.</strong> {current.text}
      </p>
    </MobileSection>
  );
}

/* ---------- Discord ---------- */

export function MobileDiscord() {
  return (
    <MobileSection labelledBy="m-community-title">
      <Heading id="m-community-title" className={s.titlePlain}>
        Join the Discord
      </Heading>
      <p className={cx(s.text, s.introPlain)}>
        Ask questions, see other players&apos; layouts and profiles, and follow what&apos;s coming next.
      </p>
      <a href={links.discord} className={cx(s.wideButton, s.discordButton)}>
        <Image src="/brand/discord-mark.svg" alt="" width={19} height={14} />
        Join on Discord
      </a>
    </MobileSection>
  );
}

/* ---------- What's new ---------- */

export function MobileNews({ versionLine, items }: { versionLine: string; items: Short[] }) {
  const [open, setOpen] = useState(false);
  // The three with a short version come first; the rest show once opened.
  const first = items.filter((item) => item.short);
  const shown = open ? [...first, ...items.filter((item) => !item.short)] : first;

  return (
    <MobileSection band labelledBy="m-new-title">
      <Eyebrow>What&apos;s new</Eyebrow>
      <Heading id="m-new-title" className={s.title}>
        New in this beta
      </Heading>
      <p className={s.versionLine}>{versionLine}</p>
      <ul className={s.news}>
        {shown.map((item) => (
          <li key={item.title} className={s.newsItem}>
            <Diamond size={6} className={s.newsDiamond} />
            <p className={s.text}>
              <strong className={s.strong}>{item.title}</strong> {open ? item.text : item.short}
            </p>
          </li>
        ))}
      </ul>
      <MoreButton expanded={open} onClick={() => setOpen(!open)} className={s.newsMore}>
        {open ? "Show less" : `Show all ${["", "one", "two", "three", "four", "five", "six", "seven"][items.length] ?? items.length}`}
      </MoreButton>
      <ButtonLink href="/changelog" className={cx(s.wideButton, s.newsButton)}>
        Read the changelog
      </ButtonLink>
    </MobileSection>
  );
}

/* ---------- Roadmap: where things stand, every phase a tap away ---------- */

export type MobilePhase = { number: number; title: string; status: "Done" | "In progress" | "Planned"; text: string };

export function MobileRoadmap({
  phases,
  summary,
}: {
  phases: MobilePhase[];
  summary: { done: string; next: string; later: string };
}) {
  const [open, setOpen] = useState(false);
  const current = phases.findIndex((phase) => phase.status === "In progress");

  return (
    <div className="mobile-only">
      <div className={s.roadmapCard}>
        <div aria-hidden="true" className={s.track}>
          {phases.map((phase, i) => (
            <span key={phase.number} className={s.trackStep}>
              {i > 0 && <span className={cx(s.trackLine, i > current && current >= 0 && s.trackLineAhead)} />}
              <span
                className={cx(
                  s.trackGem,
                  phase.status === "In progress" && s.trackGemNow,
                  phase.status === "Planned" && s.trackGemLater,
                )}
              />
            </span>
          ))}
        </div>
        <div aria-hidden="true" className={s.trackNumbers}>
          {phases.map((phase) => (
            <span key={phase.number} className={phase.status === "In progress" ? s.trackNow : undefined}>
              {phase.number}
            </span>
          ))}
        </div>
        <dl className={s.standing}>
          <div>
            <dt className={s.standingLabel}>Done</dt>
            <dd className={s.standingText}>{summary.done}</dd>
          </div>
          <div>
            <dt className={cx(s.standingLabel, s.standingNext)}>Next</dt>
            <dd className={s.standingText}>{summary.next}</dd>
          </div>
          <div>
            <dt className={s.standingLabel}>Later</dt>
            <dd className={cx(s.standingText, s.standingLater)}>{summary.later}</dd>
          </div>
        </dl>
        <MoreButton expanded={open} onClick={() => setOpen(!open)}>
          {open ? "Hide the phases" : "Show every phase"}
        </MoreButton>
        {open && (
          <ol className={s.phaseList}>
            {phases.map((phase) => (
              <li key={phase.number} className={s.phaseItem}>
                <span className={cx(s.phaseStatus, phase.status === "In progress" && s.standingNext)}>
                  Phase {phase.number} · {phase.status}
                </span>
                <p className={s.phaseTitle}>{phase.title}</p>
                <p className={s.phaseText}>{phase.text}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

/* ---------- Ready to try it ---------- */

export function MobileReady() {
  return (
    <MobileSection band labelledBy="m-ready-title" className={s.readySection}>
      <Heading id="m-ready-title" className={s.readyTitle}>
        Ready to try it?
      </Heading>
      <p className={cx(s.text, s.introPlain)}>
        SuuUI installs on your computer, from CurseForge, Wago Addons or the zip. Send yourself the link for later.
      </p>
      <ShareLink className={s.readyShare} />
      <Link href="/guide" className={s.readyGuide}>
        Read the getting started guide
      </Link>
      <p className={s.bug}>
        <strong className={s.strong}>Found a bug?</strong> Type <Code>/suu errors</Code> in game, then{" "}
        <a href={links.issues}>open an issue on GitHub</a>.
      </p>
    </MobileSection>
  );
}
