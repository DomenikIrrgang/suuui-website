import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ClipCooldowns } from "@/components/demo/ClipCooldowns";
import { ClipSettings } from "@/components/demo/ClipSettings";
import { DesktopOnly } from "@/components/Responsive";
import { BandJewel, bandClass, Code, Container, cx, Heading, PageIntro } from "@/components/ui";
import { DoneButton, GuideProgress, ProgressBar, Step } from "./GuideProgress";
import s from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/guide" },
  title: "Getting started",
  description:
    "Your first ten minutes with SuuUI: the right size, your frames where you want them, your keys, your cooldowns, and a profile for every role you play.",
};

const steps: { title: string; text: ReactNode[]; clip?: ReactNode }[] = [
  {
    title: "Install and enable",
    text: [
      <>
        Get SuuUI from CurseForge or Wago Addons, or unpack the zip from GitHub into your AddOns folder. Start the game,
        or type <Code>/reload</Code>, and check that SuuUI is enabled in the AddOns list.{" "}
        <Link href="/download">Download options</Link>
      </>,
    ],
  },
  {
    title: "Open the settings",
    text: [
      <>
        Type <Code>/suu</Code>, click the Jewel on the minimap&apos;s ring, or open it from the game menu. The search
        box in its header finds any option. Right-click the Jewel to go straight to Edit layout.
      </>,
      "Every change applies as you make it, and the section's real frames update in the preview beside it, at their real size. There's no Apply button.",
    ],
    clip: <ClipSettings />,
  },
  {
    title: "Set the size",
    text: [
      "Under General › Appearance, Automatic scale is on: 100% up to 1440p, larger on taller screens. Turn it off to set your own scale. SuuUI keeps its hairlines one pixel sharp at any scale.",
    ],
  },
  {
    title: "Place your frames",
    text: [
      <>
        Press Edit layout under General › Appearance, or type <Code>/suu edit</Code>. Drag frames on the snap grid. You
        can reset one frame or all of them.
      </>,
      "Bars 5–8, the stance bar and the pet bar can be attached to the dock, so they move together with it.",
    ],
  },
  {
    title: "Bind your keys",
    text: [
      <>
        Type <Code>/suu keybind</Code>, or press Keybind mode under General › Keybinds. Hover an action button and
        press a key, a mouse button or the wheel. Delete clears a binding.
      </>,
      "Bars 5–8 start hidden: turn each one on with Show under Frames › Action bars. Each bar can show always, only in combat, or on mouseover.",
    ],
  },
  {
    title: "Check your Cooldown Manager",
    text: [
      "Your spec's preset is already loaded. Open Frames › Cooldown Manager to change it: add a spell by name or spell ID (what you cast lately comes first), put several spells in one slot, or give an entry a sound.",
      <Link key="presets" href="/features#presets">
        Watch your spec&apos;s preset in a fight
      </Link>,
    ],
    clip: <ClipCooldowns />,
  },
  {
    title: "Set a profile for each role",
    text: [
      "Under General › Profiles, pick a profile for Tank, Healer and DPS. SuuUI switches when your role changes, out of combat only, and places your group frames for that role.",
      "To share a setup, export your profile as a string and send it; it imports in the same place.",
    ],
  },
  {
    title: "Turn off what you don't need",
    text: [
      "Every feature is a module. Switch one off under General › Modules and Blizzard's own frame comes back in its place. A few take effect after a reload; their row says so.",
    ],
  },
];

const next = [
  {
    href: "/in-combat",
    title: "What SuuUI can show in combat",
    text: "Why some things only appear between pulls, and why that's on purpose.",
  },
  {
    href: "/faq",
    title: "Questions and answers",
    text: "What people ask most, from installing to profiles and other addons.",
  },
];

export default function GuidePage() {
  return (
    <GuideProgress count={steps.length}>
      <PageIntro
        eyebrow="Getting started"
        title="Your first ten minutes"
        compact
        leadWidth={700}
        lead={
          <>
            <span className="desktop-only">
              SuuUI works the moment it loads. These steps make it yours: the right size, your frames where you want
              them, your keys, your cooldowns, and a profile for every role you play.
            </span>
            <span className="mobile-only">Keep this open next to the game and tick off each step as you go.</span>
          </>
        }
      >
        <ProgressBar />
      </PageIntro>

      <section aria-label="Steps" className={cx(s.stepsSection, bandClass)}>
        <BandJewel />
        <Container>
          <ol className={s.steps}>
            {steps.map((step, i) => (
              <Step key={step.title} index={i}>
                <div className={s.stepText}>
                  <span aria-hidden="true" className={s.number}>
                    <span className={s.numberFrame} />
                    <span className={s.numberDigit}>{i + 1}</span>
                  </span>
                  <div className={s.stepBody}>
                    <div className={s.titleRow}>
                      <Heading className={s.stepTitle}>{step.title}</Heading>
                      <DoneButton index={i} title={step.title} />
                    </div>
                    {i === 0 && <span className={cx(s.onComputer, "mobile-only")}>On your computer</span>}
                    {step.text.map((paragraph, j) => (
                      <p key={j} className={s.paragraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                {step.clip && (
                  <div className={cx(s.stepClip, "desktop-only")}>
                    <DesktopOnly>{step.clip}</DesktopOnly>
                  </div>
                )}
              </Step>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="next-title" className={s.nextSection}>
        <Container className={s.next}>
          <h2 id="next-title" className="visually-hidden">
            Where to go next
          </h2>
          {next.map((item) => (
            <Link key={item.href} href={item.href} className={s.nextCard}>
              <span className={s.nextTitle}>{item.title}</span>
              <span className={s.nextText}>{item.text}</span>
            </Link>
          ))}
        </Container>
      </section>
    </GuideProgress>
  );
}
