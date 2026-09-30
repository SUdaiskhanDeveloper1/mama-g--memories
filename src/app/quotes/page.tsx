import type { Metadata } from "next";
import { T } from "@/lib/i18n";
import { QuoteGrid, SectionHead, CtaBlock } from "@/components/Sections";

export const metadata: Metadata = {
  title: "Words That Remain",
  description: "Genuine words taken directly from the memories shared by family and friends, always with the person who shared them.",
};

export default function Quotes() {
  return (
    <>
      <div className="page">
        <div className="wrap">
          <SectionHead title={<T k="quotes.title" />} sub={<T k="quotes.sub" />} />
          <QuoteGrid />
        </div>
      </div>
      <CtaBlock />
    </>
  );
}
