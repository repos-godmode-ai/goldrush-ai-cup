"use client";

import { Info } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type TruthTipProps = {
  /** Short name for the icon button (`aria-label`). */
  label: string;
  /** Exact GoldRush / UX explanation (shown in popover). */
  detail: string;
};

/**
 * Accessible “truth layer” — keyboard + screen-reader friendly; no tooltip library.
 */
export function TruthTip({ label, detail }: TruthTipProps) {
  const baseId = useId();
  const tipId = `${baseId}-detail`;
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        panelRef.current?.contains(t) ||
        btnRef.current?.contains(t)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <span className="relative inline-flex align-middle">
      <button
        ref={btnRef}
        type="button"
        aria-expanded={open}
        aria-controls={tipId}
        aria-label={`${label}: data source details`}
        onClick={() => setOpen((o) => !o)}
        className="ml-1 inline-flex rounded p-0.5 text-zinc-500 transition hover:bg-white/10 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
      >
        <Info className="size-3.5 shrink-0" aria-hidden />
      </button>
      {open ? (
        <div
          ref={panelRef}
          id={tipId}
          role="region"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-max max-w-[min(92vw,300px)] rounded-lg border border-white/15 bg-zinc-950/98 px-3 py-2 text-left text-[11px] leading-snug text-zinc-200 shadow-2xl ring-1 ring-white/10"
        >
          {detail}
        </div>
      ) : null}
    </span>
  );
}
