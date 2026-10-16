import { RefreshCw } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export function Splash({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-hero px-6">
      <div className="flex flex-col items-center gap-5 text-center">
        <Logo className={error ? "" : "motion-safe:animate-pulse"} />
        {error ? (
          <>
            <p className="max-w-xs text-muted-foreground">{error}</p>
            <Button onClick={onRetry}>
              <RefreshCw /> Try again
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Saddling up…</p>
        )}
      </div>
    </div>
  );
}
