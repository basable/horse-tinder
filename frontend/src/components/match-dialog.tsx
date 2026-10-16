import { Heart } from "lucide-react";
import { HorseAvatar } from "@/components/horse-avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import type { Horse } from "@/types";

interface Props {
  me: Horse;
  horse: Horse | null;
  onClose: () => void;
  onViewMatches: () => void;
}

export function MatchDialog({ me, horse, onClose, onViewMatches }: Props) {
  return (
    <Dialog open={horse !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <div className="bg-pasture px-6 pt-10 pb-8 text-center">
          <div className="relative mx-auto flex w-fit items-center justify-center">
            <div className="size-28 -rotate-6 overflow-hidden rounded-full border-4 border-card bg-secondary shadow-card">
              <HorseAvatar coat={me.coat} className="size-full" title={me.name} />
            </div>
            <div className="-ml-6 size-28 rotate-6 overflow-hidden rounded-full border-4 border-card bg-secondary shadow-card">
              {horse && <HorseAvatar coat={horse.coat} className="size-full -scale-x-100" title={horse.name} />}
            </div>
            <span className="absolute -bottom-3 left-1/2 grid size-11 -translate-x-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow motion-safe:animate-in motion-safe:zoom-in-50 duration-500">
              <Heart className="size-5 fill-current" />
            </span>
          </div>
          <DialogTitle className="mt-8 text-4xl tracking-tight">It's a match!</DialogTitle>
          <DialogDescription className="mx-auto mt-3 max-w-xs text-base">
            You and {horse?.name} both swiped right. Time to share a hay bale.
          </DialogDescription>
        </div>
        <DialogFooter className="p-6">
          <Button variant="outline" onClick={onClose}>
            Keep swiping
          </Button>
          <Button onClick={onViewMatches}>
            <Heart /> See matches
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
