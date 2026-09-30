import { hasSupabase, supabase } from "./supabase";
import type { Memory, Photo, Lang } from "./types";

export interface MemoryRow {
  id: string;
  slug: string;
  title: string;
  story: string;
  contributor_name: string;
  relationship: string;
  relationship_group: string | null;
  memory_date: string | null;
  location: string | null;
  categories: string[] | null;
  identities: string[] | null;
  language: Lang | null;
  quote: string | null;
  photos: Photo[] | null;
  translation: string | null;
  audio_url: string | null;
  video_url: string | null;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  is_private: boolean;
  created_at: string;
}

export function rowToMemory(r: MemoryRow): Memory {
  const clean = r.story.replace(/[*>#]/g, "").trim();
  const excerpt = clean.length <= 240 ? clean : clean.slice(0, clean.lastIndexOf(" ", 240)) + "…";
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    story: r.story,
    contributor: r.contributor_name,
    relationship: r.relationship,
    date: r.memory_date ?? undefined,
    location: r.location ?? undefined,
    lang: (r.language ?? "en") as Lang,
    form: "prose",
    groups: r.relationship_group ? [r.relationship_group] : ["others"],
    categories: r.categories ?? [],
    identities: r.identities ?? [],
    quote: r.quote ?? undefined,
    photos: (r.photos ?? []).map((p, i) => ({ ...p, id: p.id ?? `${r.id}-${i}`, thumb: p.thumb ?? p.src, memorySlug: r.slug })),
    translation: r.translation ?? undefined,
    audioUrl: r.audio_url ?? undefined,
    videoUrl: r.video_url ?? undefined,
    excerpt,
    source: "db",
    createdAt: r.created_at,
  };
}

/** Approved, public memories. Returns [] when Supabase is not configured or unreachable. */
export async function fetchApproved(): Promise<Memory[]> {
  if (!hasSupabase) return [];
  try {
    const { data, error } = await supabase()
      .from("memories")
      .select("*")
      .eq("status", "approved")
      .eq("is_private", false)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as MemoryRow[]).map(rowToMemory);
  } catch {
    return [];
  }
}

export async function fetchApprovedBySlug(slug: string): Promise<Memory | null> {
  if (!hasSupabase) return null;
  try {
    const { data } = await supabase()
      .from("memories")
      .select("*")
      .eq("slug", slug)
      .eq("status", "approved")
      .eq("is_private", false)
      .maybeSingle();
    return data ? rowToMemory(data as MemoryRow) : null;
  } catch {
    return null;
  }
}

export async function fetchGalleryPhotos(): Promise<Photo[]> {
  if (!hasSupabase) return [];
  try {
    const { data } = await supabase().from("photos").select("*").order("created_at", { ascending: false });
    return (data ?? []).map((p: any) => ({
      id: p.id, src: p.src, thumb: p.thumb ?? p.src, w: p.width ?? 1200, h: p.height ?? 800,
      caption: p.caption ?? "", date: p.photo_date ?? undefined, location: p.location ?? undefined,
      people: p.people ?? [], categories: p.categories ?? ["memories"], memorySlug: p.memory_slug ?? undefined,
    }));
  } catch {
    return [];
  }
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9؀-ۿ]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "memory";

export interface TimelineRow { id: string; date_label: string; sort_key: number; title: string; body: string | null; memory_slug: string | null; kind: "life" | "memory" }

export async function fetchTimeline(): Promise<TimelineRow[]> {
  if (!hasSupabase) return [];
  try {
    const { data } = await supabase().from("timeline_events").select("*").order("sort_key");
    return (data ?? []) as TimelineRow[];
  } catch {
    return [];
  }
}
