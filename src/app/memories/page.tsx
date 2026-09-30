import type { Metadata } from "next";
import { Suspense } from "react";
import { T } from "@/lib/i18n";
import { allMemories } from "@/lib/all";
import { MemoryWall } from "@/components/MemoryWall";
import { Reflection, SectionHead } from "@/components/Sections";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Memory Wall",
  description: "Every approved memory of Col. (R) Dr. Muhammad Safdar Khan, in the words of the person who wrote it.",
};

export default async function Memories() {
  const memories = await allMemories();
  return (
    <div className="page">
      <div className="wrap">
        <div className="wall-head">
          <SectionHead title={<T k="wall.title" />} sub={<T k="wall.sub" />} />
          <Reflection size="sm" sizes="(max-width:900px) 70vw, 300px" />
        </div>
        <Suspense fallback={null}>
          <MemoryWall memories={memories} />
        </Suspense>
      </div>
    </div>
  );
}
