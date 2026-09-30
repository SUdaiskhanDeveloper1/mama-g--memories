import type { MetadataRoute } from "next";
import { MEMORIES } from "@/data/memories";
import { fetchApproved } from "@/lib/db";
import { SITE } from "@/data/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await fetchApproved();
  const pages = ["", "/life", "/memories", "/gallery", "/poetry", "/values", "/quotes", "/tell"].map((p) => ({
    url: `${SITE.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7,
  }));
  const stories = [...MEMORIES, ...db].map((m) => ({ url: `${SITE.url}/story/${m.slug}`, changeFrequency: "monthly" as const, priority: 0.6 }));
  return [...pages, ...stories];
}
