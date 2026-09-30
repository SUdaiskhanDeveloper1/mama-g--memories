import { MEMORIES } from "@/data/memories";
import { MIRROR, PHOTOS } from "@/data/photos";
import { fetchApproved, fetchGalleryPhotos } from "./db";
import type { Memory, Photo } from "./types";

/** Seed (from the memoir) + approved visitor memories. */
export async function allMemories(): Promise<Memory[]> {
  const db = await fetchApproved();
  const seen = new Set(MEMORIES.map((m) => m.slug));
  return [...MEMORIES, ...db.filter((m) => !seen.has(m.slug))];
}

export async function allPhotos(): Promise<Photo[]> {
  const [db, mem] = await Promise.all([fetchGalleryPhotos(), fetchApproved()]);
  const memPhotos = mem.flatMap((m) => m.photos);
  return [MIRROR, ...PHOTOS, ...db, ...memPhotos];
}
