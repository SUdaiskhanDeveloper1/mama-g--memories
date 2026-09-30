import source from "./source.json";
import { photosForMemory } from "./photos";
import type { Memory, Lang } from "@/lib/types";

/**
 * Curation layer over src/data/source.json (verbatim text extracted from the supplied memoir).
 * Nothing here adds facts: titles for untitled entries are taken from the entry's own heading
 * or named neutrally after the contributor; attribution follows the supplied labels.
 */
interface Meta {
  idx: number;
  slug: string;
  title: string;
  subtitle?: string;
  contributor: string;
  relationship: string;
  date?: string;
  location?: string;
  lang: Lang;
  form?: "prose" | "poem";
  trimLead?: number; // leading heading lines that only repeat the title
  groups: string[];
  categories: string[];
  identities: string[];
  quote?: string;
  featured?: number; // order in the featured strip
}

const META: Meta[] = [
  {
    idx: 7, slug: "the-heart-of-our-family", title: "The Heart of Our Family",
    contributor: "Wahab Ali", relationship: "Grandson", date: "27 July", location: "Mardan", lang: "en",
    groups: ["grandchildren", "family"], categories: ["grandfather", "family", "faith", "life-lessons", "medicine"],
    identities: ["grandfather", "doctor", "elder"], featured: 1,
    quote: "He believed in learning, in service, and in doing the right thing even when no one was watching.",
  },
  {
    idx: 15, slug: "remembering-a-life-well-lived", title: "Remembering a Life Well Lived",
    contributor: "Quaid Iqbal", relationship: "Grandson", date: "July 2026", location: "Education City, Doha, Qatar", lang: "en",
    groups: ["grandchildren", "family"], categories: ["grandfather", "family", "life-lessons", "farewell"],
    identities: ["grandfather"],
  },
  {
    idx: 19, slug: "a-life-guided-by-faith-and-service", title: "A Life Guided by Faith and Service",
    contributor: "Quaid Iqbal", relationship: "Grandson", lang: "en",
    groups: ["grandchildren", "family"], categories: ["grandfather", "faith", "life-lessons"],
    identities: ["grandfather", "faith", "doctor"],
  },
  {
    idx: 9, slug: "words-i-will-never-forget", title: "Words I Will Never Forget",
    contributor: "Sajid I. Dawezai", relationship: "Family / Friend", date: "2016", lang: "en",
    groups: ["friends"], categories: ["medicine", "life-lessons", "wisdom", "humor"],
    identities: ["doctor", "mentor"], featured: 2,
    quote: "Watch three surgeries, and you will be able to perform the fourth.",
  },
  {
    idx: 3, slug: "the-magic-word-bachay", title: "The Magic Word — “Bachay”",
    contributor: "Habib", relationship: "Nephew", date: "July 2026", location: "Karachi", lang: "en",
    groups: ["nephews", "family"], categories: ["mamajee", "humor", "wisdom", "humanity"],
    identities: ["mamajee", "mentor", "elder"], featured: 3, quote: "Bachay.",
  },
  {
    idx: 4, slug: "col-safdar-is-my-uncle", title: "Col Safdar Is My Uncle",
    subtitle: "Beyond the Name: How “Col Safdar Is My Uncle” Built an Officer",
    contributor: "Habib", relationship: "Nephew", date: "July 2026", location: "Karachi", lang: "en", trimLead: 1,
    groups: ["nephews", "family"], categories: ["mamajee", "military", "education", "life-lessons", "humor"],
    identities: ["mamajee", "mentor", "soldier"], featured: 4,
    quote: "I want your name to be a source of recognition for me.",
  },
  {
    idx: 14, slug: "my-uncle", title: "My Uncle", subtitle: "ہمارے ماموں",
    contributor: "Riaz Khan", relationship: "Family", date: "26/07/2026", location: "Abbott abad", lang: "ur", trimLead: 1,
    groups: ["family", "nephews"], categories: ["mamajee", "family", "humor", "service", "wisdom", "education", "humanity", "generosity"],
    identities: ["mamajee", "mentor", "elder", "teacher", "humanitarian", "scholar"], featured: 5,
  },
  {
    idx: 1, slug: "a-life-of-faith-compassion-and-enduring-legacy", title: "A Life of Faith, Compassion and Enduring Legacy",
    subtitle: "Mamajee", contributor: "Mumtaz Ali Khan", relationship: "Nephew", date: "Always", location: "Everywhere", lang: "en",
    groups: ["nephews", "family"],
    categories: ["mamajee", "family", "faith", "generosity", "humanity", "military", "travel", "wisdom", "service", "friendship", "farewell", "life-lessons"],
    identities: ["mamajee", "humanitarian", "faith", "scholar", "traveler", "soldier", "elder", "friend"], featured: 6,
    quote: "Mumtaz, jobs don’t matter—they are temporary. What truly matters is love and prayers.",
  },
  {
    idx: 10, slug: "a-tribute-to-the-life-and-legacy", title: "A Tribute to the Life and Legacy",
    contributor: "Ali Gauher Khan", relationship: "Son-in-law", date: "25 July 2026", location: "Bahria Town, Islamabad", lang: "en", trimLead: 1,
    groups: ["family"], categories: ["father", "family", "military", "humanity", "service", "faith", "poetry"],
    identities: ["father", "soldier", "doctor", "poet", "scholar", "mentor", "humanitarian", "elder"], featured: 7,
  },
  {
    idx: 18, slug: "patience-and-grace", title: "Patience and Grace", subtitle: "Lessons Left Behind",
    contributor: "Habib", relationship: "Nephew", date: "24 July 2026", location: "Karachi", lang: "en", trimLead: 1,
    groups: ["nephews", "family"], categories: ["life-lessons", "wisdom", "family", "faith"],
    identities: ["mentor", "elder", "faith"], featured: 8,
    quote: "Make yourself humble like the earth, and accessible like the wind—for everyone, especially your relatives.",
  },
  {
    idx: 17, slug: "humility-as-a-fundamental-principle", title: "Humility as a Fundamental Principle",
    contributor: "Ally Raza Qureshi", relationship: "Son-in-law", date: "Life long", lang: "en",
    groups: ["family"], categories: ["faith", "humanity", "life-lessons", "wisdom", "service"],
    identities: ["faith", "poet", "doctor", "grandfather"], featured: 9, quote: "His religion was humanity.",
  },
  {
    idx: 12, slug: "the-friend", title: "The Friend", subtitle: "ڈاکٹر محمد صفدر خان کا سفر آخرت",
    contributor: "Habibullah Khan Khattak", relationship: "Family / Friend", date: "1977", location: "Bannu", lang: "ur",
    groups: ["friends"], categories: ["father", "family", "friendship", "faith"],
    identities: ["father", "friend"], featured: 10,
  },
  {
    idx: 16, slug: "towards-the-hereafter", title: "ډاكټر محمد صفدر خان د آخرت په لور", subtitle: "Supplied under the title “2021”",
    contributor: "Habibullah Khan Khattak", relationship: "Friend", location: "Rawalpindi", lang: "ps",
    groups: ["friends"], categories: ["faith", "poetry", "wisdom", "friendship", "farewell"],
    identities: ["friend", "faith", "poet", "scholar", "elder"],
  },
  {
    idx: 2, slug: "twenty-six-years-together", title: "کرنل ڈاکٹر محمد صفدر خان کے ساتھ گزارے چھبیس سال کا خلاصہ",
    contributor: "Waseem Abbas Khan", relationship: "Family / Friend", lang: "ur",
    groups: ["friends", "colleagues"], categories: ["service", "humanity", "faith", "generosity"],
    identities: ["humanitarian", "faith"],
  },
  {
    idx: 5, slug: "in-loving-memory-of-colonel-sahib", title: "In Loving Memory of Colonel Sahib",
    contributor: "Sikander Khan", relationship: "Family / Friend", lang: "en", trimLead: 1,
    groups: ["friends"], categories: ["friendship", "wisdom", "generosity"], identities: ["friend", "mentor"],
  },
  {
    idx: 8, slug: "a-memory-from-jawad-ullah", title: "A Memory from Jawad Ullah",
    contributor: "Jawad Ullah", relationship: "Family / Friend", lang: "en",
    groups: ["friends"], categories: ["medicine", "friendship", "service", "family"], identities: ["doctor", "friend"],
  },
  {
    idx: 6, slug: "in-memory-of-a-noble-soul", title: "In Memory of a Noble Soul",
    contributor: "Muhammad Hamza", relationship: "Family", date: "Summer 2025", location: "Mardan", lang: "en", trimLead: 1,
    groups: ["family"], categories: ["family", "wisdom", "humanity"], identities: ["elder"],
  },
  {
    idx: 11, slug: "visiting-hospital-to-see-my-son-hamza", title: "Visiting Hospital to See My Son Hamza",
    contributor: "Mumtaz Ali Khan", relationship: "Nephew", lang: "en",
    groups: ["nephews", "family"], categories: ["family", "military"], identities: ["mamajee", "soldier"],
    quote: "No matter how busy he was he would make time for family.",
  },
  {
    idx: 0, slug: "safdar-mama-ji-poem", title: "Memoir", subtitle: "صفدر ماما جي",
    contributor: "Habib", relationship: "Nephew", date: "Summer 2026", location: "Karachi", lang: "ps", form: "poem",
    groups: ["nephews", "family"], categories: ["poetry", "mamajee", "family", "farewell"],
    identities: ["mamajee", "doctor", "teacher", "elder"],
  },
  {
    idx: 13, slug: "miss-you-mama-ji", title: "Miss You Mama Ji",
    contributor: "Habib", relationship: "Nephew", date: "September 2026", location: "Karachi", lang: "ps", form: "poem",
    groups: ["nephews", "family"], categories: ["poetry", "mamajee", "farewell"],
    identities: ["mamajee", "doctor", "teacher"],
  },
];

interface Src { idx: number; title: string; img: number; text: string }
const SRC = source as unknown as Src[];

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

function makeExcerpt(text: string, form: "prose" | "poem"): string {
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l && !/^[-–—O]{1,}$/.test(l) && !/^#+\s/.test(l));
  if (form === "poem") return lines.slice(0, 2).join(" ⁄ ");
  const first = lines.find((l) => l.length > 60) ?? lines[0] ?? "";
  const clean = first.replace(/[*>#]/g, "").trim();
  if (clean.length <= 240) return clean;
  const cut = clean.slice(0, 240);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

export const MEMORIES: Memory[] = META.map((m) => {
  const s = SRC.find((r) => r.idx === m.idx)!;
  const lines = s.text.split("\n");
  const story = lines.slice(m.trimLead ?? 0).join("\n").replace(/^\n+/, "");
  const form = m.form ?? "prose";
  const mem: Memory = {
    id: `seed-${m.idx}`,
    slug: m.slug,
    title: m.title,
    subtitle: m.subtitle,
    story,
    contributor: m.contributor,
    relationship: m.relationship,
    date: m.date,
    location: m.location,
    lang: m.lang,
    form,
    groups: m.groups,
    categories: m.categories,
    identities: m.identities,
    quote: m.quote,
    featured: m.featured,
    photos: [],
    excerpt: makeExcerpt(story, form),
    source: "seed",
  };
  mem.photos = photosForMemory(m.slug);
  return mem;
});

export const memoryBySlug = (slug: string) => MEMORIES.find((m) => m.slug === slug);
export const memoryText = (slug: string) => norm(memoryBySlug(slug)?.story ?? "");
export const FEATURED = MEMORIES.filter((m) => m.featured).sort((a, b) => a.featured! - b.featured!);
export const CONTRIBUTORS = Array.from(new Set(MEMORIES.map((m) => m.contributor)));
