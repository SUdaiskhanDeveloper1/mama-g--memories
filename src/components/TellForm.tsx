"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/data/site";
import { useLang } from "@/lib/i18n";
import { fmtSize, MB, optimiseImage } from "@/lib/media";
import { hasSupabase, supabase } from "@/lib/supabase";
import { slugify } from "@/lib/db";
import { VoiceRecorder } from "./VoiceRecorder";

interface Pic {
  id: string; file: File; url: string; caption: string; date: string; location: string; people: string;
}

const RELATIONS = ["Son", "Daughter", "Son-in-law", "Daughter-in-law", "Grandson", "Granddaughter", "Nephew", "Niece", "Brother", "Sister", "Family", "Friend", "Colleague", "Student", "Patient", "Neighbour", "Other"];
const GROUP_OF: Record<string, string> = {
  Son: "family", Daughter: "family", "Son-in-law": "family", "Daughter-in-law": "family", Brother: "family", Sister: "family", Family: "family",
  Grandson: "grandchildren", Granddaughter: "grandchildren", Nephew: "nephews", Niece: "nephews",
  Friend: "friends", Neighbour: "friends", Colleague: "colleagues", Student: "students", Patient: "others", Other: "others",
};
const MAX_PICS = 10;

export function TellForm() {
  const { t, lang } = useLang();
  const [pics, setPics] = useState<Pic[]>([]);
  const [voice, setVoice] = useState<File | null>(null);
  const [cats, setCats] = useState<string[]>([]);
  const [drag, setDrag] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "demo" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [progress, setProgress] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const picsRef = useRef<Pic[]>([]);
  picsRef.current = pics;

  useEffect(() => () => picsRef.current.forEach((p) => URL.revokeObjectURL(p.url)), []);

  const addFiles = useCallback((files: FileList | File[]) => {
    const ok: Pic[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > 30 * MB) { setMsg(`${f.name} is larger than 30 MB.`); continue; }
      ok.push({ id: crypto.randomUUID(), file: f, url: URL.createObjectURL(f), caption: "", date: "", location: "", people: "" });
    }
    setPics((p) => [...p, ...ok].slice(0, MAX_PICS));
  }, []);

  const upd = (id: string, patch: Partial<Pic>) => setPics((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const del = (id: string) => setPics((p) => { const g = p.find((x) => x.id === id); if (g) URL.revokeObjectURL(g.url); return p.filter((x) => x.id !== id); });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("website")) return; // honeypot
    setMsg("");
    if (!hasSupabase) { setState("demo"); return; }

    setState("sending");
    try {
      const sb = supabase();
      const id = crypto.randomUUID();
      const put = async (bucket: string, path: string, blob: Blob) => {
        const { error } = await sb.storage.from(bucket).upload(path, blob, { contentType: blob.type || undefined, cacheControl: "31536000", upsert: false });
        if (error) throw error;
        return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
      };

      const photos = [];
      for (let i = 0; i < pics.length; i++) {
        setProgress(`Photo ${i + 1} / ${pics.length}`);
        const p = pics[i];
        const o = await optimiseImage(p.file);
        // 1) untouched original (private), 2) web versions (public)
        await put("originals", `${id}/${i}-${p.file.name.replace(/[^\w.\-]+/g, "_")}`, p.file);
        const src = await put("media", `${id}/${i}.${o.ext}`, o.full);
        const thumb = await put("media", `${id}/${i}-sm.${o.ext}`, o.thumb);
        photos.push({
          id: `${id}-${i}`, src, thumb, w: o.width, h: o.height, caption: p.caption, date: p.date || undefined, location: p.location || undefined,
          people: p.people.split(",").map((s) => s.trim()).filter(Boolean), categories: ["memories"],
        });
      }
      let audio_url: string | null = null;
      if (voice) { setProgress("Voice memory"); audio_url = await put("media", `${id}/voice.${voice.name.split(".").pop() || "webm"}`, voice); }

      setProgress("Saving");
      const title = String(f.get("title") || "").trim();
      const relation = String(f.get("relation") || "Other");
      const { error } = await sb.from("memories").insert({
        id,
        slug: `${slugify(title)}-${id.slice(0, 6)}`,
        title,
        story: String(f.get("story") || "").trim(),
        contributor_name: String(f.get("name") || "").trim(),
        relationship: relation,
        relationship_group: GROUP_OF[relation] ?? "others",
        memory_date: String(f.get("when") || "").trim() || null,
        location: String(f.get("where") || "").trim() || null,
        categories: cats,
        language: String(f.get("language") || lang),
        quote: String(f.get("quote") || "").trim() || null,
        photos,
        audio_url,
        is_private: f.get("private") === "on",
        consent: true,
        status: "pending",
      });
      if (error) throw error;
      setState("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setState("error");
      setMsg(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setProgress("");
    }
  }

  if (state === "done" || state === "demo") {
    return (
      <div className="thanks" role="status">
        <p className="thanks-mark" aria-hidden>❦</p>
        <h2 className="h2">{t("tell.thanks")}</h2>
        {state === "done" && <p className="lede">{t("tell.review")}</p>}
        {state === "demo" && <p className="form-err">Preview mode: the database is not connected yet, so this memory was not saved. Add the Supabase keys to enable real submissions.</p>}
        <div className="row center-row">
          <button type="button" className="btn btn-line" onClick={() => { setState("idle"); setPics([]); setVoice(null); setCats([]); form.current?.reset(); }}>{t("tell.another")}</button>
          <Link href="/memories" className="btn btn-gold">{t("wall.allMemories")}</Link>
        </div>
      </div>
    );
  }

  const busy = state === "sending";
  return (
    <form ref={form} onSubmit={onSubmit} className="tform" noValidate={false}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hp" />

      <div className="fgrid">
        <label className="field"><span>{t("tell.name")} <em>*</em></span>
          <input name="name" required maxLength={120} autoComplete="name" dir="auto" /></label>
        <label className="field"><span>{t("tell.relation")} <em>*</em></span>
          <select name="relation" required defaultValue="">
            <option value="" disabled>—</option>
            {RELATIONS.map((r) => <option key={r}>{r}</option>)}
          </select></label>
      </div>

      <label className="field"><span>{t("tell.memTitle")} <em>*</em></span>
        <input name="title" required maxLength={140} dir="auto" /></label>

      <label className="field"><span>{t("tell.story")} <em>*</em></span>
        <textarea name="story" required minLength={20} rows={10} dir="auto" placeholder={t("tell.prompt")} /></label>

      <div className="fgrid fgrid-3">
        <label className="field"><span>{t("tell.when")}</span><input name="when" maxLength={60} placeholder="e.g. 1992, Summer 2019" /></label>
        <label className="field"><span>{t("tell.where")}</span><input name="where" maxLength={120} dir="auto" /></label>
        <label className="field"><span>{t("tell.language")}</span>
          <select name="language" defaultValue={lang}><option value="en">English</option><option value="ur">اردو</option><option value="ps">پښتو</option></select></label>
      </div>

      <fieldset className="field cats">
        <legend>Themes <small>({t("tell.optional")})</small></legend>
        <div className="filters">
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <button key={k} type="button" className="chip chip-quiet" aria-pressed={cats.includes(k)} onClick={() => setCats((c) => (c.includes(k) ? c.filter((x) => x !== k) : [...c, k]))}>{v}</button>
          ))}
        </div>
      </fieldset>

      <section id="photos" className="block">
        <h2 className="h4">{t("tell.photos")} <small>({t("tell.optional")})</small></h2>
        <p className="hint">{t("tell.photosHint")}</p>
        <div
          className={`drop${drag ? " on" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m21 16-5-5-8 8" /></svg>
          <p>{t("tell.drop")} <label className="link-quiet">{t("tell.browse")}<input type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.currentTarget.value = ""; }} /></label></p>
          <small>JPG, PNG, WebP, HEIC · up to {MAX_PICS} photos · originals are kept at full quality</small>
        </div>
        {pics.length > 0 && (
          <ul className="pics">
            {pics.map((p) => (
              <li key={p.id}>
                <img src={p.url} alt="" />
                <div className="pic-fields">
                  <input value={p.caption} onChange={(e) => upd(p.id, { caption: e.target.value })} placeholder={t("tell.caption")} dir="auto" maxLength={200} aria-label={t("tell.caption")} />
                  <div className="pic-row">
                    <input value={p.date} onChange={(e) => upd(p.id, { date: e.target.value })} placeholder={t("tell.when")} aria-label={t("tell.when")} maxLength={60} />
                    <input value={p.location} onChange={(e) => upd(p.id, { location: e.target.value })} placeholder={t("tell.where")} aria-label={t("tell.where")} dir="auto" maxLength={120} />
                  </div>
                  <input value={p.people} onChange={(e) => upd(p.id, { people: e.target.value })} placeholder={`${t("tell.people")} (a, b, c)`} aria-label={t("tell.people")} dir="auto" />
                  <div className="pic-meta"><span>{fmtSize(p.file.size)}</span><button type="button" className="link-quiet" onClick={() => del(p.id)}>{t("tell.remove")}</button></div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="block">
        <VoiceRecorder value={voice} onChange={setVoice} />
      </section>

      <label className="field"><span>{t("tell.quote")}</span><input name="quote" maxLength={300} dir="auto" /></label>

      {msg && <p className="form-err" role="alert">{msg}</p>}
      <button className="btn btn-gold btn-lg" disabled={busy}>{busy ? `${t("tell.sending")} ${progress}` : t("tell.submit")}</button>
    </form>
  );
}
