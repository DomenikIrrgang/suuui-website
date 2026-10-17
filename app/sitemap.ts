import type { MetadataRoute } from "next";
import { getReleaseData } from "@/lib/releases";
import { SITE } from "@/lib/seo";

// Every page but /download/zip, which starts a download by itself.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { latest } = await getReleaseData();
  const released = new Date(`${latest.date}T00:00:00Z`);
  const page = (path: string, priority: number, lastModified?: Date): MetadataRoute.Sitemap[number] => ({
    url: `${SITE}${path}`,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency: "weekly",
    priority,
  });
  return [
    page("/", 1, released),
    page("/download", 0.9, released),
    page("/features", 0.8),
    page("/guide", 0.8),
    page("/faq", 0.7),
    page("/in-combat", 0.6),
    page("/compatibility", 0.6),
    page("/changelog", 0.6, released),
    page("/developers", 0.5),
    page("/demo", 0.3),
  ];
}
