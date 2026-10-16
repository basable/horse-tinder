import { Heart, MessageCircleHeart, ShieldCheck } from "lucide-react";
import { HorseAvatar } from "@/components/horse-avatar";
import { Logo } from "@/components/logo";
import { ProfileForm } from "@/components/profile-form";
import { Badge } from "@/components/ui/badge";
import type { Horse } from "@/types";

const perks = [
  { icon: Heart, text: "Swipe right on the horses who make your heart gallop." },
  { icon: MessageCircleHeart, text: "Match when they nicker back. Plan the trail ride." },
  { icon: ShieldCheck, text: "No logins, no fuss. Your profile lives on this device." },
];

export function Onboarding({ onCreated }: { onCreated: (h: Horse) => void }) {
  return (
    <div className="min-h-dvh bg-hero">
      <header className="mx-auto flex max-w-6xl items-center px-6 py-6">
        <Logo />
      </header>
      <main className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-4 lg:grid-cols-[1.1fr_1fr] lg:pt-10">
        <section className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 duration-700">
          <Badge>🐴 12 horses waiting in the stable</Badge>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Find your <span className="text-primary">herd</span>. Maybe your forever pasture-mate.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Horse Tinder matches horses by breed, temperament and snack preferences. Make a profile, swipe through the stable,
            and nicker at the ones who nicker back.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="pt-1 text-[0.95rem]">{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 hidden items-end gap-3 sm:flex" aria-hidden="true">
            {(["palomino", "bay", "grey", "black"] as const).map((c, i) => (
              <div
                key={c}
                className="size-20 overflow-hidden rounded-2xl border border-border bg-pasture shadow-card"
                style={{ transform: `rotate(${(i - 1.5) * 5}deg) translateY(${Math.abs(i - 1.5) * 6}px)` }}
              >
                <HorseAvatar coat={c} className="size-full" />
              </div>
            ))}
          </div>
        </section>
        <ProfileForm onCreated={onCreated} />
      </main>
    </div>
  );
}
