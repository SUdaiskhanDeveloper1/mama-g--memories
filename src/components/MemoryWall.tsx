"use client";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Memory } from "@/lib/types";
import { CATEGORIES, GROUPS, IDENTITIES } from "@/data/site";
import { T, useLang } from "@/lib/i18n";
import { MemoryCard } from "./MemoryCard";

const PAGE = 9;

export function MemoryWall({ memories }: { memories: Memory[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const { t } = useLang();
  const [group, setGroup] = useState(sp.get("group") ?? "all");
  const [theme, setTheme] = useState(sp.get("theme") ?? "all");
  const [shown, setShown] = useState(PAGE);
  const identity = sp.get("side");
  const by = sp.get("by");
  const idTitle = IDENTITIES.find((i) => i.key === identity)?.title;

  const list = useMemo(
    () =>
      memories.filter(
        (m) =>
          (group === "all" || m.groups.includes(group)) &&
          (theme === "all" || m.categories.includes(theme)) &&
          (!identity || m.identities.includes(identity)) &&
          (!by || m.contributor === by),
      ),
    [memories, group, theme, identity, by],
  );

  const reset = (fn: () => void) => { fn(); setShown(PAGE); };
  const active = identity || by;

  return (
    <div className="wall">
      {active && (
        <div className="wall-note">
          <span><T k="wall.side" /> <strong>{idTitle ?? by}</strong></span>
          <button type="button" className="chip" onClick={() => router.push("/memories")}><T k="wall.clear" /> ✕</button>
        </div>
      )}

      <div className="filters" role="group" aria-label={t("wall.byWho")}>
        {["all", ...Object.keys(GROUPS)].map((g) => (
          <button key={g} type="button" className="chip" aria-pressed={group === g} onClick={() => reset(() => setGroup(g))}>
            {g === "all" ? t("wall.all") : GROUPS[g]}
          </button>
        ))}
      </div>
      <div className="filters filters-theme" role="group" aria-label={t("wall.byTheme")}>
        <button type="button" className="chip chip-quiet" aria-pressed={theme === "all"} onClick={() => reset(() => setTheme("all"))}>{t("wall.allMemories")}</button>
        {Object.entries(CATEGORIES).map(([k, v]) => (
          <button key={k} type="button" className="chip chip-quiet" aria-pressed={theme === k} onClick={() => reset(() => setTheme(k))}>{v}</button>
        ))}
      </div>

      <p className="wall-count" aria-live="polite">{list.length} <T k="life.memories" /></p>

      {list.length === 0 ? (
        <p className="empty"><T k="wall.none" /></p>
      ) : (
        <div className="grid-cards">
          {list.slice(0, shown).map((m) => <MemoryCard key={m.id} m={m} />)}
        </div>
      )}

      {shown < list.length && (
        <div className="center">
          <button type="button" className="btn btn-line" onClick={() => setShown(shown + PAGE)}><T k="wall.more" /></button>
        </div>
      )}
    </div>
  );
}
