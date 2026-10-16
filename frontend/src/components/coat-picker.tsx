import { Button } from "@/components/ui/button";
import { COATS, coatColor } from "@/lib/coats";
import type { Coat } from "@/types";

export function CoatPicker({ value, onChange }: { value: Coat; onChange: (c: Coat) => void }) {
  return (
    <div role="radiogroup" aria-label="Coat color" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {COATS.map((c) => (
        <Button
          key={c.value}
          type="button"
          variant="chip"
          size="chip"
          role="radio"
          aria-checked={value === c.value}
          onClick={() => onChange(c.value)}
        >
          <span className="size-5 shrink-0 rounded-full border border-border" style={{ background: coatColor(c.value) }} />
          {c.label}
        </Button>
      ))}
    </div>
  );
}
