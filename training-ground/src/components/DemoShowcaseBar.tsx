"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Clapperboard } from "lucide-react";

const STEPS = [
  "Set GOLDRUSH_API_KEY (or COVALENT_API_KEY) in training-ground/.env.local.",
  "Use a preset wallet + chain, then Kick off matchday.",
  "Show: stat cards (ⓘ tips) → pitch XI + roster table → chart → Contract talks modal if approvals exist.",
];

export function DemoShowcaseBar() {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-amber-500/25 bg-gradient-to-r from-amber-950/80 via-zinc-900/90 to-amber-950/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-amber-100/95">
          <Clapperboard className="size-4 shrink-0 text-amber-400" aria-hidden />
          <strong className="tracking-tight">Showcase</strong>
          <span className="hidden text-amber-100/80 sm:inline">
            — live GoldRush data. Presets load instantly for your narrative.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-black/30 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-black/50"
          aria-expanded={open}
        >
          Demo script
          {open ? (
            <ChevronUp className="size-3.5" aria-hidden />
          ) : (
            <ChevronDown className="size-3.5" aria-hidden />
          )}
        </button>
      </div>
      {open ? (
        <div className="mx-auto max-w-7xl border-t border-amber-500/15 px-4 pb-4 pt-2">
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-amber-50/90">
            {STEPS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
