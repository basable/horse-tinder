import { coatColor, maneColor } from "@/lib/coats";
import { cn } from "@/lib/utils";
import type { Coat } from "@/types";

const HEAD =
  "M120 30 L131 10 L138 36 C160 48 172 76 170 108 L166 178 L96 178 C100 152 96 134 84 122 C70 128 52 130 40 124 C28 118 26 102 36 92 L78 52 C90 40 104 32 120 30 Z";
const MANE = "M136 34 C162 46 176 78 172 112 L170 178 L184 178 C190 124 186 72 150 36 Z";
const FORELOCK = "M120 30 C108 38 102 48 104 60 C110 50 118 44 128 40 Z";
const EAR = "M125 27 L130 16 L133 33 Z";

export function HorseAvatar({ coat, className, title }: { coat: Coat; className?: string; title?: string }) {
  const body = coatColor(coat);
  const mane = maneColor(coat);
  return (
    <svg viewBox="0 0 200 200" className={cn("block aspect-square", className)} role="img" aria-label={title ?? `${coat} horse`}>
      <path d={MANE} style={{ fill: mane }} />
      <path d={HEAD} style={{ fill: body }} />
      <path d={EAR} style={{ fill: mane }} />
      <path d={FORELOCK} style={{ fill: mane }} />
      <circle cx="102" cy="72" r="5.5" style={{ fill: "var(--coat-shadow)" }} />
      <circle cx="104" cy="70" r="1.6" style={{ fill: "var(--card)" }} />
      <ellipse cx="44" cy="106" rx="4" ry="3" style={{ fill: "var(--coat-shadow)" }} opacity="0.6" />
      <path d="M42 120 C52 124 62 124 70 120" fill="none" strokeWidth="2.5" strokeLinecap="round" style={{ stroke: "var(--coat-shadow)" }} opacity="0.35" />
    </svg>
  );
}
