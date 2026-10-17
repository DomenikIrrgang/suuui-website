import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Body, Code, Container, Heading, Section, SectionHeader } from "@/components/ui";
import { getReleaseData } from "@/lib/releases";
import { ZipCountdown } from "./ZipCountdown";
import s from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/download/zip" },
  title: "Downloading",
  description: "Your SuuUI download is starting. Here's how to install it from the zip.",
  // It starts a download by itself, so keep it out of search results.
  robots: { index: false },
};

const installSteps: ReactNode[] = [
  "Find the SuuUI zip in your Downloads folder.",
  <>
    Unpack it into <Code className={s.path}>&lt;World of Warcraft&gt;/_classic_beta_/Interface/AddOns</Code>
  </>,
  <>
    Start the game, or type <Code>/reload</Code>, and make sure SuuUI is enabled in the AddOns list.
  </>,
  <>
    Type <Code>/suu</Code> to open the settings.
  </>,
];

const next = [
  {
    href: "/guide",
    title: "Your first ten minutes",
    text: "Set the size, place your frames, bind your keys and pick a profile for each role.",
  },
  {
    href: "/download",
    title: "Updates without the zip",
    text: "Install SuuUI with CurseForge or Wago Addons and new versions arrive by themselves.",
  },
];

export default async function DownloadingPage() {
  const { latest: latestRelease } = await getReleaseData();

  return (
    <>
      <section aria-labelledby="page-title" className={s.intro}>
        <Container>
          <div className={s.eyebrow}>
            <Link href="/download" className={s.eyebrowLink}>
              Download
            </Link>
            <span aria-hidden="true" className={s.eyebrowRule} />
          </div>
          <Heading level={1} id="page-title">
            Thanks for getting SuuUI
          </Heading>
          <ZipCountdown
            version={latestRelease.version}
            zipUrl={latestRelease.zipUrl}
            releaseUrl={latestRelease.url}
          />
        </Container>
      </section>

      <Section aria-labelledby="install-title" tight band>
        <div className={s.install}>
          <SectionHeader eyebrow="Install by hand" title="From the zip" id="install-title" size="h2Small" />
          <ol className={s.rows}>
            {installSteps.map((step, i) => (
              <li key={i} className={s.row}>
                <span aria-hidden="true" className={s.stepNumber}>
                  {i + 1}
                </span>
                <Body className={s.rowText}>{step}</Body>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <section aria-labelledby="next-title" className={s.nextSection}>
        <Container className={s.next}>
          <h2 id="next-title" className="visually-hidden">
            Where to go next
          </h2>
          {next.map((item) => (
            <Link key={item.title} href={item.href} className={s.nextCard}>
              <span className={s.nextTitle}>{item.title}</span>
              <span className={s.nextText}>{item.text}</span>
            </Link>
          ))}
        </Container>
      </section>
    </>
  );
}
