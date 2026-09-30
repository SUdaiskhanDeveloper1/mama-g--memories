import type { Metadata } from "next";
import { Suspense } from "react";
import { T } from "@/lib/i18n";
import { allMemories, allPhotos } from "@/lib/all";
import { Gallery } from "@/components/Gallery";
import { SectionHead } from "@/components/Sections";
import { Film } from "@/components/Film";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Photographs of Col. (R) Dr. Muhammad Safdar Khan, each connected to the memory and the person who shared it.",
};

export default async function GalleryPage() {
  const [photos, memories] = await Promise.all([allPhotos(), allMemories()]);
  const links = Object.fromEntries(memories.map((m) => [m.slug, { title: m.title, contributor: m.contributor, lang: m.lang }]));
  return (
    <div className="page">
      <div className="wrap">
        <SectionHead title={<T k="gallery.title" />} sub={<T k="gallery.sub" />} />
        <div className="film-card">
          <Film card />
        </div>
        <Suspense fallback={null}>
          <Gallery photos={photos} links={links} />
        </Suspense>
      </div>
    </div>
  );
}
