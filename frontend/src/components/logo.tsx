import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path d="M7 19v-7a5 5 0 0 1 10 0v7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="7" cy="14" r="0.9" fill="currentColor" opacity="0.6" />
          <circle cx="17" cy="14" r="0.9" fill="currentColor" opacity="0.6" />
        </svg>
      </span>
      <span className={cn("font-display text-xl font-extrabold tracking-tight", compact && "hidden sm:inline")}>
        Horse<span className="text-primary">Tinder</span>
      </span>
    </span>
  );
}
