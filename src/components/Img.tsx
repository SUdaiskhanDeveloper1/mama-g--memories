import type { Photo } from "@/lib/types";

/** Plain <img> with a colour placeholder + explicit size (no layout shift). Files are pre-optimised to WebP. */
export function Img({ photo, alt, sizes = "(max-width:700px) 92vw, 520px", priority = false, className = "", full = false }: {
  photo: Photo; alt?: string; sizes?: string; priority?: boolean; className?: string; full?: boolean;
}) {
  const hasSmall = photo.thumb && photo.thumb !== photo.src;
  return (
    <img
      className={className}
      src={full || !hasSmall ? photo.src : photo.thumb}
      srcSet={hasSmall && !full ? `${photo.thumb} 520w, ${photo.src} ${photo.w}w` : undefined}
      sizes={hasSmall && !full ? sizes : undefined}
      width={photo.w}
      height={photo.h}
      alt={alt ?? photo.alt ?? photo.caption}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      style={{ backgroundColor: photo.color }}
    />
  );
}
