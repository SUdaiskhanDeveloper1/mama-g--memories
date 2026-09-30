"use client";
import { useState } from "react";
import { T, useLang } from "@/lib/i18n";

export function ShareBar({ url, title, contributor }: { url: string; title: string; contributor: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useLang();
  const text = `${title} — a memory of Col. (R) Dr. Muhammad Safdar Khan, by ${contributor}`;
  const enc = encodeURIComponent;
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); } catch {
      const i = document.createElement("input"); i.value = url; document.body.appendChild(i); i.select(); document.execCommand("copy"); i.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="share">
      <span className="share-label"><T k="story.share" /></span>
      <button type="button" onClick={copy} className="chip">{copied ? t("story.copied") : t("story.copy")}</button>
      <a className="chip" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${enc(`${text} ${url}`)}`}>WhatsApp</a>
      <a className="chip" target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`}>Facebook</a>
      <a className="chip" target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`}>X</a>
      <a className="chip" href={`mailto:?subject=${enc(title)}&body=${enc(`${text}\n\n${url}`)}`}>Email</a>
    </div>
  );
}
