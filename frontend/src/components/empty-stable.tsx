import { RefreshCw } from "lucide-react";
import { HorseAvatar } from "@/components/horse-avatar";
import { Button } from "@/components/ui/button";

export function EmptyStable({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="grid h-full place-items-center rounded-3xl border border-dashed border-border bg-card/70 p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-24 overflow-hidden rounded-full bg-pasture opacity-80">
          <HorseAvatar coat="dun" className="size-full" />
        </div>
        <h2 className="font-display text-2xl font-bold">You've met the whole stable</h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          New horses trot in all the time. Check back soon, or see who's already nickering at you.
        </p>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw /> Check for new horses
        </Button>
      </div>
    </div>
  );
}
