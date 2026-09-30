// Verifies every curated excerpt / quote is a verbatim substring of its memory.
import fs from "node:fs";

const src = JSON.parse(fs.readFileSync("src/data/source.json", "utf8"));
const norm = (s) => s.replace(/\s+/g, " ").trim();
const memTs = fs.readFileSync("src/data/memories.ts", "utf8");
const site = fs.readFileSync("src/data/site.ts", "utf8");

const map = {};
for (const m of memTs.matchAll(/idx: (\d+), slug: "([^"]+)"/g)) map[m[2]] = +m[1];

let bad = 0;
let n = 0;
const check = (slug, text) => {
  n++;
  const idx = map[slug];
  if (idx === undefined) { console.log("NO MEMORY", slug); bad++; return; }
  const hay = norm(src.find((r) => r.idx === idx).text);
  const needle = norm(JSON.parse(`"${text}"`));
  if (!hay.includes(needle)) { console.log("NOT VERBATIM", slug, "::", needle.slice(0, 90)); bad++; }
};

for (const m of site.matchAll(/slug: "([^"]+)", text: "((?:[^"\\]|\\.)*)"/g)) check(m[1], m[2]);
for (const m of site.matchAll(/slug: "([^"]+)", quote: "((?:[^"\\]|\\.)*)"/g)) check(m[1], m[2]);
for (const m of site.matchAll(/\{ text: "((?:[^"\\]|\\.)*)", slug: "([^"]+)"/g)) check(m[2], m[1]);
const vals = fs.readFileSync("src/app/values/page.tsx", "utf8");
for (const m of vals.matchAll(/slug: "([^"]+)", pull: "((?:[^"\\]|\\.)*)"/g)) check(m[1], m[2]);
// per-memory quotes in memories.ts
for (const block of memTs.split(/\n  \{\n/).slice(1)) {
  const slug = block.match(/slug: "([^"]+)"/)?.[1];
  const q = block.match(/quote: "((?:[^"\\]|\\.)*)"/)?.[1];
  if (slug && q) check(slug, q);
}
console.log(`checked ${n}, problems ${bad}`);
process.exit(bad ? 1 : 0);
