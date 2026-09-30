import imgs from "./images.json";
import type { Photo } from "@/lib/types";

const I = imgs as { i: number; w: number; h: number; color: string }[];

const P = (
  i: number,
  p: Omit<Photo, "id" | "src" | "thumb" | "w" | "h" | "color">,
): Photo => ({
  id: `p${i}`,
  src: `/images/p${i}.webp`,
  thumb: `/images/p${i}-sm.webp`,
  w: I[i].w,
  h: I[i].h,
  color: I[i].color,
  ...p,
});

/** Photographs supplied inside the memoir. Captions are neutral unless the contributor supplied one. */
export const PHOTOS: Photo[] = [
  P(0, {
    caption: "Portrait from the title page of the memoir book",
    categories: ["personal"],
    people: ["Col. (R) Dr. Muhammad Safdar Khan"],
  }),
  P(1, {
    caption: "Habib’s poem “صفدر ماما جي”, set beside a photograph",
    date: "Summer 2026", location: "Karachi", categories: ["memories"], memorySlug: "safdar-mama-ji-poem",
  }),
  P(2, {
    caption: "Shared with Mumtaz Ali Khan’s tribute to Mamajee",
    categories: ["family", "personal"], memorySlug: "a-life-of-faith-compassion-and-enduring-legacy",
  }),
  P(3, {
    caption: "Shared with Muhammad Hamza’s “In Memory of a Noble Soul”",
    date: "Summer 2025", location: "Mardan", categories: ["memories"], memorySlug: "in-memory-of-a-noble-soul",
  }),
  P(4, {
    caption: "Shared with Wahab Ali’s “The Heart of Our Family”",
    date: "27 July", location: "Mardan", categories: ["family", "memories"], memorySlug: "the-heart-of-our-family",
  }),
  P(5, {
    caption: "No matter how busy he was he would make time for family. This is the picture of him holding new born Hamza.",
    categories: ["family", "military-life"], memorySlug: "visiting-hospital-to-see-my-son-hamza",
    people: ["Col. (R) Dr. Muhammad Safdar Khan", "Hamza (newborn)"],
  }),
  P(6, {
    caption: "Shared with Riaz Khan’s “My Uncle”",
    date: "26/07/2026", location: "Abbott abad", categories: ["memories"], memorySlug: "my-uncle",
  }),
  P(7, {
    caption: "Shared with Quaid Iqbal’s “Remembering a Life Well Lived”",
    date: "July 2026", location: "Education City, Doha, Qatar", categories: ["memories"],
    memorySlug: "remembering-a-life-well-lived",
  }),
  P(8, {
    caption: "Shared with Ally Raza Qureshi’s “Humility as a Fundamental Principle”",
    categories: ["personal", "memories"], memorySlug: "humility-as-a-fundamental-principle",
  }),
];

/** “Then and now” mirror artwork — shown on the home page, the Memory Wall, every story and the gallery. */
export const MIRROR: Photo = {
  id: "mirror",
  src: "/images/mirror.webp",
  thumb: "/images/mirror-sm.webp",
  w: 896,
  h: 1177,
  color: "rgb(232,216,184)",
  caption: "",
  alt: "Col. (R) Dr. Muhammad Safdar Khan in later years, his hand on a mirror that reflects his younger self, beneath the words: “Time flies, and we get old, but the impact we leave echoes through generations, and millions will shed tears of gratitude for the love and goodness we’ve shared.”",
  categories: ["personal"],
  people: ["Col. (R) Dr. Muhammad Safdar Khan"],
};

/** Every photograph the site shows, in the order worth warming the cache (see ImagePreloader). */
export const PRELOAD_IMAGES = [MIRROR, ...PHOTOS].map(({ src, thumb, w }) => ({ src, thumb, w }));

export const photosForMemory = (slug: string) => PHOTOS.filter((p) => p.memorySlug === slug);
export const photoById = (id: string) => PHOTOS.find((p) => p.id === id);
