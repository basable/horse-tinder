import { useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { HorseAvatar } from "@/components/horse-avatar";
import { Badge } from "@/components/ui/badge";
import type { Horse } from "@/types";

const THRESHOLD = 110;

interface Props {
  horse: Horse;
  depth: number;
  exit: "left" | "right" | null;
  onDecide: (liked: boolean) => void;
}

export function SwipeCard({ horse, depth, exit, onDecide }: Props) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const active = depth === 0;

  const x = exit ? (exit === "right" ? 1 : -1) * 640 : dx;
  const likeOpacity = exit === "right" ? 1 : Math.max(0, Math.min(1, dx / THRESHOLD));
  const nopeOpacity = exit === "left" ? 1 : Math.max(0, Math.min(1, -dx / THRESHOLD));

  const release = () => {
    if (startX.current === null) return;
    startX.current = null;
    setDragging(false);
    if (Math.abs(dx) > THRESHOLD) onDecide(dx > 0);
    else setDx(0);
  };

  return (
    <article
      aria-hidden={!active}
      aria-label={`${horse.name}, ${horse.age}`}
      className="absolute inset-0 touch-none select-none overflow-hidden rounded-3xl border border-border bg-card shadow-card"
      style={{
        zIndex: 10 - depth,
        opacity: exit ? 0 : 1,
        cursor: active ? (dragging ? "grabbing" : "grab") : "default",
        transform: `translate3d(${x}px, ${depth * 14}px, 0) rotate(${active ? x / 18 : 0}deg) scale(${1 - depth * 0.05})`,
        transition: dragging ? "none" : "transform 280ms cubic-bezier(.2,.8,.2,1), opacity 280ms ease",
      }}
      onPointerDown={(e) => {
        if (!active || exit) return;
        startX.current = e.clientX;
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (startX.current !== null) setDx(e.clientX - startX.current);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div className="relative h-[58%] bg-pasture">
        <HorseAvatar coat={horse.coat} title={horse.name} className="absolute inset-x-0 bottom-0 mx-auto h-[94%] drop-shadow-xl" />
        <span
          className="absolute top-6 left-5 -rotate-12 rounded-xl border-4 border-accent px-3 py-1 font-display text-3xl font-extrabold tracking-wider text-accent"
          style={{ opacity: likeOpacity }}
        >
          GIDDY-UP
        </span>
        <span
          className="absolute top-6 right-5 rotate-12 rounded-xl border-4 border-destructive px-3 py-1 font-display text-3xl font-extrabold tracking-wider text-destructive"
          style={{ opacity: nopeOpacity }}
        >
          NEIGH
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-baseline gap-2">
          <h2 className="font-display text-3xl font-bold tracking-tight">{horse.name}</h2>
          <span className="text-xl text-muted-foreground">{horse.age}</span>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">
            {horse.breed} · {horse.location}
          </span>
        </p>
        {horse.bio && <p className="line-clamp-3 text-[0.95rem] leading-relaxed">{horse.bio}</p>}
        <div className="flex flex-wrap gap-1.5">
          {horse.interests.map((i) => (
            <Badge key={i} variant="secondary">
              {i}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}
