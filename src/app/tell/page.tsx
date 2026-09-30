import type { Metadata } from "next";
import { T } from "@/lib/i18n";
import { TellForm } from "@/components/TellForm";

export const metadata: Metadata = {
  title: "Tell His Story — Share a Memory",
  description: "Share a memory, a photograph or a voice message for the memorial of Col. (R) Dr. Muhammad Safdar Khan. Every submission is reviewed by the family before it is published.",
};

export default function Tell() {
  return (
    <div className="page tell">
      <div className="wrap tell-in">
        <header className="tell-head">
          <p className="kicker"><T k="hero.shareKicker" /></p>
          <h1 className="h1"><T k="tell.title" /></h1>
          <p className="lede"><T k="tell.intro" /></p>
          <p className="tell-prompt"><T k="tell.prompt" /></p>
        </header>
        <TellForm />
      </div>
    </div>
  );
}
