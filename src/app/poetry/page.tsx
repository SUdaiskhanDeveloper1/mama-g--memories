import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/lib/i18n";
import { memoryBySlug } from "@/data/memories";
import { Poem } from "@/components/Prose";
import { Byline } from "@/components/MemoryCard";
import { SectionHead, CtaBlock } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "His Words & The Words Written For Him",
  description: "Pashto and Urdu poetry and memoir writing shared by the family, with line breaks preserved exactly.",
};

/** Slices the stored text so wording and line breaks are exactly the supplied ones. */
const between = (text: string, from: string, to?: string) => {
  const a = text.indexOf(from);
  if (a < 0) return "";
  const b = to ? text.indexOf(to, a) : -1;
  return (b < 0 ? text.slice(a) : text.slice(a, b)).trim();
};

export default function PoetryPage() {
  const mama = memoryBySlug("safdar-mama-ji-poem")!;
  const miss = memoryBySlug("miss-you-mama-ji")!;
  const hereafter = memoryBySlug("towards-the-hereafter")!;
  const humility = memoryBySlug("humility-as-a-fundamental-principle")!;
  const friend = memoryBySlug("the-friend")!;

  const romanized = between(miss.story, "Kala kala", "کله کله");
  const script = between(miss.story, "کله کله");
  const foreword = hereafter.story.slice(
    hereafter.story.indexOf("د كلام رحمان پټې خزانې پټ اړخونه\n(د"),
    hereafter.story.lastIndexOf("خاورې صفدر") + "خاورې صفدر".length,
  ).trim();
  const couplet = between(hereafter.story, "چې دې خپل زړګي ته ګورم", "څو خبرے");
  const seed = between(humility.story, "ژوندے ځان په ځمکه", "“Bury yourself");
  const seedEn = between(humility.story, "“Bury yourself", "This was not merely");
  const urduSher = between(friend.story, "بچھڑا کچھ", "یہ شعر کئی");

  return (
    <>
      <div className="page">
        <div className="wrap">
          <SectionHead title={<T k="poetry.title" />} sub={<T k="poetry.sub" />} />
        </div>
      </div>

      <div className="poems">
        <Reveal as="article" className="poem-card">
          <p className="kicker" lang="ps">{mama.subtitle}</p>
          <Poem text={mama.story} lang="ps" />
          <Byline m={mama} />
          <Link href={`/story/${mama.slug}`} className="link-arrow">Open with photograph</Link>
        </Reveal>

        <Reveal as="article" className="poem-card poem-tint">
          <p className="kicker">{miss.title}</p>
          <div className="poem-pair">
            <div><span className="tag">Romanized</span><Poem text={romanized} lang="en" className="poem-latin" /></div>
            <div><span className="tag" lang="ps">پښتو</span><Poem text={script} lang="ps" /></div>
          </div>
          <Byline m={miss} />
        </Reveal>

        <Reveal as="article" className="poem-card">
          <p className="kicker">His words — a foreword he wrote</p>
          <p className="poem-note">
            Shared by Habibullah Khan Khattak: part of a foreword (تقریظ) that Dr. Safdar wrote for Professor Mir Hatim’s book on Rahman Baba. Signed “خاورې صفدر”.
          </p>
          <Poem text={foreword} lang="ps" className="poem-prose" />
          <Byline m={hereafter} />
          <Link href={`/story/${hereafter.slug}`} className="link-arrow">Read the full piece</Link>
        </Reveal>

        <Reveal as="article" className="poem-card poem-tint">
          <p className="kicker">Rahman Baba — quoted by Ally Raza Qureshi</p>
          <div className="poem-pair">
            <div><span className="tag"><T k="story.original" /></span><Poem text={seed} lang="ps" /></div>
            <div><span className="tag"><T k="story.translation" /></span><Poem text={seedEn} lang="en" className="poem-latin" /></div>
          </div>
          <Byline m={humility} />
        </Reveal>

        <Reveal as="article" className="poem-card">
          <p className="kicker">Verses quoted by Habibullah Khan Khattak</p>
          <div className="poem-pair">
            <div><span className="tag" lang="ur">اردو</span><Poem text={urduSher} lang="ur" /></div>
            <div><span className="tag" lang="ps">پښتو</span><Poem text={couplet} lang="ps" /></div>
          </div>
          <Byline m={friend} />
        </Reveal>
      </div>
      <CtaBlock />
    </>
  );
}
