"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LANG_LABEL, T, useLang, type Key } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

const NAV: { href: string; k: Key }[] = [
  { href: "/life", k: "nav.life" },
  { href: "/memories", k: "nav.memories" },
  { href: "/gallery", k: "nav.gallery" },
  { href: "/poetry", k: "nav.poetry" },
  { href: "/values", k: "nav.values" },
];

function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className="langs" role="group" aria-label="Language">
      {(Object.keys(LANG_LABEL) as Lang[]).map((l) => (
        <button key={l} type="button" lang={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const home = path === "/";
  return (
    <header className={`hdr${solid || !home ? " solid" : ""}${open ? " open" : ""}`}>
      <div className="hdr-in wrap">
        <Link href="/" className="brand" aria-label="Home">
          <img className="brand-logo" src="/logo.png" alt="Mama G" width={56} height={56} />
        </Link>

        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined}>
              <T k={n.k} />
            </Link>
          ))}
        </nav>

        <div className="hdr-tools">
          <LangSwitch />
          <Link href="/tell" className="btn btn-sm btn-gold hdr-cta"><T k="nav.tell" /></Link>
          <button type="button" className="icon-btn burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span /><span />
          </button>
        </div>
      </div>

      <div className="sheet" hidden={!open}>
        <nav aria-label="Mobile">
          <Link href="/" aria-current={path === "/" ? "page" : undefined}><T k="nav.home" /></Link>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined}><T k={n.k} /></Link>
          ))}
          <Link href="/tell" className="btn btn-gold"><T k="nav.tell" /></Link>
        </nav>
        <LangSwitch />
      </div>
    </header>
  );
}
