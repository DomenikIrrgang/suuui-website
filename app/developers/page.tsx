import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Body,
  BulletList,
  ButtonLink,
  ButtonRow,
  Card,
  Code,
  CodeBlock,
  Grid,
  Heading,
  PageIntro,
  Section,
  SectionHeader,
} from "@/components/ui";
import { links } from "@/lib/site";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Developers",
  description:
    "Build plugins for SuuUI with the same public API its own modules use, or build SuuUI from source with wowlua.",
};

const pluginExample = `
SuuUI.RegisterModule({
    id = "hello",
    name = "Hello",
    description = "An example plugin that says hello.",
    api = "0.4",
    defaults = {
        greeting = "Hello from a SuuUI plugin",
    },

    OnEnable = function(self)
        -- /suu hello says the greeting
        self:RegisterCommand("hello", "Say the Hello plugin's greeting.", function()
            self:Print(self:Get("greeting"))
        end)
    end,
})
`;

const buildSteps = `
git clone git@github.com:DomenikIrrgang/suuui.git
cd suuui
# check the sources without building
wowlua check
# build and install into your game's AddOns folder
wowlua install --release
# rebuild on every change, then /reload in game
wowlua dev
`;

const resources: { title: string; text: ReactNode; href: string; cta: string }[] = [
  {
    title: "Plugin API",
    text: "Modules, settings and migrations, the settings window, edit mode, events, components such as unit frames, cast bars and aura containers, and the design tokens. Versioned, so a plugin says which API it needs.",
    href: links.apiDocs,
    cta: "Read Docs/API.md",
  },
  {
    title: "Example plugin",
    text: "A minimal module with a setting, a chat command, a movable frame and its own settings section. Copy the folder into AddOns to try it.",
    href: links.examplePlugin,
    cta: "Open the example",
  },
  {
    title: "ForeverLFG",
    text: (
      <>
        <Code>SuuUI.LFG</Code>: the game&apos;s group finder and public chat as one list, with events. SuuUI&apos;s
        Group Finder is built on it the way a plugin would be.
      </>
    ),
    href: links.lfgDocs,
    cta: "Read the design",
  },
  {
    title: "Diagnostics",
    text: (
      <>
        <Code>/suu probe</Code> checks which client APIs SuuUI relies on. <Code>/suu probe &lt;topic&gt;</Code>{" "}
        records what the live client allows, from spells and talents to the group finder and the guild.
      </>
    ),
    href: links.diagnostics,
    cta: "See the probes",
  },
];

const layout = [
  { path: "src/Core", text: "Tokens, fonts, events, settings and profiles, modules, roles, the public API" },
  { path: "src/UI", text: "Components: unit frame, cast bar, action button, windows, roster, group finder" },
  { path: "src/SettingsUI", text: "The settings window and its sections" },
  { path: "src/EditMode", text: "Moving frames on a snap grid" },
  { path: "src/Units", text: "The built-in modules: frames, bars, chat, bags, windows, guild, group finder" },
  { path: "src/Data", text: "Generated data: Cooldown Manager presets, talents, the aura catalog, recipe sources" },
  { path: "tools", text: "Generators for the presets and data" },
  { path: "wowlua.json", text: "The build: TOC fields, assets, release profiles and publish targets" },
];

export default function DevelopersPage() {
  return (
    <>
      <PageIntro
        eyebrow="Developers"
        title="Build on SuuUI"
        leadWidth={700}
        lead="Every built-in module is written against the same public API a plugin uses, so a plugin can do anything SuuUI's own modules do."
      >
        <ButtonRow className={s.introButtons}>
          <ButtonLink href={links.apiDocs} variant="primary">
            Read the plugin API
          </ButtonLink>
          <ButtonLink href={links.github}>View the source</ButtonLink>
        </ButtonRow>
      </PageIntro>

      <Section aria-labelledby="plugin-title" tight band>
        <div className={s.split}>
          <div className={s.pluginText}>
            <SectionHeader eyebrow="Plugins" title="A module in a few lines" id="plugin-title" size="h2Small" />
            <p className={s.paragraph}>
              A plugin is an addon with <Code>## Dependencies: SuuUI</Code> that calls{" "}
              <Code>SuuUI.RegisterModule</Code>.
            </p>
            <BulletList
              className={s.pluginList}
              items={[
                "Settings with defaults, saved per profile, with migrations",
                "Chat commands, game events and SuuUI's own messages",
                "A section in the settings window, under Plugins",
                "Frames built from SuuUI's components, movable in edit mode",
                "Switched off like any other module; an error stays inside it",
              ]}
            />
          </div>
          <figure className={s.pluginCode}>
            <CodeBlock code={pluginExample} />
            <figcaption className={s.caption}>
              Trimmed from <a href={links.examplePlugin}>Examples/SuuUI_HelloPlugin</a>, which adds a setting, a
              movable frame and a settings section.
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section aria-labelledby="resources-title" tight>
        <SectionHeader eyebrow="Resources" title="Everything you need to start" id="resources-title" size="h2Small" />
        <Grid min={440} className={s.resources}>
          {resources.map((resource) => (
            <Card key={resource.title} className={s.resource}>
              <Heading level={3}>{resource.title}</Heading>
              <Body className={s.resourceText}>{resource.text}</Body>
              <a href={resource.href} className={s.resourceLink}>
                {resource.cta}
              </a>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section aria-labelledby="build-title" tight band>
        <div className={s.split}>
          <div className={s.half}>
            <SectionHeader eyebrow="From source" title="Build it yourself" id="build-title" size="h2Small" />
            <p className={s.paragraph}>
              The repository is the source, not the addon itself. It builds with <a href={links.wowlua}>wowlua</a> 0.9
              or later.
            </p>
            <CodeBlock code={buildSteps} className={s.buildCode} />
          </div>
          <div className={s.half}>
            <Heading level={3}>Project layout</Heading>
            <dl className={s.tree}>
              {layout.map((row) => (
                <div key={row.path} className={s.treeRow}>
                  <dt className={s.treePath}>{row.path}</dt>
                  <dd className={s.treeText}>{row.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <section aria-labelledby="contribute-title" className={s.contributeSection}>
        <div className={s.container}>
          <div className={s.contribute}>
            <div className={s.contributeText}>
              <Heading id="contribute-title" className={s.contributeTitle}>
                Questions about the API?
              </Heading>
              <Body className={s.contributeBody}>
                Ask on Discord, or open an issue on GitHub for a bug or something the API is missing. SuuUI is MIT
                licensed.
              </Body>
            </div>
            <ButtonRow>
              <ButtonLink href={links.discord}>Join on Discord</ButtonLink>
              <ButtonLink href={links.issues}>Open an issue</ButtonLink>
            </ButtonRow>
          </div>
        </div>
      </section>
    </>
  );
}
