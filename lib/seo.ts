import { isValidElement, type ReactNode } from "react";

/** Absolute base URL, as in the page metadata. */
export const SITE = process.env.SITE_URL ?? "http://localhost:3000";

/** The plain text of simple JSX (text, links, inline code), for structured data. */
export function textOf(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}
