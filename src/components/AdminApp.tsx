"use client";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { hasSupabase, supabase } from "@/lib/supabase";
import { CATEGORIES, GROUPS, IDENTITIES } from "@/data/site";
import { GALLERY_CATEGORIES } from "./Gallery";
import { optimiseImage } from "@/lib/media";
import { slugify, type MemoryRow, type TimelineRow } from "@/lib/db";

type Tab = "pending" | "approved" | "rejected" | "photos" | "timeline" | "requests" | "export";
type PhotoRow = { id: string; src: string; thumb: string | null; caption: string | null; photo_date: string | null; location: string | null; people: string[] | null; categories: string[] | null; memory_slug: string | null; created_at: string };
type Req = { id: string; memory_slug: string; memory_title: string; name: string; contact: string; message: string; resolved: boolean; created_at: string };

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!hasSupabase) { setReady(true); return; }
    const sb = supabase();
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    supabase().from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle().then(({ data }) => setIsAdmin(Boolean(data)));
  }, [session]);

  if (!hasSupabase) return <Notice title="Database not connected">Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>.env.local</code>, run <code>supabase/schema.sql</code>, then reload.</Notice>;
  if (!ready) return <p className="empty">…</p>;
  if (!session) return <Login />;
  if (isAdmin === null) return <p className="empty">…</p>;
  if (!isAdmin) return (
    <Notice title="Signed in, but not a family administrator">
      Your account (<code>{session.user.email}</code>) is not in the <code>admins</code> table yet.
      <div className="row"><button className="btn btn-line btn-sm" onClick={() => supabase().auth.signOut()}>Sign out</button></div>
    </Notice>
  );
  return <Dashboard email={session.user.email ?? ""} />;
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="notice"><h2 className="h4">{title}</h2><div className="notice-body">{children}</div></div>;
}

function Login() {
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form className="tform login" onSubmit={async (e) => {
      e.preventDefault(); setBusy(true); setErr("");
      const f = new FormData(e.currentTarget);
      const { error } = await supabase().auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
      if (error) setErr(error.message);
      setBusy(false);
    }}>
      <label className="field"><span>Email</span><input name="email" type="email" required autoComplete="username" /></label>
      <label className="field"><span>Password</span><input name="password" type="password" required autoComplete="current-password" /></label>
      {err && <p className="form-err" role="alert">{err}</p>}
      <button className="btn btn-dark" disabled={busy}>{busy ? "…" : "Sign in"}</button>
    </form>
  );
}

function Dashboard({ email }: { email: string }) {
  const sb = supabase();
  const [tab, setTab] = useState<Tab>("pending");
  const [mem, setMem] = useState<MemoryRow[]>([]);
  const [photos, setPhotos] = useState<PhotoRow[]>([]);
  const [tl, setTl] = useState<TimelineRow[]>([]);
  const [reqs, setReqs] = useState<Req[]>([]);
  const [flash, setFlash] = useState("");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const [m, p, t, r] = await Promise.all([
      sb.from("memories").select("*").order("created_at", { ascending: false }),
      sb.from("photos").select("*").order("created_at", { ascending: false }),
      sb.from("timeline_events").select("*").order("sort_key"),
      sb.from("removal_requests").select("*").order("created_at", { ascending: false }),
    ]);
    setMem((m.data ?? []) as MemoryRow[]); setPhotos((p.data ?? []) as PhotoRow[]); setTl((t.data ?? []) as TimelineRow[]); setReqs((r.data ?? []) as Req[]);
  }, [sb]);
  useEffect(() => { load(); }, [load]);

  const say = (s: string) => { setFlash(s); setTimeout(() => setFlash(""), 2500); };
  const patch = async (id: string, values: Partial<MemoryRow> & Record<string, unknown>) => {
    const { error } = await sb.from("memories").update(values).eq("id", id);
    say(error ? error.message : "Saved"); load();
  };
  const remove = async (row: MemoryRow) => {
    if (!confirm(`Delete “${row.title}” permanently, including its uploaded files?`)) return;
    for (const bucket of ["media", "originals"]) {
      const { data } = await sb.storage.from(bucket).list(row.id);
      if (data?.length) await sb.storage.from(bucket).remove(data.map((f) => `${row.id}/${f.name}`));
    }
    const { error } = await sb.from("memories").delete().eq("id", row.id);
    say(error ? error.message : "Deleted"); load();
  };

  const counts = { pending: mem.filter((m) => m.status === "pending").length, approved: mem.filter((m) => m.status === "approved").length, rejected: mem.filter((m) => m.status === "rejected").length };
  const tabs: [Tab, string][] = [
    ["pending", `Pending review (${counts.pending})`], ["approved", `Approved (${counts.approved})`], ["rejected", `Rejected (${counts.rejected})`],
    ["photos", `Gallery (${photos.length})`], ["timeline", `Timeline (${tl.length})`], ["requests", `Requests (${reqs.filter((r) => !r.resolved).length})`], ["export", "Export"],
  ];

  return (
    <div className="admin">
      <div className="admin-top">
        <p>Signed in as <strong>{email}</strong></p>
        <div className="row">
          <button className="btn btn-gold btn-sm" onClick={() => setAdding(true)}>+ Add a memory</button>
          <button className="btn btn-line btn-sm" onClick={() => sb.auth.signOut()}>Sign out</button>
        </div>
      </div>
      <div className="filters" role="tablist">
        {tabs.map(([k, v]) => <button key={k} role="tab" aria-selected={tab === k} className="chip" aria-pressed={tab === k} onClick={() => setTab(k)}>{v}</button>)}
      </div>
      {flash && <p className="flash" role="status">{flash}</p>}

      {adding && <AddMemory onClose={() => { setAdding(false); load(); }} />}

      {(tab === "pending" || tab === "approved" || tab === "rejected") && (
        <ul className="alist">
          {mem.filter((m) => m.status === tab).map((m) => <MemoryItem key={m.id} m={m} patch={patch} remove={remove} />)}
          {mem.filter((m) => m.status === tab).length === 0 && <li className="empty">Nothing here.</li>}
        </ul>
      )}
      {tab === "photos" && <PhotosTab rows={photos} reload={load} say={say} memories={mem} />}
      {tab === "timeline" && <TimelineTab rows={tl} reload={load} say={say} />}
      {tab === "requests" && (
        <ul className="alist">
          {reqs.map((r) => (
            <li key={r.id} className="aitem">
              <h3>{r.memory_title} {r.resolved && <small>(resolved)</small>}</h3>
              <p>{r.name} · {r.contact} · {new Date(r.created_at).toLocaleDateString()}</p>
              <p>{r.message}</p>
              <div className="row">
                <a className="btn btn-line btn-sm" href={`/story/${r.memory_slug}`} target="_blank" rel="noreferrer">Open memory</a>
                <button className="btn btn-line btn-sm" onClick={async () => { await sb.from("removal_requests").update({ resolved: !r.resolved }).eq("id", r.id); load(); }}>{r.resolved ? "Reopen" : "Mark resolved"}</button>
              </div>
            </li>
          ))}
          {reqs.length === 0 && <li className="empty">No requests.</li>}
        </ul>
      )}
      {tab === "export" && (
        <div className="notice">
          <h2 className="h4">Export everything</h2>
          <p>Downloads all memories, gallery photos, timeline events and requests as one JSON file — a complete backup of the archive.</p>
          <button className="btn btn-dark" onClick={() => {
            const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), memories: mem, photos, timeline: tl, removalRequests: reqs }, null, 2)], { type: "application/json" });
            const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `safdar-khan-memorial-${new Date().toISOString().slice(0, 10)}.json`; a.click();
          }}>Download JSON</button>
        </div>
      )}
    </div>
  );
}

function Toggle({ list, all, on }: { list: string[]; all: Record<string, string>; on: (v: string[]) => void }) {
  return (
    <div className="filters">
      {Object.entries(all).map(([k, v]) => (
        <button type="button" key={k} className="chip chip-quiet" aria-pressed={list.includes(k)} onClick={() => on(list.includes(k) ? list.filter((x) => x !== k) : [...list, k])}>{v}</button>
      ))}
    </div>
  );
}

function MemoryItem({ m, patch, remove }: { m: MemoryRow; patch: (id: string, v: any) => void; remove: (m: MemoryRow) => void }) {
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(m.status === "pending");
  const [f, setF] = useState({ ...m });
  const set = (k: keyof MemoryRow, v: any) => setF((x) => ({ ...x, [k]: v }));
  return (
    <li className={`aitem s-${m.status}`}>
      <div className="aitem-head">
        <div>
          <h3 dir="auto">{m.title}</h3>
          <p>{m.contributor_name} · {m.relationship} · {[m.memory_date, m.location].filter(Boolean).join(" · ") || "no date"} · {m.language} · {new Date(m.created_at).toLocaleString()}</p>
          <p className="tags">{m.is_private && <b>PRIVATE</b>} {m.featured && <b>FEATURED</b>} {(m.photos?.length ?? 0) > 0 && <b>{m.photos!.length} photo(s)</b>} {m.audio_url && <b>voice</b>} {m.video_url && <b>video</b>}</p>
        </div>
        <button className="link-quiet" onClick={() => setOpen(!open)}>{open ? "Hide" : "Read"}</button>
      </div>
      {open && !edit && (
        <div className="aitem-body">
          <p className="astory" dir="auto">{m.story}</p>
          {m.quote && <blockquote dir="auto">“{m.quote}”</blockquote>}
          <div className="thumbs">{m.photos?.map((p, i) => <a key={i} href={p.src} target="_blank" rel="noreferrer"><img src={p.thumb || p.src} alt={p.caption} /></a>)}</div>
          {m.audio_url && <audio controls preload="none" src={m.audio_url} />}
          {m.video_url && <video controls preload="none" src={m.video_url} className="reader-video" />}
        </div>
      )}
      {edit && (
        <div className="aedit">
          <label className="field"><span>Title</span><input value={f.title} onChange={(e) => set("title", e.target.value)} dir="auto" /></label>
          <div className="fgrid">
            <label className="field"><span>Contributor</span><input value={f.contributor_name} onChange={(e) => set("contributor_name", e.target.value)} /></label>
            <label className="field"><span>Relationship</span><input value={f.relationship} onChange={(e) => set("relationship", e.target.value)} /></label>
          </div>
          <div className="fgrid fgrid-3">
            <label className="field"><span>Date</span><input value={f.memory_date ?? ""} onChange={(e) => set("memory_date", e.target.value)} /></label>
            <label className="field"><span>Location</span><input value={f.location ?? ""} onChange={(e) => set("location", e.target.value)} /></label>
            <label className="field"><span>Language</span><select value={f.language ?? "en"} onChange={(e) => set("language", e.target.value)}><option value="en">English</option><option value="ur">اردو</option><option value="ps">پښتو</option></select></label>
          </div>
          <label className="field"><span>Story</span><textarea rows={10} value={f.story} onChange={(e) => set("story", e.target.value)} dir="auto" /></label>
          <label className="field"><span>English translation (optional — shown as a separate version)</span><textarea rows={5} value={f.translation ?? ""} onChange={(e) => set("translation", e.target.value)} /></label>
          <label className="field"><span>Quote</span><input value={f.quote ?? ""} onChange={(e) => set("quote", e.target.value)} dir="auto" /></label>
          <label className="field"><span>Who is remembering</span>
            <select value={f.relationship_group ?? "others"} onChange={(e) => set("relationship_group", e.target.value)}>{Object.entries(GROUPS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
          <div className="field"><span>Themes</span><Toggle list={f.categories ?? []} all={CATEGORIES} on={(v) => set("categories", v)} /></div>
          <div className="field"><span>Sides of him (identities)</span><Toggle list={f.identities ?? []} all={Object.fromEntries(IDENTITIES.map((i) => [i.key, i.title]))} on={(v) => set("identities", v)} /></div>
          <div className="row">
            <button className="btn btn-gold btn-sm" onClick={() => { patch(m.id, { title: f.title, contributor_name: f.contributor_name, relationship: f.relationship, memory_date: f.memory_date || null, location: f.location || null, language: f.language, story: f.story, translation: f.translation || null, quote: f.quote || null, relationship_group: f.relationship_group, categories: f.categories, identities: f.identities }); setEdit(false); }}>Save changes</button>
            <button className="btn btn-line btn-sm" onClick={() => { setF({ ...m }); setEdit(false); }}>Cancel</button>
          </div>
        </div>
      )}
      <div className="row aactions">
        {m.status !== "approved" && <button className="btn btn-gold btn-sm" onClick={() => patch(m.id, { status: "approved" })}>Approve</button>}
        {m.status !== "rejected" && <button className="btn btn-line btn-sm" onClick={() => patch(m.id, { status: "rejected" })}>Reject</button>}
        {m.status !== "pending" && <button className="btn btn-line btn-sm" onClick={() => patch(m.id, { status: "pending" })}>Back to pending</button>}
        <button className="btn btn-line btn-sm" onClick={() => patch(m.id, { featured: !m.featured })}>{m.featured ? "Unfeature" : "Feature"}</button>
        <button className="btn btn-line btn-sm" onClick={() => patch(m.id, { is_private: !m.is_private })}>{m.is_private ? "Make public-able" : "Mark private"}</button>
        <button className="btn btn-line btn-sm" onClick={() => setEdit(!edit)}>{edit ? "Close editor" : "Edit"}</button>
        <button className="btn btn-sm btn-danger" onClick={() => remove(m)}>Delete</button>
      </div>
    </li>
  );
}

function AddMemory({ onClose }: { onClose: () => void }) {
  const sb = supabase();
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <form className="tform aedit" onSubmit={async (e) => {
      e.preventDefault(); setBusy(true); setErr("");
      try {
        const f = new FormData(e.currentTarget);
        const id = crypto.randomUUID();
        const photos = [];
        for (let i = 0; i < files.length; i++) {
          const o = await optimiseImage(files[i]);
          await sb.storage.from("originals").upload(`${id}/${i}-${files[i].name.replace(/[^\w.\-]+/g, "_")}`, files[i]);
          await sb.storage.from("media").upload(`${id}/${i}.${o.ext}`, o.full, { contentType: o.full.type });
          await sb.storage.from("media").upload(`${id}/${i}-sm.${o.ext}`, o.thumb, { contentType: o.thumb.type });
          photos.push({ id: `${id}-${i}`, src: sb.storage.from("media").getPublicUrl(`${id}/${i}.${o.ext}`).data.publicUrl, thumb: sb.storage.from("media").getPublicUrl(`${id}/${i}-sm.${o.ext}`).data.publicUrl, w: o.width, h: o.height, caption: "", categories: ["memories"] });
        }
        const title = String(f.get("title"));
        const { error } = await sb.from("memories").insert({
          id, slug: `${slugify(title)}-${id.slice(0, 6)}`, title, story: String(f.get("story")), contributor_name: String(f.get("name")), relationship: String(f.get("relationship")),
          relationship_group: String(f.get("group")), memory_date: String(f.get("when")) || null, location: String(f.get("where")) || null, language: String(f.get("language")), photos, consent: true, status: "approved",
        });
        if (error) throw error;
        onClose();
      } catch (x: any) { setErr(x.message ?? "Failed"); setBusy(false); }
    }}>
      <h2 className="h4">Add a memory (published immediately)</h2>
      <div className="fgrid"><label className="field"><span>Contributor</span><input name="name" required /></label><label className="field"><span>Relationship</span><input name="relationship" required /></label></div>
      <label className="field"><span>Title</span><input name="title" required dir="auto" /></label>
      <label className="field"><span>Story</span><textarea name="story" rows={8} required dir="auto" /></label>
      <div className="fgrid fgrid-3">
        <label className="field"><span>Date</span><input name="when" /></label><label className="field"><span>Location</span><input name="where" /></label>
        <label className="field"><span>Language</span><select name="language"><option value="en">English</option><option value="ur">اردو</option><option value="ps">پښتو</option></select></label>
      </div>
      <label className="field"><span>Who is remembering</span><select name="group">{Object.entries(GROUPS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
      <label className="field"><span>Photographs</span><input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} /></label>
      {err && <p className="form-err">{err}</p>}
      <div className="row"><button className="btn btn-gold btn-sm" disabled={busy}>{busy ? "Uploading…" : "Publish"}</button><button type="button" className="btn btn-line btn-sm" onClick={onClose}>Cancel</button></div>
    </form>
  );
}

function PhotosTab({ rows, reload, say, memories }: { rows: PhotoRow[]; reload: () => void; say: (s: string) => void; memories: MemoryRow[] }) {
  const sb = supabase();
  const [busy, setBusy] = useState(false);
  const [cats, setCats] = useState<string[]>(["memories"]);
  return (
    <div>
      <form className="tform aedit" onSubmit={async (e) => {
        e.preventDefault(); setBusy(true);
        try {
          const f = new FormData(e.currentTarget);
          const file = f.get("file") as File;
          const id = crypto.randomUUID();
          const o = await optimiseImage(file);
          await sb.storage.from("originals").upload(`gallery/${id}-${file.name.replace(/[^\w.\-]+/g, "_")}`, file);
          await sb.storage.from("media").upload(`gallery/${id}.${o.ext}`, o.full, { contentType: o.full.type });
          await sb.storage.from("media").upload(`gallery/${id}-sm.${o.ext}`, o.thumb, { contentType: o.thumb.type });
          const url = (p: string) => sb.storage.from("media").getPublicUrl(p).data.publicUrl;
          const { error } = await sb.from("photos").insert({
            id, src: url(`gallery/${id}.${o.ext}`), thumb: url(`gallery/${id}-sm.${o.ext}`), width: o.width, height: o.height,
            caption: String(f.get("caption")), photo_date: String(f.get("date")) || null, location: String(f.get("location")) || null,
            people: String(f.get("people")).split(",").map((s) => s.trim()).filter(Boolean), categories: cats, memory_slug: String(f.get("memory")) || null,
          });
          if (error) throw error;
          say("Photo added"); (e.target as HTMLFormElement).reset(); reload();
        } catch (x: any) { say(x.message); }
        setBusy(false);
      }}>
        <h2 className="h4">Add a gallery photograph</h2>
        <label className="field"><span>Image</span><input type="file" name="file" accept="image/*" required /></label>
        <label className="field"><span>Caption</span><input name="caption" required dir="auto" /></label>
        <div className="fgrid fgrid-3">
          <label className="field"><span>Date</span><input name="date" /></label><label className="field"><span>Location</span><input name="location" /></label><label className="field"><span>People (comma-separated)</span><input name="people" /></label>
        </div>
        <label className="field"><span>Connected memory (optional)</span>
          <select name="memory" defaultValue=""><option value="">— none —</option>{memories.filter((m) => m.status === "approved").map((m) => <option key={m.id} value={m.slug}>{m.title} — {m.contributor_name}</option>)}</select></label>
        <div className="field"><span>Categories</span><Toggle list={cats} all={GALLERY_CATEGORIES} on={setCats} /></div>
        <button className="btn btn-gold btn-sm" disabled={busy}>{busy ? "Uploading…" : "Add photo"}</button>
      </form>
      <ul className="agrid">
        {rows.map((p) => (
          <li key={p.id}>
            <img src={p.thumb || p.src} alt={p.caption ?? ""} />
            <p>{p.caption}</p><small>{(p.categories ?? []).join(", ")}</small>
            <button className="link-quiet" onClick={async () => { if (confirm("Delete this photo?")) { await sb.from("photos").delete().eq("id", p.id); reload(); } }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TimelineTab({ rows, reload, say }: { rows: TimelineRow[]; reload: () => void; say: (s: string) => void }) {
  const sb = supabase();
  return (
    <div>
      <form className="tform aedit" onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const { error } = await sb.from("timeline_events").insert({
          date_label: String(f.get("label")), sort_key: Number(f.get("sort")), title: String(f.get("title")), body: String(f.get("body")) || null, memory_slug: String(f.get("slug")) || null, kind: String(f.get("kind")),
        });
        say(error ? error.message : "Event added"); if (!error) (e.target as HTMLFormElement).reset(); reload();
      }}>
        <h2 className="h4">Add a timeline event</h2>
        <p className="hint">Use only dates you can source. For a date that belongs to a memory, choose “A memory from…” so it is never shown as an event in his life.</p>
        <div className="fgrid fgrid-3">
          <label className="field"><span>Date as shown</span><input name="label" required placeholder="e.g. 2019" /></label>
          <label className="field"><span>Sort key (year, e.g. 2019.5)</span><input name="sort" type="number" step="0.01" required /></label>
          <label className="field"><span>Type</span><select name="kind"><option value="memory">A memory from…</option><option value="life">Life event</option></select></label>
        </div>
        <label className="field"><span>Title</span><input name="title" required dir="auto" /></label>
        <label className="field"><span>Description</span><textarea name="body" rows={3} dir="auto" /></label>
        <label className="field"><span>Linked memory slug (optional)</span><input name="slug" /></label>
        <button className="btn btn-gold btn-sm">Add event</button>
      </form>
      <ul className="alist">
        {rows.map((r) => (
          <li key={r.id} className="aitem"><h3>{r.date_label} — {r.title}</h3><p>{r.body}</p>
            <button className="link-quiet" onClick={async () => { await sb.from("timeline_events").delete().eq("id", r.id); reload(); }}>Delete</button></li>
        ))}
        {rows.length === 0 && <li className="empty">No custom events yet. The supplied dates are built in.</li>}
      </ul>
    </div>
  );
}
