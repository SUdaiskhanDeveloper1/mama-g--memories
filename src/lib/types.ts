export type Lang = "en" | "ur" | "ps";

export interface Photo {
  id: string;
  src: string; // full-size url
  thumb: string; // small url
  w: number;
  h: number;
  color?: string; // dominant colour placeholder
  caption: string;
  alt?: string; // screen-reader description when it differs from the caption
  date?: string;
  location?: string;
  people?: string[];
  categories: string[];
  memorySlug?: string;
}

export interface Memory {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  story: string;
  contributor: string;
  relationship: string;
  date?: string;
  location?: string;
  lang: Lang;
  form: "prose" | "poem";
  groups: string[];
  categories: string[];
  identities: string[];
  quote?: string;
  featured?: number;
  photos: Photo[];
  translation?: string;
  audioUrl?: string;
  videoUrl?: string;
  excerpt: string;
  source: "seed" | "db";
  createdAt?: string;
}
