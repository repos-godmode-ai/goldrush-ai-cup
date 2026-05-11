"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { BalancePlayer } from "@/types/balance";
import {
  deltaPct,
  filterTableTokens,
  formatDeltaPct,
  tokenRowKey,
} from "@/lib/roster";
import { TruthTip } from "./TruthTip";

type SortKey = "quote" | "symbol" | "delta";

export function SquadTable({
  items,
  xiKeys,
}: {
  items: BalancePlayer[] | undefined;
  xiKeys: Set<string>;
}) {
  const rows = useMemo(() => filterTableTokens(items), [items]);
  const [sortKey, setSortKey] = useState<SortKey>("quote");
  const [asc, setAsc] = useState(false);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "symbol") {
        const sa = (a.contract_ticker_symbol ?? "").toLowerCase();
        const sb = (b.contract_ticker_symbol ?? "").toLowerCase();
        cmp = sa.localeCompare(sb);
      } else if (sortKey === "quote") {
        cmp = (a.quote ?? 0) - (b.quote ?? 0);
      } else {
        const da = deltaPct(a.quote ?? 0, a.quote_24h);
        const db = deltaPct(b.quote ?? 0, b.quote_24h);
        const na = da == null ? -Infinity : da;
        const nb = db == null ? -Infinity : db;
        cmp = na - nb;
      }
      return asc ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, asc]);

  const toggle = (key: SortKey) => {
    if (sortKey === key) setAsc((a) => !a);
    else {
      setSortKey(key);
      setAsc(key === "symbol");
    }
  };

  const SortBtn = ({
    k,
    children,
  }: {
    k: SortKey;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={() => toggle(k)}
      className="inline-flex items-center gap-1 rounded px-1 py-0.5 font-semibold text-zinc-300 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
    >
      {children}
      {sortKey === k ? (
        asc ? (
          <ArrowUp className="size-3 text-amber-400" aria-hidden />
        ) : (
          <ArrowDown className="size-3 text-amber-400" aria-hidden />
        )
      ) : null}
    </button>
  );

  if (!rows.length) {
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-400">
        No roster rows from <code className="text-zinc-300">balances_v2</code>{" "}
        (empty or balances error).
      </section>
    );
  }

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white">
            FULL ROSTER
          </h2>
          <p className="text-sm text-zinc-400">
            All non-dust tokens from{" "}
            <code className="rounded bg-black/40 px-1 text-xs">balances_v2</code>
            . Sort columns; “XI” marks the same eleven as the pitch.
          </p>
        </div>
        <TruthTip
          label="Roster table"
          detail="Rows come from GET …/balances_v2/?quote-currency=USD&no-spam=true. USD columns use GoldRush quote fields. 24h Δ is (quote − quote_24h) / quote_24h as a percentage when quote_24h is available — not sporting player form."
        />
      </div>

      <div className="max-h-[min(70vh,520px)] overflow-auto rounded-2xl border border-white/10 bg-black/30 shadow-inner">
        <table className="w-full min-w-[340px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm">
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500">
              <th className="px-3 py-3 font-semibold">XI</th>
              <th className="px-3 py-3 font-semibold">
                <SortBtn k="symbol">Token</SortBtn>
              </th>
              <th className="px-3 py-3 text-right font-semibold">
                <SortBtn k="quote">USD (quote)</SortBtn>
              </th>
              <th className="px-3 py-3 text-right font-semibold">
                <SortBtn k="delta">24h Δ</SortBtn>
              </th>
              <th className="hidden px-3 py-3 font-semibold sm:table-cell">
                Type
              </th>
            </tr>
          </thead>
          <tbody className="tabular-nums text-zinc-200">
            {sorted.map((t) => {
              const key = tokenRowKey(t);
              const inXi = xiKeys.has(key);
              const d = deltaPct(t.quote ?? 0, t.quote_24h);
              const sym = t.contract_ticker_symbol ?? "—";
              return (
                <tr
                  key={key}
                  className="border-b border-white/5 hover:bg-white/[0.04]"
                >
                  <td className="px-3 py-2.5">
                    {inXi ? (
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
                        XI
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {t.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={t.logo_url}
                          alt=""
                          loading="lazy"
                          className="size-7 shrink-0 rounded-full border border-white/15 bg-white/5 object-contain"
                        />
                      ) : null}
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">{sym}</p>
                        <p className="truncate text-[11px] text-zinc-500">
                          {t.contract_name ?? t.contract_address ?? ""}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right text-white">
                    {t.pretty_quote ??
                      `$${(t.quote ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span
                      className={
                        d == null
                          ? "text-zinc-500"
                          : d > 0.5
                            ? "text-emerald-400"
                            : d < -0.5
                              ? "text-red-400"
                              : "text-zinc-300"
                      }
                    >
                      {formatDeltaPct(d)}
                    </span>
                    <span className="sr-only">
                      {d == null
                        ? "24h percent change unavailable"
                        : `versus quote 24 hours ago: ${d.toFixed(2)} percent`}
                    </span>
                  </td>
                  <td className="hidden px-3 py-2.5 text-xs capitalize text-zinc-400 sm:table-cell">
                    {t.native_token ? (
                      <span className="text-amber-200/90">native</span>
                    ) : (
                      t.type ?? "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
