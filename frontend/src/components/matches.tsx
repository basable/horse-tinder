import { useEffect, useState } from "react";
import { Heart, MapPin, RefreshCw, Sparkles } from "lucide-react";
import { HorseAvatar } from "@/components/horse-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api, errorMessage } from "@/lib/api";
import { timeAgo } from "@/lib/time";
import type { Match } from "@/types";

export function Matches({ onDiscover }: { onDiscover: () => void }) {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setError(null);
    setMatches(null);
    api.matches().then(setMatches).catch((e: unknown) => setError(errorMessage(e)));
  };
  useEffect(load, []);

  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Your matches</h1>
          <p className="text-sm text-muted-foreground">
            {matches ? `${matches.length} horse${matches.length === 1 ? "" : "s"} nickered back` : "Rounding up your herd…"}
          </p>
        </div>
      </div>

      {error ? (
        <Card className="items-center p-10 text-center">
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={load}>
            <RefreshCw /> Try again
          </Button>
        </Card>
      ) : matches === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <Card className="items-center gap-4 border-dashed px-6 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Heart className="size-6" />
          </span>
          <h2 className="font-display text-2xl font-bold">No matches yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Swipe right on a few horses. When one likes you back, they'll show up here.
          </p>
          <Button onClick={onDiscover}>
            <Sparkles /> Start swiping
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m, i) => (
            <Card
              key={m.id}
              className="gap-0 overflow-hidden py-0 transition-transform hover:-translate-y-1 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 fill-mode-both"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative h-36 bg-pasture">
                <HorseAvatar coat={m.coat} title={m.name} className="absolute inset-x-0 bottom-0 mx-auto h-[95%]" />
                <Badge variant="accent" className="absolute top-3 right-3 bg-card">
                  <Heart className="fill-current" /> {timeAgo(m.matchedAt)}
                </Badge>
              </div>
              <CardContent className="space-y-2 py-5">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-display text-xl font-bold">{m.name}</h3>
                  <span className="text-muted-foreground">{m.age}</span>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  <span className="truncate">
                    {m.breed} · {m.location}
                  </span>
                </p>
                <p className="line-clamp-2 text-sm">{m.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
