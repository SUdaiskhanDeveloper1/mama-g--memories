import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/lib/i18n";
import { memoryBySlug } from "@/data/memories";
import { LessonCards, SectionHead, CtaBlock } from "@/components/Sections";
import { Byline } from "@/components/MemoryCard";

export const metadata: Metadata = {
  title: "Faith, Values & Lessons",
  description: "His faith and values as remembered by the people who knew him, and the lessons he left behind.",
};

const FAITH = [
  { slug: "humility-as-a-fundamental-principle", pull: "He never asked where someone came from, what they believed, how much they owned, or what status they held. To him, every person was worthy of kindness simply because they were human." },
  { slug: "patience-and-grace", pull: "Make yourself humble like the earth, and accessible like the wind—for everyone, especially your relatives." },
  { slug: "a-life-of-faith-compassion-and-enduring-legacy", pull: "He firmly rejected sectarianism, ethnic prejudice, and racism, believing that these divisions weakened both society and the true spirit of faith." },
  { slug: "a-life-guided-by-faith-and-service", pull: "More than a decorated officer and respected doctor, he was the pillar of our family." },
  { slug: "towards-the-hereafter", pull: "ھغہ یو داسے صوفی وو چہ د الله او د ھغہ رسول ﷺ سرہ ئ بی کچہ مینہ لرلہ۔" },
];

export default function Values() {
  return (
    <>
      <div className="page">
        <div className="wrap">
          <SectionHead title={<T k="values.title" />} sub={<T k="values.sub" />} />
          <div className="faith-list">
            {FAITH.map((f) => {
              const m = memoryBySlug(f.slug)!;
              return (
                <article key={f.slug} className="faith">
                  <blockquote dir="auto" lang={/[؀-ۿ]/.test(f.pull) ? "ps" : "en"}>“{f.pull}”</blockquote>
                  <div>
                    <Byline m={m} />
                    <Link href={`/story/${m.slug}`} className="link-arrow" lang={m.lang}>{m.title}</Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
      <section className="section tint" id="lessons">
        <div className="wrap">
          <SectionHead title={<T k="lessons.title" />} />
          <LessonCards />
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
