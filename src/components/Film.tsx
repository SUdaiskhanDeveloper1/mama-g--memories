"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

const FILM = { src: "/images/viedo.mp4", poster: "/images/video-poster.webp", duration: 107.67 };

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

const Icon = {
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />,
  pause: <><rect x="6.5" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none" /><rect x="13.9" y="5" width="3.6" height="14" rx="1" fill="currentColor" stroke="none" /></>,
  sound: <><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" /><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.6 7.6 0 0 1 0 11" /></>,
  muted: <><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" /><path d="m16 9.5 5 5m0-5-5 5" /></>,
  full: <path d="M4.5 9V4.5H9M15 4.5h4.5V9M19.5 15v4.5H15M9 19.5H4.5V15" />,
};
const Svg = ({ i }: { i: keyof typeof Icon }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{Icon[i]}</svg>
);

/**
 * The family's portrait film. The file is fetched only once the page itself has finished loading,
 * then plays silently while on screen; viewers can turn the sound on, seek, or go full screen.
 */
export function Film({ card = false }: { card?: boolean }) {
  const { t } = useLang();
  const frame = useRef<HTMLDivElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string>();
  // "auto": silent ambient loop that follows the viewport. "manual": the viewer is in control.
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [length, setLength] = useState(FILM.duration);

  // Start the download in the background after the page load, so it never competes with the page itself.
  useEffect(() => {
    const v = vid.current;
    if (v) v.muted = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) setMode("manual");
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || /2g$/.test(conn?.effectiveType ?? "")) { setMode("manual"); return; }
    const hasIdle = typeof window.requestIdleCallback === "function"; // missing in older Safari
    let idle = 0;
    const start = () => {
      idle = hasIdle ? window.requestIdleCallback(() => setSrc(FILM.src), { timeout: 2500 }) : window.setTimeout(() => setSrc(FILM.src), 300);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (hasIdle) window.cancelIdleCallback(idle); else window.clearTimeout(idle);
    };
  }, []);

  // While ambient, play only when at least 40% of the film is on screen.
  useEffect(() => {
    const v = vid.current, el = frame.current;
    if (!v || !el || !src || mode !== "auto" || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => {
      // Blocked autoplay (e.g. iOS Low Power Mode) falls back to the play button.
      if (e.isIntersecting) v.play().catch((err: DOMException) => { if (err.name === "NotAllowedError") setMode("manual"); });
      else v.pause();
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [src, mode]);

  /** Attach the file synchronously inside a tap, so browsers treat play() as user-initiated. */
  const ensureSrc = (v: HTMLVideoElement) => {
    if (!v.getAttribute("src")) { v.src = FILM.src; setSrc(FILM.src); }
  };

  const togglePlay = () => {
    const v = vid.current; if (!v) return;
    setMode("manual"); ensureSrc(v);
    if (v.paused) v.play().catch(() => {}); else v.pause();
  };

  const toggleSound = () => {
    const v = vid.current; if (!v) return;
    setMode("manual"); ensureSrc(v);
    v.muted = !v.muted;
    if (!v.muted && v.paused) v.play().catch(() => {});
  };

  const watch = () => {
    const v = vid.current; if (!v) return;
    setMode("manual"); ensureSrc(v);
    v.muted = false;
    v.currentTime = 0;
    v.play().catch(() => {});
    const r = frame.current?.getBoundingClientRect();
    if (r && (r.top < 60 || r.bottom > window.innerHeight)) {
      frame.current!.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    }
  };

  const fullscreen = () => {
    const v = vid.current, el = frame.current; if (!v || !el) return;
    setMode("manual"); ensureSrc(v);
    if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); return; }
    v.muted = false;
    v.play().catch(() => {});
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else (v as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen?.(); // iOS Safari
  };

  // A tap on the picture: first tap brings in the sound, later taps play / pause.
  const onSurface = () => (muted && playing ? toggleSound() : togglePlay());

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = vid.current; if (!v) return;
    setMode("manual"); ensureSrc(v);
    v.currentTime = Number(e.target.value);
    setTime(v.currentTime);
  };

  const pct = length ? (time / length) * 100 : 0;

  return (
    <div className="film">
      <div className="film-text">
        <p className="kicker">{t("film.kicker")}</p>
        <h2 className="h2 film-title">{t("film.title")}</h2>
        <p className="film-sub">{t("film.sub")}</p>
        <p className="film-meta"><span>{clock(FILM.duration)}</span><i aria-hidden>·</i><span>{t("film.withSound")}</span></p>
        <div className="row">
          <button type="button" className="btn btn-gold" onClick={watch}>{t("film.watch")}</button>
          {!card && <Link href="/gallery" className="btn btn-line">{t("gallery.title")}</Link>}
        </div>
      </div>

      <div className="film-stage">
        <div ref={frame} className={`film-frame${playing ? " is-playing" : ""}${mode === "manual" ? " is-manual" : ""}`}>
          <video
            ref={vid}
            src={src}
            poster={FILM.poster}
            preload={src ? "auto" : "none"}
            muted
            loop
            playsInline
            aria-label={t("film.title")}
            onClick={onSurface}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onPlaying={() => setWaiting(false)}
            onWaiting={() => setWaiting(true)}
            onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setLength(e.currentTarget.duration)}
          />

          {!playing && (
            <button type="button" className="film-big" onClick={togglePlay} aria-label={t("film.play")}><Svg i="play" /></button>
          )}
          {playing && waiting && <span className="film-spin" aria-hidden />}
          {playing && muted && (
            <button type="button" className="film-pill" onClick={toggleSound}><Svg i="muted" /> {t("film.tapSound")}</button>
          )}

          <div className="film-bar">
            <input
              type="range" className="film-seek" min={0} max={length} step={0.1} value={time} onChange={seek}
              aria-label={t("film.seek")} aria-valuetext={`${clock(time)} / ${clock(length)}`}
              style={{ "--p": `${pct}%` } as React.CSSProperties}
            />
            <div className="film-ctrls">
              <button type="button" className="film-btn" onClick={togglePlay} aria-label={playing ? t("film.pause") : t("film.play")}><Svg i={playing ? "pause" : "play"} /></button>
              <span className="film-time" dir="ltr">{clock(time)} / {clock(length)}</span>
              <button type="button" className="film-btn" onClick={toggleSound} aria-label={muted ? t("film.unmute") : t("film.mute")}><Svg i={muted ? "muted" : "sound"} /></button>
              <button type="button" className="film-btn" onClick={fullscreen} aria-label={t("film.full")}><Svg i="full" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
