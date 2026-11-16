import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Bump when the page content changes, so Google knows to look again.
const UPDATED = "2026-11-16";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/privacy`, lastModified: UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];
}
