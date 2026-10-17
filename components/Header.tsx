"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { links } from "@/lib/site";
import { ViewDesktopSite } from "./LayoutSwitch";
import { Mark, markHost } from "./Mark";
import { ShareLink } from "./ShareLink";
import { ButtonLink, cx } from "./ui";
import s from "./Header.module.css";

export const navItems = [
  { label: "Features", href: "/features" },
  { label: "Guide", href: "/guide" },
  { label: "Changelog", href: "/changelog" },
  { label: "FAQ", href: "/faq" },
  { label: "Developers", href: "/developers" },
];

/** The phone menu lists every page, Home first. */
const menuItems = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Getting started", href: "/guide" },
  { label: "Changelog", href: "/changelog" },
  { label: "FAQ", href: "/faq" },
  { label: "Developers", href: "/developers" },
];

/** Official marks, each sized to the height the design gives it. */
const communityLinks = [
  { label: "GitHub", href: links.github, icon: "/brand/github-mark.svg", width: 15, height: 15 },
  { label: "Discord", href: links.discord, icon: "/brand/discord-mark.svg", width: 16, height: 12 },
];

const centerOf = (el: Element | null | undefined) =>
  el instanceof HTMLElement ? el.offsetLeft + el.offsetWidth / 2 : null;

/**
 * While the pointer is over the nav, the current page's diamond hands over to a floating one that glides to the
 * hovered link, and glides back when the pointer leaves.
 */
function useFloatingMarker() {
  const nav = useRef<HTMLElement>(null);
  const home = useRef<number | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [marker, setMarker] = useState({ shown: false, x: 0, glide: false });
  const shown = useRef(false);
  shown.current = marker.shown;

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const currentCenter = () => centerOf(nav.current?.querySelector('[aria-current="page"]'));

  const onNavEnter = () => {
    home.current = currentCenter();
  };

  const onLinkEnter = (el: HTMLElement) => {
    clearTimeout(leaveTimer.current);
    const from = home.current ?? currentCenter();
    home.current = from;
    const to = centerOf(el) ?? 0;
    if (!shown.current && from !== null) {
      // Start on the current page's diamond, then glide over on the next frame.
      setMarker({ shown: true, x: from, glide: false });
      requestAnimationFrame(() => requestAnimationFrame(() => setMarker({ shown: true, x: to, glide: true })));
    } else {
      setMarker({ shown: true, x: to, glide: shown.current });
    }
  };

  const onNavLeave = () => {
    if (!shown.current) return;
    if (home.current !== null) {
      setMarker((m) => ({ ...m, x: home.current ?? m.x, glide: true }));
      clearTimeout(leaveTimer.current);
      leaveTimer.current = setTimeout(() => setMarker((m) => ({ ...m, shown: false, glide: false })), 200);
    } else {
      setMarker((m) => ({ ...m, shown: false, glide: false }));
    }
  };

  return { nav, marker, onNavEnter, onLinkEnter, onNavLeave };
}

/**
 * On a phone the nav folds into a menu that covers the screen below the bar. It closes on Escape and when a
 * page is picked, and the page behind it doesn't scroll while it's open.
 */
function useMenu(pathname: string) {
  const [open, setOpen] = useState(false);
  const [shownFor, setShownFor] = useState(pathname);
  if (shownFor !== pathname) {
    setShownFor(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = before;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return { open, toggle: () => setOpen(!open), close: () => setOpen(false) };
}

const isCurrent = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export function Header() {
  const pathname = usePathname();
  const { nav, marker, onNavEnter, onLinkEnter, onNavLeave } = useFloatingMarker();
  const menu = useMenu(pathname);

  return (
    <header className={cx(s.header, menu.open && s.menuOpen)}>
      <div className={s.inner}>
        <Link href="/" aria-label="SuuUI home" className={cx(s.logo, markHost)}>
          <Mark size={30} />
          <span className={s.wordmark}>
            <Image src="/brand/suuui-logo.svg" alt="" width={94} height={30} priority />
          </span>
        </Link>
        <nav aria-label="Main" ref={nav} className={s.nav} onMouseEnter={onNavEnter} onMouseLeave={onNavLeave}>
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cx(s.navLink, active && s.active)}
                onMouseEnter={(e) => onLinkEnter(e.currentTarget)}
                onFocus={(e) => onLinkEnter(e.currentTarget)}
                onBlur={onNavLeave}
              >
                <span>{item.label}</span>
                {active && <span aria-hidden="true" className={s.marker} style={{ opacity: marker.shown ? 0 : 1 }} />}
              </Link>
            );
          })}
          <span
            aria-hidden="true"
            className={cx(s.marker, s.floating, marker.glide && s.gliding)}
            style={{ left: marker.x, opacity: marker.shown ? 1 : 0 }}
          />
        </nav>
        <div className={s.actions}>
          <div role="group" aria-label="Community" className={s.community}>
            {communityLinks.map((item) => (
              <a key={item.label} href={item.href} aria-label={`SuuUI on ${item.label}`} title={item.label} className={s.social}>
                <span aria-hidden="true" className={s.socialFrame} />
                <Image src={item.icon} alt="" width={item.width} height={item.height} className={s.socialIcon} />
              </a>
            ))}
          </div>
          <span aria-hidden="true" className={s.divider} />
          <ButtonLink
            href="/download"
            variant="primary"
            size="small"
            className={s.pop}
            aria-current={pathname === "/download" || pathname.startsWith("/download/") ? "page" : undefined}
          >
            Download
          </ButtonLink>
        </div>
        <button
          type="button"
          aria-expanded={menu.open}
          aria-controls="site-menu"
          aria-label={menu.open ? "Close the menu" : "Open the menu"}
          className={s.menuButton}
          onClick={menu.toggle}
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d={menu.open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
          </svg>
        </button>
      </div>

      <div id="site-menu" hidden={!menu.open} className={s.sheet}>
        <nav aria-label="Menu">
          <ul className={s.menuList}>
            {menuItems.map((item) => {
              const active = isCurrent(pathname, item.href);
              return (
                <li key={item.href} className={s.menuItem}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cx(s.menuLink, active && s.menuLinkActive)}
                    onClick={menu.close}
                  >
                    <span aria-hidden="true" className={s.menuDiamond} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={s.getCard}>
          <p className={s.getTitle}>Get SuuUI</p>
          <p className={s.getText}>It installs on your computer. Send yourself the link, or see every way to get it.</p>
          <div className={s.getButtons}>
            <ShareLink icon={false} />
            <ButtonLink
              href="/download"
              className={s.getButton}
              aria-current={isCurrent(pathname, "/download") ? "page" : undefined}
              onClick={menu.close}
            >
              Download options
            </ButtonLink>
          </div>
        </div>

        <div role="group" aria-label="Community" className={s.menuCommunity}>
          {communityLinks.map((item) => (
            <a key={item.label} href={item.href} className={s.menuSocial}>
              <Image src={item.icon} alt="" width={item.width} height={item.height} />
              {item.label}
            </a>
          ))}
        </div>

        <ViewDesktopSite className={s.menuDesktop} onSwitch={menu.close} />
        <p className={s.menuNote}>A fan-made addon for WoW Forever. Not affiliated with Blizzard Entertainment.</p>
      </div>
    </header>
  );
}
