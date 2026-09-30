import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MEMORIES, memoryBySlug } from "@/data/memories";
import { MILESTONES, SITE } from "@/data/site";
import { fetchApprovedBySlug } from "@/lib/db";
import { allMemories } from "@/lib/all";
import { T } from "@/lib/i18n";
import type { Memory } from "@/lib/types";
import { Img } from "@/components/Img";
import { Prose } from "@/components/Prose";
import { Byline, MemoryCard } from "@/components/MemoryCard";
import { ShareBar } from "@/components/ShareBar";
import { RemovalForm } from "@/components/RemovalForm";
import { titleLang } from "@/lib/text";
import { Reveal } from "@/components/Reveal";
import { Reflection } from "@/components/Sections";

export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return MEMORIES.map((m) => ({ slug: m.slug }));
}

async function load(slug: string): Promise<Memory | null> {
  return memoryBySlug(slug) ?? (await fetchApprovedBySlug(slug));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = await load(slug);
  if (!m) return { title: "Memory not found", robots: { index: false } };
  const img = m.photos[0]?.src ?? "/og.jpg";
  const title = `${m.title} — ${m.contributor}`;
  return {
    title,
    description: m.excerpt,
    alternates: { canonical: `/story/${m.slug}` },
    openGraph: {
      type: "article",
      title,
      description: `${m.relationship} · ${m.excerpt}`,
      url: `/story/${m.slug}`,
      images: [{ url: img }],
    },
    twitter: { card: "summary_large_image", title, description: m.excerpt, images: [img] },
  };
}

const CHIPS = ["An angry doctor", "A frustrated mechanic", "A defiant student", "Someone a few years younger"];

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = await load(slug);
  if (!m) notFound();

  const all = await allMemories();
  const more = all.filter((x) => x.contributor === m.contributor && x.slug !== m.slug);
  const url = `${SITE.url}/story/${m.slug}`;
  const rtl = m.lang !== "en";
  const [hero, ...rest] = m.photos;

  return (
    <article className={`reader${slug === "the-magic-word-bachay" ? " reader-bachay" : ""}${slug === "col-safdar-is-my-uncle" ? " reader-col" : ""}`}>
      <div className="reader-wrap">
        <Link href="/memories" className="back">← <T k="story.back" /></Link>

        <header className="reader-head">
          <p className="kicker"><T k="story.by" /></p>
          <div className="reader-who">
            <Byline m={m} />
          </div>
          <h1 className="reader-title" lang={titleLang(m)} dir="auto">{m.title}</h1>
          {m.subtitle && <p className="reader-sub" lang={/[؀-ۿ]/.test(m.subtitle) ? "ur" : "en"} dir="auto">{m.subtitle}</p>}
        </header>

        {slug === "the-magic-word-bachay" && (
          <div className="bachay-stage" aria-hidden>
            <Reveal><p className="bachay-huge">Bachay<span>.</span></p></Reveal>
            <ul className="chips-soft">{CHIPS.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        )}

        {slug === "col-safdar-is-my-uncle" && (
          <ol className="milestones" aria-label="Story milestones">
            {MILESTONES.map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 50}>
                <span className="ms-label">{s.label}</span>
                <span className="ms-title">{s.title}</span>
                {s.note && <span className="ms-note">{s.note}</span>}
              </Reveal>
            ))}
          </ol>
        )}

        {hero && (
          <figure className="reader-fig">
            <Img photo={hero} sizes="(max-width:760px) 92vw, 720px" priority full />
            <figcaption>{hero.caption}{hero.date || hero.location ? ` — ${[hero.date, hero.location].filter(Boolean).join(" · ")}` : ""}</figcaption>
          </figure>
        )}

        {m.audioUrl && (
          <div className="audio">
            <p><T k="story.listen" /></p>
            <audio controls preload="none" src={m.audioUrl} />
          </div>
        )}
        {m.videoUrl && <video className="reader-video" controls preload="none" src={m.videoUrl} playsInline />}

        {m.translation && <p className="ver-tag"><T k="story.original" /></p>}
        <Prose text={m.story} form={m.form} lang={m.lang} />
        {m.translation && (
          <>
            <p className="ver-tag"><T k="story.translation" /></p>
            <Prose text={m.translation} lang="en" />
          </>
        )}

        {rest.length > 0 && (
          <div className="reader-more-photos">
            {rest.map((p) => (
              <figure key={p.id}><Img photo={p} sizes="(max-width:760px) 92vw, 480px" /><figcaption>{p.caption}</figcaption></figure>
            ))}
          </div>
        )}

        {m.photos.length > 0 && (
          <p className="reader-photos-link">
            <Link href={`/gallery?memory=${m.slug}`} className="link-arrow"><T k="story.photos" /></Link>
          </p>
        )}

        <Reveal className="reader-reflect"><Reflection size="sm" sizes="(max-width:760px) 80vw, 380px" /></Reveal>

        <footer className="reader-foot">
          <ShareBar url={url} title={m.title} contributor={m.contributor} />
          <div className="reader-next">
            <Link href="/tell" className="btn btn-gold"><T k="story.yours" /></Link>
          </div>
          <RemovalForm slug={m.slug} title={m.title} />
        </footer>
      </div>

      {more.length > 0 && (
        <section className="reader-related">
          <div className="wrap">
            <h2 className="h3"><T k="story.moreFrom" /> {m.contributor}</h2>
            <div className="grid-cards">{more.slice(0, 3).map((x) => <MemoryCard key={x.id} m={x} />)}</div>
          </div>
        </section>
      )}
    </article>
  );
}
