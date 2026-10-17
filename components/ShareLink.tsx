"use client";

import { useState } from "react";
import { cx } from "./ui";
import s from "./ShareLink.module.css";

/** SuuUI installs on a computer, so on a phone the site offers to send the Download page's link along. */
const downloadUrl = () => `${window.location.origin}/download`;

const shareIcon = (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
  </svg>
);

async function copy(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * "Send me the link": the phone's share sheet with the Download page's link, or, where there is none,
 * the link copied. `copy` makes it a plain copy button.
 */
export function ShareLink({
  mode = "share",
  variant = "primary",
  icon = mode === "share",
  className,
}: {
  mode?: "share" | "copy";
  variant?: "primary" | "secondary";
  icon?: boolean;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "shared" | "copied" | "failed">("idle");

  const onClick = async () => {
    const url = downloadUrl();
    if (mode === "share" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "SuuUI", text: "SuuUI, the interface for WoW Forever", url });
        setState("shared");
      } catch (error) {
        // Closing the share sheet isn't a failure.
        if ((error as Error)?.name !== "AbortError") setState((await copy(url)) ? "copied" : "failed");
      }
      return;
    }
    setState((await copy(url)) ? "copied" : "failed");
  };

  const idleLabel = mode === "share" ? "Send me the link" : "Copy the link";
  const label = {
    idle: idleLabel,
    shared: "Link ready to send",
    copied: "Link copied",
    failed: idleLabel,
  }[state];
  const announce = {
    idle: "",
    shared: "",
    copied: "Link copied.",
    failed: "The link couldn't be copied.",
  }[state];

  return (
    <>
      <button type="button" onClick={onClick} className={cx(s.button, s[variant], className)}>
        {icon && shareIcon}
        {label}
      </button>
      <span role="status" className="visually-hidden">
        {announce}
      </span>
    </>
  );
}
