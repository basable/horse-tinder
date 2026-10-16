import type { Coat } from "@/types";

export type Fields = {
  name: string;
  breed: string;
  age: string;
  location: string;
  bio: string;
  interests: string;
  coat: Coat;
};

export type Errors = Partial<Record<keyof Fields | "form", string>>;

export const splitInterests = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export function validate(f: Fields): Errors {
  const e: Errors = {};
  const name = f.name.trim();
  if (!name) e.name = "Every horse needs a name.";
  else if (name.length > 40) e.name = "Keep it under 40 characters.";
  if (!f.breed.trim()) e.breed = "Tell the herd your breed (or 'mystery mix').";
  else if (f.breed.trim().length > 40) e.breed = "Keep it under 40 characters.";
  const age = Number(f.age);
  if (!f.age || !Number.isInteger(age) || age < 1 || age > 40) e.age = "Between 1 and 40.";
  if (!f.location.trim()) e.location = "Where's your paddock?";
  else if (f.location.trim().length > 60) e.location = "Keep it under 60 characters.";
  if (f.bio.length > 280) e.bio = "Bios top out at 280 characters.";
  const interests = splitInterests(f.interests);
  if (interests.length > 6) e.interests = "Pick up to 6 interests.";
  else if (interests.some((i) => i.length > 24)) e.interests = "Each interest must be 24 characters or fewer.";
  return e;
}
