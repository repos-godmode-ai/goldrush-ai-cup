"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export type ApprovalRow = {
  token_address?: string;
  token_address_label?: string;
  ticker_symbol?: string;
  pretty_value_at_risk_quote?: string;
  value_at_risk_quote?: number;
  spenders?: Array<{
    spender_address?: string;
    spender_address_label?: string;
    close_quote?: number;
    pretty_close_quote?: string;
  }>;
};

export function ApprovalsModal({
  open,
  onClose,
  items,
  chain,
}: {
  open: boolean;
  onClose: () => void;
  items: ApprovalRow[];
  chain: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-[min(96vw,720px)] rounded-2xl border border-white/15 bg-zinc-950 p-0 text-zinc-100 shadow-2xl backdrop:bg-black/70"
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
            CONTRACT TALKS
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            GET /v1/{chain}/approvals/… — spenders can still move approved
            tokens. Revoke in your wallet app.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="max-h-[min(70vh,520px)] overflow-auto px-5 py-4">
        {!items.length ? (
          <p className="text-sm text-zinc-400">No approval rows returned.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((row, idx) => (
              <li
                key={`${row.token_address ?? idx}-${idx}`}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-white">
                    {row.ticker_symbol ?? "?"}{" "}
                    <span className="font-normal text-zinc-400">
                      {row.token_address_label ?? row.token_address}
                    </span>
                  </p>
                  <p className="text-xs tabular-nums text-amber-200/90">
                    At risk:{" "}
                    {row.pretty_value_at_risk_quote ??
                      (row.value_at_risk_quote != null
                        ? `$${row.value_at_risk_quote.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                        : "—")}
                  </p>
                </div>
                <p className="mt-1 font-mono text-[10px] text-zinc-500">
                  {row.token_address}
                </p>
                <div className="mt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Spenders ({row.spenders?.length ?? 0})
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-zinc-300">
                    {(row.spenders ?? []).slice(0, 8).map((s, j) => (
                      <li
                        key={`${String(s.spender_address)}-${j}`}
                        className="flex flex-wrap justify-between gap-2 border-b border-white/5 py-1 font-mono"
                      >
                        <span className="truncate text-[11px]">
                          {s.spender_address_label ?? s.spender_address ?? "—"}
                        </span>
                        <span className="shrink-0 tabular-nums text-zinc-400">
                          {s.pretty_close_quote ??
                            (s.close_quote != null
                              ? `$${s.close_quote.toLocaleString()}`
                              : "")}
                        </span>
                      </li>
                    ))}
                    {(row.spenders?.length ?? 0) > 8 ? (
                      <li className="text-[11px] text-zinc-500">
                        +{(row.spenders?.length ?? 0) - 8} more in API response…
                      </li>
                    ) : null}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </dialog>
  );
}
