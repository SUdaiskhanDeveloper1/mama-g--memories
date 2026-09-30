import { Fragment, type ReactNode } from "react";

function inline(s: string): ReactNode[] {
  // **bold** and *italic* only — the memoir uses nothing else.
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\n]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const t = m[0];
    out.push(t.startsWith("**") ? <strong key={i++}>{t.slice(2, -2)}</strong> : <em key={i++}>{t.slice(1, -1)}</em>);
    last = m.index + t.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

/** Renders a memory exactly as written; each paragraph picks its own direction so mixed-script text reads correctly. */
export function Prose({ text, form = "prose", lang }: { text: string; form?: "prose" | "poem"; lang: string }) {
  if (form === "poem") return <Poem text={text} lang={lang} />;
  const lines = text.split("\n");
  const nodes: ReactNode[] = [];
  let quote: string[] = [];
  const flush = (k: number) => {
    if (quote.length) {
      nodes.push(<blockquote key={`q${k}`}>{quote.map((q, i) => <p key={i} dir="auto">{inline(q)}</p>)}</blockquote>);
      quote = [];
    }
  };
  lines.forEach((raw, k) => {
    const l = raw.trim();
    if (/^>/.test(l)) {
      const q = l.replace(/^>\s?/, "").trim();
      if (q) quote.push(q);
      return;
    }
    flush(k);
    if (!l) return;
    if (/^-{3,}$/.test(l)) nodes.push(<hr key={k} />);
    else if (/^O$/.test(l)) nodes.push(<p key={k} className="orn" aria-hidden>· · ·</p>);
    else if (/^#{1,4}\s/.test(l)) nodes.push(<h3 key={k} dir="auto">{l.replace(/^#+\s*/, "")}</h3>);
    else nodes.push(<p key={k} dir="auto">{inline(l)}</p>);
  });
  flush(lines.length);
  return <div className="prose" lang={lang}>{nodes.map((n, i) => <Fragment key={i}>{n}</Fragment>)}</div>;
}

export function Poem({ text, lang, className = "" }: { text: string; lang: string; className?: string }) {
  const stanzas = text.split(/\n\s*\n/);
  return (
    <div className={`poem ${className}`} lang={lang}>
      {stanzas.map((s, i) => (
        <p key={i} className="stanza">
          {s.split("\n").map((ln, j) => (
            <span key={j} className="verse" dir="auto">{ln}</span>
          ))}
        </p>
      ))}
    </div>
  );
}
