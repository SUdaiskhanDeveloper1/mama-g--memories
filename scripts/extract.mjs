// Extracts the supplied memoir HTML into src/data/source.json + optimised images.
// The memoir is the single source of truth: text is copied verbatim (only invisible
// formatting marks are removed, and one obviously scrambled passage is repaired — see FIXES).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC =
  process.argv[2] ||
  "C:/Users/HP/Downloads/Legacy-of-Col-(R)-Dr-Mohammed-Safdar-Khan-Memoir-Book.html";
const html = fs.readFileSync(SRC, "utf8");
const root = path.resolve(import.meta.dirname, "..");

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const toText = (h) =>
  decode(
    h
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[\u200b\u200e\u200f\ufeff]/g, "")
    .split("\n")
    .map((l) => l.replace(/[ \t]+$/g, "").replace(/^[ \t]+/, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

// ---- chapters by position
const chapters = [...html.matchAll(/<section class="chapter"><h2>([\s\S]*?)<\/h2>/g)].map((m) => ({
  pos: m.index,
  name: decode(m[1]),
}));
const chapterAt = (pos) => [...chapters].reverse().find((c) => c.pos < pos)?.name ?? "";

// ---- images (in document order)
const imgs = [...html.matchAll(/data:image\/jpeg;base64,([A-Za-z0-9+/=]+)/g)].map((m) => ({
  pos: m.index,
  buf: Buffer.from(m[1], "base64"),
}));

// ---- records
const recs = [];
for (const m of html.matchAll(/<div class="rec">([\s\S]*?)<\/div>/g)) {
  const body = m[1];
  const title = decode((body.match(/<h3>([\s\S]*?)<\/h3>/) || [])[1] || "").trim();
  const img = body.includes("data:image") ? imgs.findIndex((i) => i.pos > m.index && i.pos < m.index + m[0].length) : -1;
  const paras = [...body.matchAll(/<p(?: class="attr")?>([\s\S]*?)<\/p>/g)];
  const attr = toText(paras[paras.length - 1][1]);
  const text = toText(paras[0][1]);
  recs.push({ idx: recs.length, chapter: chapterAt(m.index), title, img, text, attr });
}

// ---- Quaid Iqbal's second memory exists only inside the chapter draft
const q = html.match(/Regarding A Life Guided by Faith and Service, QUAID IQBAL \(Grandson\) remembers: "([\s\S]*?)" This memory captures/);
if (q) {
  recs.push({
    idx: recs.length,
    chapter: "His Faith & Values",
    title: "A Life Guided by Faith and Service",
    img: -1,
    text: toText(q[1]),
    attr: "— QUAID IQBAL, Grandson",
  });
}

// ---- FIXES: one scrambled passage in Ally Raza Qureshi's memory (two fragments and a letter
// were pasted out of place: "educ|a|tion" / "cele|b|rates"). Restored to the evident original.
for (const r of recs) {
  if (r.title.toLowerCase().startsWith("humility as a fundamental")) {
    const a = "Rahman Baba:\n\ntion.\n\nIn a world that often celeژوندے";
    const b = "an educ\nabrates those";
    if (!r.text.includes(a) || !r.text.includes(b)) throw new Error("Humility fix pattern not found");
    r.text = r.text
      .replace(a, "Rahman Baba:\n\nژوندے")
      .replace(b, "an education. In a world that often celebrates those");
    r.fixed = true;
  }
}

fs.writeFileSync(path.join(root, "src/data/source.json"), JSON.stringify(recs, null, 1));
console.log("records:", recs.length);
recs.forEach((r) => console.log(r.idx, r.chapter, "|", r.title || "(untitled)", "|", r.attr, "| img", r.img, "| chars", r.text.length));

// ---- images
const out = path.join(root, "public/images");
fs.mkdirSync(out, { recursive: true });
const meta = [];
for (let i = 0; i < imgs.length; i++) {
  const s = sharp(imgs[i].buf).rotate();
  const m = await s.metadata();
  const { dominant } = await sharp(imgs[i].buf).stats();
  await s.clone().webp({ quality: 84, effort: 5 }).toFile(path.join(out, `p${i}.webp`));
  await s.clone().resize({ width: 520, withoutEnlargement: true }).webp({ quality: 76, effort: 5 }).toFile(path.join(out, `p${i}-sm.webp`));
  meta.push({ i, w: m.width, h: m.height, color: `rgb(${dominant.r},${dominant.g},${dominant.b})` });
}
fs.writeFileSync(path.join(root, "src/data/images.json"), JSON.stringify(meta, null, 1));

// ---- social preview (1200x630): ivory canvas, portrait at left, title at right
const portrait = await sharp(imgs[0].buf).resize({ height: 630, width: 460, fit: "cover", position: "top" }).toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="740" height="630">
<rect width="740" height="630" fill="#F7F3EA"/>
<text x="56" y="210" font-family="Georgia, serif" font-size="26" fill="#665447" letter-spacing="3">IN LOVING MEMORY OF</text>
<text x="56" y="290" font-family="Georgia, serif" font-size="52" fill="#242321">Col. (R) Dr.</text>
<text x="56" y="352" font-family="Georgia, serif" font-size="52" fill="#242321">Muhammad Safdar Khan</text>
<rect x="56" y="392" width="64" height="3" fill="#B69A63"/>
<text x="56" y="452" font-family="Georgia, serif" font-style="italic" font-size="27" fill="#665447">“His religion was humanity,</text>
<text x="56" y="490" font-family="Georgia, serif" font-style="italic" font-size="27" fill="#665447">kindness his legacy.”</text>
</svg>`;
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#F7F3EA" } })
  .composite([{ input: portrait, left: 0, top: 0 }, { input: Buffer.from(svg), left: 460, top: 0 }])
  .jpeg({ quality: 86 })
  .toFile(path.join(root, "public/og.jpg"));
console.log("images done", meta.length);
