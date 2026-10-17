import Image from "next/image";
import Link from "next/link";
import { links } from "@/lib/site";
import { ViewDesktopSite, ViewMobileSite } from "./LayoutSwitch";
import { cx } from "./ui";
import s from "./Footer.module.css";

const columns = [
  {
    title: "SuuUI",
    items: [
      { label: "Features", href: "/features" },
      { label: "Download", href: "/download" },
      { label: "Presets", href: "/features#presets" },
      { label: "Changelog", href: "/changelog" },
      { label: "Roadmap", href: "/#roadmap" },
    ],
  },
  {
    title: "Help",
    items: [
      { label: "Getting started", href: "/guide" },
      { label: "FAQ", href: "/faq" },
      { label: "In combat", href: "/in-combat" },
      { label: "Compatibility", href: "/compatibility" },
      { label: "Discord", href: links.discord },
      { label: "Report a bug", href: links.issues },
    ],
  },
  {
    title: "Developers",
    items: [
      { label: "Build a plugin", href: "/developers" },
      { label: "Plugin API", href: links.apiDocs },
      { label: "Source on GitHub", href: links.github },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div aria-hidden="true" className={s.divider}>
          <span className={s.rule} />
          <span className={s.jewel} />
          <span className={s.ruleReverse} />
        </div>

        <div className={s.top}>
          <div className={s.brand}>
            <Link href="/" aria-label="SuuUI home" className={s.logo}>
              <Image src="/brand/suuui-logo.svg" alt="" width={113} height={36} />
            </Link>
            <p className={s.tagline}>A full interface replacement for WoW Forever. Quiet until it matters.</p>
          </div>

          <nav aria-label="Footer" className={s.columns}>
            {columns.map((column) => (
              <div key={column.title} className={s.column}>
                <h2 className={s.columnTitle}>{column.title}</h2>
                <ul className={s.list}>
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className={s.link}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={cx(s.desktopSwitch, "mobile-only")}>
          <ViewDesktopSite variant="button" />
        </div>
        <div className={s.mobileSwitch}>
          <ViewMobileSite />
        </div>

        <div className={s.legal}>
          <p className={s.copyright}>
            © {year} Domenik Irrgang. SuuUI is released under the MIT License; its typefaces under the SIL Open
            Font License 1.1.
          </p>
          <p className={s.disclaimer}>
            World of Warcraft is a trademark of Blizzard Entertainment, Inc. SuuUI is a fan-made addon and is not
            affiliated with or endorsed by Blizzard Entertainment.
          </p>
        </div>
      </div>
    </footer>
  );
}
