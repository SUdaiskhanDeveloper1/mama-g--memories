import Link from "next/link";
import type { ReactNode } from "react";
import { T, type Key } from "@/lib/i18n";
import { IDENTITIES, LESSONS, QUOTES, SITE } from "@/data/site";
import { MEMORIES, memoryBySlug } from "@/data/memories";
import { MIRROR, photoById } from "@/data/photos";
import type { Memory } from "@/lib/types";
import { Img } from "./Img";
import { MemoryCard } from "./MemoryCard";
import { Reveal } from "./Reveal";

export function SectionHead({ n, kicker, title, sub, id }: { n?: string; kicker?: ReactNode; title: ReactNode; sub?: ReactNode; id?: string }) {
  return (
    <header className="shead" id={id}>
      {(n || kicker) && <p className="kicker">{n && <span className="num">{n}</span>}{kicker}</p>}
      <h2 className="h2">{title}</h2>
      {sub && <p className="lede">{sub}</p>}
    </header>
  );
}

const isNative = (s: string) => /[؀-ۿ]/.test(s);

export function Featured({ items }: { items: Memory[] }) {
  const [lead, ...rest] = items;
  return (
    <div className="featured">
      {lead && <Reveal className="featured-lead"><MemoryCard m={lead} size="lg" /></Reveal>}
      <div className="featured-rest">
        {rest.slice(0, 5).map((m, i) => (
          <Reveal key={m.id} delay={i * 60}><MemoryCard m={m} /></Reveal>
        ))}
      </div>
    </div>
  );
}

export function SidesGrid({ memories }: { memories: Memory[] }) {
  return (
    <ul className="sides">
      {IDENTITIES.map((s, i) => {
        const n = memories.filter((m) => m.identities.includes(s.key)).length;
        return (
          <li key={s.key}>
            <Link href={`/memories?side=${s.key}`} className="side">
              <span className="side-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="side-t">{s.title}</span>
              <span className="side-l">{s.line}</span>
              <span className="side-c">{n} <T k="life.memories" /></span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ContributorGrid({ memories }: { memories: Memory[] }) {
  const names = Array.from(new Set(memories.map((m) => m.contributor)));
  return (
    <ul className="people">
      {names.map((name) => {
        const list = memories.filter((m) => m.contributor === name);
        return (
          <li key={name}>
            <Link href={`/memories?by=${encodeURIComponent(name)}`}>
              <span className="p-name">{name}</span>
              <span className="p-rel">{list[0].relationship}</span>
              <span className="p-count">{list.length}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function LessonCards({ limit }: { limit?: number }) {
  const items = limit ? LESSONS.slice(0, limit) : LESSONS;
  return (
    <div className="lessons">
      {items.map((l, i) => {
        const m = memoryBySlug(l.slug)!;
        const photo = l.photo ? photoById(l.photo) : undefined;
        return (
          <Reveal key={l.key} className={`lesson${photo ? " has-photo" : ""}`} as="article">
            <span className="lesson-n">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="lesson-t">{l.title}</h3>
            <blockquote className="lesson-q" dir="auto" lang={isNative(l.quote) ? "ur" : "en"}>“{l.quote}”</blockquote>
            <p className="lesson-by">
              <strong>{m.contributor}</strong>, {m.relationship}
            </p>
            <Link href={`/story/${m.slug}`} className="link-arrow"><T k="lessons.read" /></Link>
            {photo && <div className="lesson-photo"><Img photo={photo} alt="" sizes="260px" /></div>}
          </Reveal>
        );
      })}
    </div>
  );
}

export function QuoteGrid({ limit }: { limit?: number }) {
  const items = limit ? QUOTES.slice(0, limit) : QUOTES;
  return (
    <div className="quotes">
      {items.map((q) => {
        const m = memoryBySlug(q.slug)!;
        return (
          <Reveal key={q.text} className="quote" as="article">
            <blockquote dir="auto" lang={isNative(q.text) ? "ur" : "en"}>“{q.text}”</blockquote>
            <p className="quote-by">
              <span>{q.by === "col" ? "as remembered by" : "in the words of"} </span>
              <strong>{q.by === "col" ? m.contributor : q.speaker}</strong>
              <span>, {m.relationship}</span>
            </p>
            <Link href={`/story/${q.slug}`} className="quote-src">{m.title}</Link>
          </Reveal>
        );
      })}
    </div>
  );
}

export function Reflection({ size = "md", sizes = "(max-width:700px) 86vw, 460px", priority = false }: { size?: "md" | "sm"; sizes?: string; priority?: boolean }) {
  return (
    <figure className={`reflect reflect-${size}`}>
      <div className="reflect-frame"><Img photo={MIRROR} sizes={sizes} priority={priority} /></div>
      {MIRROR.caption && <figcaption>{MIRROR.caption}</figcaption>}
    </figure>
  );
}

export function CtaBlock() {
  return (
    <section className="cta">
      <div className="wrap cta-in">
        <p className="kicker"><T k="hero.shareKicker" /></p>
        <h2 className="cta-t"><T k="cta.title" /></h2>
        <p className="cta-s"><T k="cta.sub" /></p>
        <div className="row">
          <Link href="/tell" className="btn btn-gold"><T k="cta.share" /></Link>
          <Link href="/tell#photos" className="btn btn-line"><T k="cta.photo" /></Link>
        </div>
      </div>
    </section>
  );
}

export function FinalBlock() {
  const p = photoById("p7")!;
  return (
    <section className="final">
      <div className="wrap final-in">
        <div className="final-photo"><Img photo={p} alt="A photograph shared by the family" sizes="(max-width:800px) 80vw, 380px" /></div>
        <div className="final-text">
          <p className="kicker"><T k="final.title" /></p>
          <p className="final-line"><T k="final.line1" /><br /><em><T k="final.line2" /></em></p>
          <p className="final-dua"><T k="final.dua" /></p>
          <div className="row">
            <Link href="/tell" className="btn btn-gold"><T k="hero.share" /></Link>
            <Link href="/life" className="btn btn-line"><T k="final.explore" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export { SITE, MEMORIES };
