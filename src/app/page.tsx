import Link from "next/link";
import { T } from "@/lib/i18n";
import { SITE } from "@/data/site";
import { PHOTOS } from "@/data/photos";
import { FEATURED } from "@/data/memories";
import { allMemories } from "@/lib/all";
import { Img } from "@/components/Img";
import { Reveal } from "@/components/Reveal";
import { Byline } from "@/components/MemoryCard";
import { ContributorGrid, CtaBlock, Featured, FinalBlock, LessonCards, QuoteGrid, Reflection, SectionHead, SidesGrid } from "@/components/Sections";

export const revalidate = 60;

export default async function Home() {
  const memories = await allMemories();
  const portrait = PHOTOS[0];

  return (
    <>
      <section className="hero">
        <div className="wrap hero-in">
          <div className="hero-text">
            <p className="kicker"><T k="hero.kicker" /></p>
            <h1 className="hero-name"><T k="hero.name" /></h1>
            <blockquote className="hero-tag"><T k="hero.tagline" /></blockquote>
            <p className="hero-dates"><T k="hero.dates" /></p>
            <p className="hero-rem"><T k="hero.remembered" /></p>
            <div className="row hero-cta">
              <Link href="/life" className="btn btn-dark"><T k="hero.explore" /></Link>
              <Link href="/tell" className="btn btn-gold">
                <span className="btn-k"><T k="hero.shareKicker" /></span>
                <T k="hero.share" />
              </Link>
            </div>
            <p className="hero-aka">
              {SITE.aka.map((a, i) => <span key={a}>{a}{i < SITE.aka.length - 1 && <i aria-hidden> · </i>}</span>)}
            </p>
          </div>
          <div className="hero-art">
            <div className="arch">
              <Img photo={portrait} alt="Portrait of Col. (R) Dr. Muhammad Safdar Khan" priority full sizes="(max-width:900px) 80vw, 460px" />
            </div>
            <span className="arch-ring" aria-hidden />
          </div>
        </div>
      </section>

      <section className="section who">
        <div className="wrap">
          <Reveal>
            <p className="who-q" lang="en">
              “Such was his warmth and fatherly affection that everyone—family members, acquaintances, and even household staff—called him Mamajee.”
            </p>
            <Byline m={{ contributor: "Mumtaz Ali Khan", relationship: "Nephew" }} />
          </Reveal>
        </div>
      </section>

      <section className="section reflect-sec" id="reflection">
        <div className="wrap">
          <Reveal><Reflection /></Reveal>
        </div>
      </section>

      <section className="section" id="stories">
        <div className="wrap">
          <SectionHead n="01" title={<T k="featured.title" />} />
          <Featured items={FEATURED.slice(0, 6)} />
          <div className="center"><Link href="/memories" className="btn btn-line"><T k="wall.allMemories" /></Link></div>
        </div>
      </section>

      <section className="section tint" id="sides">
        <div className="wrap">
          <SectionHead n="02" title={<T k="sides.title" />} sub={<T k="sides.sub" />} />
          <SidesGrid memories={memories} />
        </div>
      </section>

      <section className="section bachay" aria-labelledby="bachay-h">
        <div className="wrap bachay-in">
          <Reveal className="bachay-word">
            <p className="kicker"><T k="bachay.kicker" /></p>
            <p className="bachay-big" id="bachay-h">Bachay<span>.</span></p>
          </Reveal>
          <Reveal className="bachay-copy" delay={120}>
            <p lang="en">
              “Translating literally to &quot;my child&quot; or &quot;son,&quot; the word itself is common enough. But when spoken by Mama Ji, it carried a weight of genuine warmth, care, and paternal wisdom that was utterly disarming.”
            </p>
            <Byline m={{ contributor: "Habib", relationship: "Nephew", date: "July 2026", location: "Karachi" }} />
            <Link href="/story/the-magic-word-bachay" className="link-arrow">Read “The Magic Word”</Link>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead n="03" title={<T k="eyes.title" />} sub={<T k="eyes.sub" />} />
          <ContributorGrid memories={memories} />
        </div>
      </section>

      <section className="section tint" id="lessons">
        <div className="wrap">
          <SectionHead n="04" title={<T k="lessons.title" />} />
          <LessonCards limit={4} />
          <div className="center"><Link href="/values#lessons" className="btn btn-line"><T k="lessons.title" /></Link></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead n="05" title={<T k="quotes.title" />} sub={<T k="quotes.sub" />} />
          <QuoteGrid limit={6} />
          <div className="center"><Link href="/quotes" className="btn btn-line"><T k="quotes.title" /></Link></div>
        </div>
      </section>

      <CtaBlock />
      <FinalBlock />
    </>
  );
}
