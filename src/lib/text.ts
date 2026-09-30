import type { Lang, Memory } from "./types";

export const hasArabic = (s: string) => /[؀-ۿ]/.test(s);

/** A title is only set in the memory's script if it actually contains that script. */
export const titleLang = (m: Pick<Memory, "title" | "lang">): Lang => (hasArabic(m.title) ? (m.lang === "en" ? "ur" : m.lang) : "en");
