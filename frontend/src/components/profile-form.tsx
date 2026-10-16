import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { CoatPicker } from "@/components/coat-picker";
import { Field } from "@/components/field";
import { HorseAvatar } from "@/components/horse-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, errorMessage } from "@/lib/api";
import { validate, splitInterests, type Errors, type Fields } from "@/lib/profile-validation";
import type { Horse } from "@/types";

const initial: Fields = { name: "", breed: "", age: "", location: "", bio: "", interests: "", coat: "bay" };

export function ProfileForm({ onCreated }: { onCreated: (h: Horse) => void }) {
  const [f, setF] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setF((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function submit() {
    const errs = validate(f);
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    setSubmitting(true);
    try {
      const horse = await api.createHorse({
        name: f.name.trim(),
        breed: f.breed.trim(),
        age: Number(f.age),
        coat: f.coat,
        location: f.location.trim(),
        bio: f.bio.trim(),
        interests: splitInterests(f.interests),
      });
      onCreated(horse);
    } catch (e) {
      setErrors({ form: errorMessage(e) });
    } finally {
      setSubmitting(false);
    }
  }

  const text = (key: "name" | "breed" | "age" | "location" | "interests") => ({
    id: key,
    value: f[key],
    onChange: (e: { target: { value: string } }) => update(key, e.target.value),
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  return (
    <Card className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 duration-700">
      <CardHeader className="grid-cols-[1fr_auto] items-center gap-4">
        <div>
          <CardTitle className="text-2xl">Create your horse profile</CardTitle>
          <CardDescription>Takes a minute. Carrots not included.</CardDescription>
        </div>
        <div className="size-16 overflow-hidden rounded-2xl bg-pasture ring-1 ring-border">
          <HorseAvatar coat={f.coat} className="size-full" />
        </div>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
            <Field id="name" label="Name" error={errors.name}>
              <Input placeholder="Buttercup" autoComplete="off" {...text("name")} />
            </Field>
            <Field id="age" label="Age" error={errors.age}>
              <Input type="number" inputMode="numeric" min={1} max={40} placeholder="6" {...text("age")} />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="breed" label="Breed" error={errors.breed}>
              <Input placeholder="Welsh Cob" {...text("breed")} />
            </Field>
            <Field id="location" label="Paddock" error={errors.location}>
              <Input placeholder="Boulder, CO" {...text("location")} />
            </Field>
          </div>
          <Field id="coat" label="Coat">
            <CoatPicker value={f.coat} onChange={(c) => update("coat", c)} />
          </Field>
          <Field id="bio" label="Bio" error={errors.bio} hint={`${f.bio.length}/280`}>
            <Textarea
              id="bio"
              placeholder="Loves sunrise hacks, hates puddles. Will trade apples for scratches."
              value={f.bio}
              onChange={(e) => update("bio", e.target.value)}
              aria-invalid={Boolean(errors.bio)}
            />
          </Field>
          <Field id="interests" label="Interests" error={errors.interests} hint="Comma separated, up to 6">
            <Input placeholder="Trail rides, Apples, Rolling in mud" {...text("interests")} />
          </Field>
          {errors.form && (
            <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errors.form}
            </p>
          )}
          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            {submitting ? "Saddling up…" : "Enter the stable"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
