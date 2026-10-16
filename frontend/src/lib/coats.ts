import type { Coat } from "@/types";

export const COATS: { value: Coat; label: string }[] = [
  { value: "bay", label: "Bay" },
  { value: "chestnut", label: "Chestnut" },
  { value: "black", label: "Black" },
  { value: "grey", label: "Grey" },
  { value: "palomino", label: "Palomino" },
  { value: "buckskin", label: "Buckskin" },
  { value: "dun", label: "Dun" },
  { value: "roan", label: "Roan" },
];

export const coatColor = (c: Coat) => `var(--coat-${c})`;
export const maneColor = (c: Coat) => `color-mix(in oklch, var(--coat-${c}) 45%, var(--coat-shadow))`;
