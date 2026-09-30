import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/lib/i18n";
import { CHAPTERS, TIMELINE, type Chapter } from "@/data/site";
import { CONTRIBUTORS, memoryBySlug } from "@/data/memories";
import { photoById } from "@/data/photos";
import { allMemories } from "@/lib/all";
import { fetchTimeline } from "@/lib/db";
import { titleLang } from "@/lib/text";
import { Img } from "@/components/Img";
import { Reveal } from "@/components/Reveal";
import { Byline } from "@/components/MemoryCard";
import { CtaBlock, SectionHead } from "@/components/Sections";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "His Life & Heritage",
  description: "The life of Col. (R) Dr. Muhammad Safdar Khan — Haji Abad, family, service, medicine, faith, travel and friendship — in the words of those who knew him.",
};

function Passages({ chapter }: { chapter: Chapter }) {
  return (
    <div className="passages">
      {chapter.passages.map((p, i) => {
        const m = memoryBySlug(p.slug)!;
        return (
          <figure key={i} className="passage">
            <blockquote lang={m.lang} dir="auto">{p.text}</blockquote>
            <figcaption>
              <Byline m={m} />
              <Link href={`/story/${m.slug}`} className="link-arrow" lang={titleLang(m)}>{m.title}</Link>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}

const byId = (id: string) => CHAPTERS.find((c) => c.id === id)!;

export default async function Life() {
  const [memories, extra] = await Promise.all([allMemories(), fetchTimeline()]);
  const events = [
    ...TIMELINE,
    ...extra.map((r) => ({ when: r.date_label, sort: r.sort_key, kind: r.kind, title: r.title, body: r.body ?? "", slug: r.memory_slug ?? undefined })),
  ];
  const contributors = new Set(memories.map((m) => m.contributor)).size;
  const rest = CHAPTERS.filter((c) => !["early-life", "family", "final-days", "farewell", "legacy"].includes(c.id));
  const ordered = [byId("early-life"), byId("family"), ...rest];
  const hospital = photoById("p5")!;

  return (
    <>
      <div className="page">
        <div className="wrap">
          <SectionHead title={<T k="life.title" />} sub={<T k="life.sub" />} />
          <ul className="jump" aria-label="Chapters">
            {ordered.map((c) => <li key={c.id}><a href={`#${c.id}`}>{c.title}</a></li>)}
            <li><a href="#timeline"><T k="life.timeline" /></a></li>
            <li><a href="#final"><T k="life.final" /></a></li>
            <li><a href="#legacy"><T k="life.legacy" /></a></li>
          </ul>
        </div>
      </div>

      <div className="wrap chapters">
        {ordered.map((c, i) => (
          <Reveal key={c.id} as="section" className="chapter">
            <div className="chapter-head" id={c.id}>
              <span className="chapter-n">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="h3">{c.title}</h2>
            </div>
            <Passages chapter={c} />
          </Reveal>
        ))}
      </div>

      <section className="section tint" id="family-travels">
        <div className="wrap fam">
          <div className="fam-photo"><Img photo={hospital} sizes="(max-width:900px) 92vw, 520px" /></div>
          <div>
            <SectionHead title={<T k="life.family" />} sub={<T k="life.familyNote" />} />
            <blockquote className="fam-cap">
              “Visiting hospital to see my son Hamza”
              <footer>No matter how busy he was he would make time for family. This is the picture of him holding new born Hamza.</footer>
            </blockquote>
            <Byline m={{ contributor: "Mumtaz Ali Khan", relationship: "Nephew" }} />
            <div className="row">
              <Link href="/gallery" className="btn btn-line"><T k="nav.gallery" /></Link>
              <Link href="/tell#photos" className="btn btn-gold"><T k="gallery.addPhoto" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="timeline">
        <div className="wrap">
          <SectionHead title={<T k="life.timeline" />} sub={<T k="life.timelineNote" />} />
          <ol className="timeline">
            {events.sort((a, b) => a.sort - b.sort).map((e) => (
              <Reveal as="li" key={e.when + e.title} className={`tl tl-${e.kind}`}>
                <span className="tl-when">{e.when}</span>
                <div className="tl-card">
                  <h3>{e.title}</h3>
                  <p>{e.body}</p>
                  {e.slug && <Link href={`/story/${e.slug}`} className="link-arrow" lang={memoryBySlug(e.slug)?.lang}>{memoryBySlug(e.slug)?.title}</Link>}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section calm" id="final">
        <div className="wrap">
          <SectionHead title={<T k="life.final" />} sub={<T k="life.finalNote" />} />
          <Passages chapter={{ id: "journey", title: "", passages: [...byId("final-days").passages, ...byId("farewell").passages] }} />
        </div>
      </section>

      <section className="section" id="legacy">
        <div className="wrap">
          <SectionHead title={<T k="life.legacy" />} sub={<T k="life.legacyNote" />} />
          <div className="stats">
            <p><strong>{memories.length}</strong> <T k="life.memories" /></p>
            <p><strong>{Math.max(contributors, CONTRIBUTORS.length)}</strong> <T k="life.contributors" /></p>
            <p><strong>3</strong> <span>English · اردو · پښتو</span></p>
          </div>
          <Passages chapter={byId("legacy")} />
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
