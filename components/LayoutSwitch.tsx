"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { cx } from "./ui";
import s from "./LayoutSwitch.module.css";

/*
 * "View the desktop site" on a phone: the page is laid out 1280px wide, like on a computer, and the phone
 * zooms it out to fit. The choice is remembered on this device, and "View the mobile site" undoes it.
 */
const KEY = "suuui-layout";
const META_ID = "desktop-viewport";
const DESKTOP_WIDTH = 1280;

/** Runs before the page shows, so a remembered choice applies without a flash of the phone layout. */
export const layoutScript = `(function () {
  try {
    if (localStorage.getItem("${KEY}") !== "desktop") return;
    var meta = document.createElement("meta");
    meta.name = "viewport";
    meta.id = "${META_ID}";
    meta.content = "width=${DESKTOP_WIDTH}";
    document.head.appendChild(meta);
    document.documentElement.setAttribute("data-layout", "desktop");
  } catch (e) {}
})();`;

function setDesktop(on: boolean) {
  try {
    if (on) localStorage.setItem(KEY, "desktop");
    else localStorage.removeItem(KEY);
  } catch {}
  document.getElementById(META_ID)?.remove();
  if (on) {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.id = META_ID;
    meta.content = `width=${DESKTOP_WIDTH}`;
    document.head.appendChild(meta);
    document.documentElement.setAttribute("data-layout", "desktop");
  } else {
    document.documentElement.removeAttribute("data-layout");
  }
  window.scrollTo(0, 0);
}

const screenIcon = (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 5h18v11H3zM8 20h8M12 16v4" />
  </svg>
);

/**
 * The last viewport tag in <head> wins, and React may put the page's own tag after ours while it starts up or
 * changes page. This moves ours back to the end each time.
 */
export function LayoutKeeper() {
  const pathname = usePathname();
  useEffect(() => {
    const meta = document.getElementById(META_ID);
    if (meta && meta !== document.head.lastElementChild) document.head.appendChild(meta);
  }, [pathname]);
  return null;
}

/** Shown in the phone layout, until the desktop layout is chosen. */
export function ViewDesktopSite({
  variant = "link",
  onSwitch,
  className,
}: {
  variant?: "link" | "button";
  /** Called just before the layout changes, e.g. to close the menu the link sits in */
  onSwitch?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cx(s.toDesktop, variant === "button" ? s.button : s.link, className)}
      onClick={() => {
        onSwitch?.();
        setDesktop(true);
      }}
    >
      {screenIcon}
      View the desktop site
    </button>
  );
}

/** Shown only on a device where the desktop layout was chosen instead of the phone layout. */
export function ViewMobileSite({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <button type="button" className={cx(s.toMobile, className)} onClick={() => setDesktop(false)}>
      {children ?? "View the mobile site"}
    </button>
  );
}
