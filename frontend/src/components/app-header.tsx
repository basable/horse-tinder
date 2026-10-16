import { Heart, LogOut, Sparkles } from "lucide-react";
import { HorseAvatar } from "@/components/horse-avatar";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import type { Horse } from "@/types";

type View = "discover" | "matches";

interface Props {
  me: Horse;
  view: View;
  onView: (v: View) => void;
  onSignOut: () => void;
}

export function AppHeader({ me, view, onView, onSignOut }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-4">
        <Logo compact />
        <nav aria-label="Main" className="ml-auto flex items-center gap-1 rounded-full bg-secondary p-1">
          <Button
            size="sm"
            variant={view === "discover" ? "default" : "ghost"}
            aria-current={view === "discover" ? "page" : undefined}
            onClick={() => onView("discover")}
          >
            <Sparkles /> Discover
          </Button>
          <Button
            size="sm"
            variant={view === "matches" ? "default" : "ghost"}
            aria-current={view === "matches" ? "page" : undefined}
            onClick={() => onView("matches")}
          >
            <Heart /> Matches
          </Button>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="hidden size-9 overflow-hidden rounded-full bg-pasture ring-2 ring-border sm:block">
            <HorseAvatar coat={me.coat} className="size-full" title={me.name} />
          </span>
          <span className="hidden max-w-28 truncate text-sm font-medium md:inline">{me.name}</span>
          <Button variant="ghost" size="icon" aria-label="Leave the stable" title="Leave the stable" onClick={onSignOut}>
            <LogOut />
          </Button>
        </div>
      </div>
    </header>
  );
}
