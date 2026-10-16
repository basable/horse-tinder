import { useCallback, useEffect, useState } from "react";
import { Heart, RefreshCw, X } from "lucide-react";
import { EmptyStable } from "@/components/empty-stable";
import { SwipeCard } from "@/components/swipe-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api, errorMessage } from "@/lib/api";
import type { Horse } from "@/types";

type Exit = "left" | "right" | null;

export function Discover({ paused, onMatch }: { paused: boolean; onMatch: (h: Horse) => void }) {
  const [feed, setFeed] = useState<Horse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exit, setExit] = useState<Exit>(null);

  const load = useCallback(async () => {
    setError(null);
    setFeed(null);
    try {
      setFeed(await api.feed());
    } catch (e) {
      setError(errorMessage(e));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const top = feed?.[0];

  const decide = useCallback(
    (liked: boolean) => {
      if (!top || exit) return;
      setExit(liked ? "right" : "left");
      window.setTimeout(async () => {
        setFeed((f) => (f ? f.slice(1) : f));
        setExit(null);
        try {
          const r = await api.swipe(top.id, liked);
          if (r.match && r.horse) onMatch(r.horse);
        } catch (e) {
          setError(errorMessage(e));
        }
      }, 260);
    },
    [top, exit, onMatch],
  );

  useEffect(() => {
    if (paused) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") decide(false);
      else if (e.key === "ArrowRight") decide(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [decide, paused]);

  return (
    <section className="mx-auto flex max-w-sm flex-col items-center">
      <div className="mb-5 w-full">
        <h1 className="font-display text-3xl font-bold tracking-tight">Today's stable</h1>
        <p className="text-sm text-muted-foreground">Drag right to like, left to pass.</p>
      </div>
      <div className="relative h-[min(580px,66vh)] w-full">
        {error ? (
          <div className="grid h-full place-items-center rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <div className="space-y-4">
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => void load()}>
                <RefreshCw /> Try again
              </Button>
            </div>
          </div>
        ) : feed === null ? (
          <div className="h-full overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <Skeleton className="h-[58%] rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ) : feed.length === 0 ? (
          <EmptyStable onRefresh={() => void load()} />
        ) : (
          feed.slice(0, 3).map((h, i) => (
            <SwipeCard key={h.id} horse={h} depth={i} exit={i === 0 ? exit : null} onDecide={decide} />
          ))
        )}
      </div>
      <div className="mt-10 flex items-center gap-6">
        <Button variant="nope" size="swipe" aria-label="Pass" disabled={!top || !!exit} onClick={() => decide(false)}>
          <X strokeWidth={3} />
        </Button>
        <Button variant="like" size="swipe" aria-label="Like" disabled={!top || !!exit} onClick={() => decide(true)}>
          <Heart strokeWidth={2.5} className="fill-current" />
        </Button>
      </div>
      <p className="mt-4 hidden text-xs text-muted-foreground sm:block">Tip: ← and → keys work too.</p>
    </section>
  );
}
