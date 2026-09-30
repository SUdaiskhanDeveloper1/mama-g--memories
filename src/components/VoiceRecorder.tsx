"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

/** Record / stop / preview / delete / upload. Never autoplays. */
export function VoiceRecorder({ value, onChange }: { value: File | null; onChange: (f: File | null) => void }) {
  const { t } = useLang();
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const [err, setErr] = useState("");
  const mr = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) { setUrl(null); return; }
    const u = URL.createObjectURL(value);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [value]);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); mr.current?.stream.getTracks().forEach((x) => x.stop()); }, []);

  async function start() {
    setErr("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { setErr("Recording is not supported in this browser — please upload an audio file instead."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream);
      chunks.current = [];
      r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((x) => x.stop());
        const type = r.mimeType || "audio/webm";
        const ext = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm";
        onChange(new File([new Blob(chunks.current, { type })], `voice-memory.${ext}`, { type }));
      };
      r.start();
      mr.current = r;
      setRec(true);
      setSecs(0);
      timer.current = setInterval(() => setSecs((s) => { if (s >= 299) stop(); return s + 1; }), 1000);
    } catch {
      setErr("Microphone access was not allowed.");
    }
  }
  function stop() {
    if (timer.current) clearInterval(timer.current);
    mr.current?.state === "recording" && mr.current.stop();
    setRec(false);
  }
  const mm = (n: number) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;

  return (
    <div className="voice">
      <p className="voice-prompt">{t("tell.voice")}</p>
      <div className="row">
        {!rec && !value && <button type="button" className="btn btn-line btn-sm" onClick={start}><i className="dot" /> {t("tell.record")}</button>}
        {rec && <button type="button" className="btn btn-dark btn-sm" onClick={stop}>■ {t("tell.stop")} · {mm(secs)}</button>}
        {value && !rec && <button type="button" className="btn btn-line btn-sm" onClick={() => onChange(null)}>{t("tell.delete")}</button>}
        {!rec && !value && (
          <label className="link-quiet">
            {t("tell.uploadAudio")}
            <input type="file" accept="audio/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); e.currentTarget.value = ""; }} />
          </label>
        )}
      </div>
      {url && <audio controls preload="metadata" src={url} />}
      {err && <p className="form-err" role="alert">{err}</p>}
    </div>
  );
}
