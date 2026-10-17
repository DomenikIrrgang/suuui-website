import type { Metadata } from "next";
import Link from "next/link";
import { LiveHud } from "@/components/demo/LiveHud";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "Live demo",
  description: "SuuUI's HUD through one dungeon pull, on a loop: the whole interface in a fight.",
};

/**
 * The home page's live HUD on its own, filling the screen. Made for a phone turned sideways; held upright it
 * still plays, across the width, with a hint to turn it.
 */
export default function DemoPage() {
  return (
    <div role="dialog" aria-modal="true" aria-label="The full live demo" className={s.overlay}>
      <div className={s.stage}>
        <LiveHud />
      </div>
      <p className={s.hint}>Turn your phone sideways to see it bigger.</p>
      <Link href="/" aria-label="Close the demo" className={s.close}>
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </Link>
    </div>
  );
}
