import Link from "next/link";
import type { Memory } from "@/lib/types";
import { Img } from "./Img";
import { titleLang } from "@/lib/text";

export function Byline({ m, link = false }: { m: Pick<Memory, "contributor" | "relationship" | "date" | "location">; link?: boolean }) {
  const meta = [m.date, m.location].filter(Boolean).join(" · ");
  return (
    <p className="byline">
      <span className="by-name">{link ? <Link href={`/memories?by=${encodeURIComponent(m.contributor)}`}>{m.contributor}</Link> : m.contributor}</span>
      <span className="by-rel">{m.relationship}</span>
      {meta && <span className="by-meta">{meta}</span>}
    </p>
  );
}

export function MemoryCard({ m, size = "md" }: { m: Memory; size?: "md" | "lg" }) {
  const photo = m.photos[0];
  return (
    <article className={`mcard mcard-${size}${photo ? " has-photo" : ""}`}>
      <Link href={`/story/${m.slug}`} className="mcard-link" aria-label={m.title}>
        {photo && (
          <div className="mcard-photo">
            <Img photo={photo} alt="" sizes={size === "lg" ? "(max-width:900px) 92vw, 560px" : "(max-width:700px) 92vw, 360px"} />
          </div>
        )}
        <div className="mcard-body">
          <h3 className="mcard-title" lang={titleLang(m)} dir="auto">{m.title}</h3>
          <p className="mcard-excerpt" lang={m.lang} dir="auto">{m.excerpt}</p>
        </div>
      </Link>
      <div className="mcard-foot">
        <Byline m={m} />
      </div>
    </article>
  );
}
