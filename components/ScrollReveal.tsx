"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sections of the page that start below the first screen rise 6px and fade in, once, as they scroll into view.
 * Nothing happens with reduced motion, and without IntersectionObserver everything simply shows.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    let observer: IntersectionObserver | undefined;
    const start = setTimeout(() => {
      const main = document.getElementById("main");
      if (!main) return;
      // The observer's first report says what is on screen now: those sections stay as they are.
      // The rest are hidden, and ease in when they scroll into view.
      const seen = new WeakSet<Element>();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target;
            if (!seen.has(el)) {
              seen.add(el);
              if (entry.isIntersecting) observer?.unobserve(el);
              else el.classList.add("reveal-pre");
              continue;
            }
            if (!entry.isIntersecting) continue;
            observer?.unobserve(el);
            el.classList.add("reveal-in");
            requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("reveal-pre")));
          }
        },
        { threshold: [0, 0.06] },
      );
      const sections = Array.from(main.children).filter((el) => el.tagName === "SECTION").slice(1);
      for (const el of sections) observer.observe(el);
    }, 60);
    return () => {
      clearTimeout(start);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
