import { useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { Discover } from "@/components/discover";
import { Matches } from "@/components/matches";
import { MatchDialog } from "@/components/match-dialog";
import { Onboarding } from "@/components/onboarding";
import { Splash } from "@/components/splash";
import { api, ApiError, clearToken, getToken } from "@/lib/api";
import type { Horse } from "@/types";

type View = "discover" | "matches";

export default function App() {
  const [me, setMe] = useState<Horse | null>(null);
  const [booting, setBooting] = useState(() => getToken() !== null);
  const [bootError, setBootError] = useState<string | null>(null);
  const [view, setView] = useState<View>("discover");
  const [match, setMatch] = useState<Horse | null>(null);

  const boot = () => {
    if (!getToken()) return;
    setBooting(true);
    setBootError(null);
    api
      .me()
      .then(setMe)
      .catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 401) clearToken();
        else setBootError(e instanceof Error ? e.message : "Could not reach the stable.");
      })
      .finally(() => setBooting(false));
  };

  useEffect(boot, []);

  if (booting || bootError) return <Splash error={bootError} onRetry={boot} />;
  if (!me) return <Onboarding onCreated={setMe} />;

  const signOut = () => {
    if (!window.confirm(`Leave the stable? ${me.name}'s profile is only saved on this device.`)) return;
    clearToken();
    setMe(null);
    setView("discover");
  };

  return (
    <div className="min-h-dvh bg-dots">
      <AppHeader me={me} view={view} onView={setView} onSignOut={signOut} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        {view === "discover" ? (
          <Discover paused={match !== null} onMatch={setMatch} />
        ) : (
          <Matches onDiscover={() => setView("discover")} />
        )}
      </main>
      <MatchDialog
        me={me}
        horse={match}
        onClose={() => setMatch(null)}
        onViewMatches={() => {
          setMatch(null);
          setView("matches");
        }}
      />
    </div>
  );
}
