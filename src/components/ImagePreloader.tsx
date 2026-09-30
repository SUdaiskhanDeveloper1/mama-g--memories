"use client";
import { useEffect } from "react";

/** Slot size of gallery tiles and memory cards — the browser picks the same srcset candidate the pages will. */
export const TILE_SIZES = "(max-width:559px) 92vw, (max-width:759px) 46vw, 380px";

export type PreloadImage = { src: string; thumb: string; w: number };
type Job = { src: string } | { srcset: string; sizes: string };

const CONCURRENCY = 3;
// Module scope: runs once per page load (layouts persist across client-side navigation), and the
// Image objects stay referenced so the files remain in this document's memory cache.
let started = false;
const held: HTMLImageElement[] = [];

function saveData() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c?.saveData || /(^|-)2g$/.test(c?.effectiveType ?? "") || matchMedia("(prefers-reduced-data: reduce)").matches;
}

function start(images: PreloadImage[]) {
  if (started || saveData()) return;
  started = true;

  const done = () => new Set(performance.getEntriesByType("resource").map((e) => new URL(e.name).pathname));
  // Grid-sized files first (Memory Wall, home, gallery), then full size (stories, lightbox). On
  // high-density screens the grid job resolves to the full file, so the browser fetches it only once.
  const queue: (() => Job | null)[] = [
    ...images.map((p) => () =>
      p.thumb && p.thumb !== p.src && !done().has(p.thumb) ? { srcset: `${p.thumb} 520w, ${p.src} ${p.w}w`, sizes: TILE_SIZES } : null),
    ...images.map((p) => () => (done().has(p.src) ? null : { src: p.src })),
  ];

  const next = () => {
    while (queue.length) {
      const job = queue.shift()!();
      if (!job) continue;
      const img = new Image();
      img.decoding = "async";
      img.fetchPriority = "low";
      img.onload = img.onerror = next;
      if ("srcset" in job) { img.sizes = job.sizes; img.srcset = job.srcset; } else img.src = job.src;
      held.push(img);
      return;
    }
  };
  const run = () => { for (let k = 0; k < CONCURRENCY; k++) next(); };
  // Wait for the page's own resources, then for idle time, so the first render is never delayed.
  const idle = () => ("requestIdleCallback" in window ? requestIdleCallback(run, { timeout: 2000 }) : setTimeout(run, 300));
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

/**
 * Warms the cache with the site's photographs after the current page has loaded, so other pages and
 * the lightbox show them instantly. Low priority, a few at a time, skipping anything already fetched,
 * and off entirely when the visitor has Data Saver on or a 2G connection.
 */
export function ImagePreloader({ images }: { images: PreloadImage[] }) {
  useEffect(() => start(images), [images]);
  return null;
}
