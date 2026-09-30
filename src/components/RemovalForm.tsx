"use client";
import { useState } from "react";
import { hasSupabase, supabase } from "@/lib/supabase";
import { T } from "@/lib/i18n";

export function RemovalForm({ slug, title }: { slug: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!hasSupabase) { setState("error"); return; }
    const f = new FormData(e.currentTarget);
    setState("sending");
    const { error } = await supabase().from("removal_requests").insert({
      memory_slug: slug, memory_title: title, name: String(f.get("name") || ""), contact: String(f.get("contact") || ""), message: String(f.get("message") || ""),
    });
    setState(error ? "error" : "done");
  }

  return (
    <div className="removal">
      <button type="button" className="link-quiet" aria-expanded={open} onClick={() => setOpen(!open)}><T k="story.remove" /></button>
      {open && state !== "done" && (
        <form onSubmit={submit} className="removal-form">
          <input name="name" placeholder="Your name" required autoComplete="name" />
          <input name="contact" placeholder="Email or phone" required autoComplete="email" />
          <textarea name="message" placeholder="What would you like changed or removed?" rows={3} required />
          <button className="btn btn-sm btn-line" disabled={state === "sending"}>{state === "sending" ? "…" : "Send request"}</button>
          {state === "error" && <p className="form-err">Could not send right now. Please contact the family directly.</p>}
        </form>
      )}
      {state === "done" && <p className="form-ok">Thank you. The family will look at your request.</p>}
    </div>
  );
}
