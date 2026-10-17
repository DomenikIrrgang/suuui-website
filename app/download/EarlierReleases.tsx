"use client";

import { useState, type ReactNode } from "react";
import { MoreButton } from "@/components/Mobile";

/** The phone layout's list of earlier releases, folded away until asked for. */
export function EarlierReleases({ count, children }: { count: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <MoreButton expanded={open} onClick={() => setOpen(!open)}>
        {open ? "Hide earlier releases" : `Show earlier releases (${count})`}
      </MoreButton>
      {open && children}
    </>
  );
}
