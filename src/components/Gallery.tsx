"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Photo } from "@/lib/types";
import { T, useLang } from "@/lib/i18n";

export const GALLERY_CATEGORIES: Record<string, string> = {
  family: "Family", children: "Children", grandchildren: "Grandchildren", friends: "Friends",
  "medical-life": "Medical Life", "military-life": "Military Life", travels: "Travels", "haji-abad": "Haji Abad",
  events: "Events", personal: "Personal", "final-days": "Final Days", memories: "Memories",
};

type Links = Record<string, { title: string; contributor: string; lang: string }>;

export function Gallery({ photos, links }: { photos: Photo[]; links: Links }) {
  const sp = useSearchParams();
  const { t } = useLang();
  const memory = sp.get("memory");
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState<number | null>(null);

  const list = useMemo(
    () => photos.filter((p) => (cat === "all" || p.categories.includes(cat)) && (!memory || p.memorySlug === memory)),
    [photos, cat, memory],
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    photos.forEach((p) => p.categories.forEach((k) => (c[k] = (c[k] ?? 0) + 1)));
    return c;
  }, [photos]);

  return (
    <div>
      {memory && links[memory] && (
        <p className="wall-note"><span>Photographs from <strong>{links[memory].title}</strong></span><Link className="chip" href="/gallery">{t("wall.clear")} ✕</Link></p>
      )}
      <div className="filters">
        <button type="button" className="chip" aria-pressed={cat === "all"} onClick={() => setCat("all")}>{t("wall.all")} · {photos.length}</button>
        {Object.entries(GALLERY_CATEGORIES).map(([k, v]) => (
          <button key={k} type="button" className={`chip${counts[k] ? "" : " chip-empty"}`} aria-pressed={cat === k} onClick={() => setCat(k)}>
            {v}{counts[k] ? ` · ${counts[k]}` : ""}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty">
          <p><T k="gallery.empty" /></p>
          <Link href="/tell#photos" className="btn btn-gold"><T k="gallery.addPhoto" /></Link>
        </div>
      ) : (
        <div className="masonry">
          {list.map((p, i) => (
            <button key={p.id} type="button" className="tile" onClick={() => setOpen(i)} aria-label={p.alt ?? p.caption}>
              <img src={p.thumb} width={p.w} height={p.h} alt={p.alt ?? p.caption} loading="lazy" decoding="async" style={{ backgroundColor: p.color }}
                srcSet={p.thumb && p.thumb !== p.src ? `${p.thumb} 520w, ${p.src} ${p.w}w` : undefined}
                sizes="(max-width:559px) 92vw, (max-width:759px) 46vw, 380px" />
              {p.caption && <span className="tile-cap">{p.caption}</span>}
            </button>
          ))}
        </div>
      )}

      {open !== null && list[open] && (
        <Lightbox list={list} index={open} setIndex={setOpen} links={links} />
      )}
    </div>
  );
}

function Lightbox({ list, index, setIndex, links }: { list: Photo[]; index: number; setIndex: (n: number | null) => void; links: Links }) {
  const p = list[index];
  const [zoom, setZoom] = useState(false);
  const touch = useRef<number | null>(null);
  const link = p.memorySlug ? links[p.memorySlug] : undefined;

  const go = useCallback((d: number) => { setZoom(false); setIndex((index + d + list.length) % list.length); }, [index, list.length, setIndex]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [go, setIndex]);

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={p.alt ?? p.caption}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touch.current === null || zoom) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}>
      <button type="button" className="lb-x" aria-label="Close" onClick={() => setIndex(null)}>✕</button>
      {list.length > 1 && <>
        <button type="button" className="lb-nav lb-prev" aria-label="Previous" onClick={() => go(-1)}>‹</button>
        <button type="button" className="lb-nav lb-next" aria-label="Next" onClick={() => go(1)}>›</button>
      </>}
      <div className={`lb-stage${zoom ? " zoom" : ""}`} onClick={() => setZoom(!zoom)}>
        <img src={p.src} alt={p.alt ?? p.caption} width={p.w} height={p.h} />
      </div>
      <div className="lb-info">
        {p.caption && <p className="lb-cap">{p.caption}</p>}
        <p className="lb-meta">
          {[p.date, p.location, p.people?.join(", ")].filter(Boolean).join(" · ")}
        </p>
        <div className="lb-actions">
          <button type="button" className="chip" onClick={() => setZoom(!zoom)}>{zoom ? "Zoom out" : "Zoom in"}</button>
          {link && p.memorySlug && <Link href={`/story/${p.memorySlug}`} className="chip chip-gold"><T k="story.behind" /> → <span lang={link.lang}>{link.title}</span> · {link.contributor}</Link>}
        </div>
      </div>
    </div>
  );
}
