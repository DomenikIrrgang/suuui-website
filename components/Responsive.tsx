"use client";

import { useSyncExternalStore, type ReactNode } from "react";

/** The phone layout's media query; the CSS uses the same width (see globals.css). */
export const PHONE_QUERY = "(max-width: 720px)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** True in the phone layout. The server, and the first render in the browser, assume the desktop layout. */
export function useIsPhone() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(PHONE_QUERY).matches,
    () => false,
  );
}

/**
 * Keeps an animated part mounted only in the desktop layout. The CSS already hides it on a phone
 * (`desktop-only`); this also stops its timers there.
 */
export function DesktopOnly({ children }: { children: ReactNode }) {
  return useIsPhone() ? null : children;
}
