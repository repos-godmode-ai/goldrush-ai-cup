import type { BalancePlayer } from "@/types/balance";

/** Stable row id for table / XI matching */
export function tokenRowKey(t: BalancePlayer): string {
  const addr = t.contract_address?.toLowerCase();
  if (addr && addr !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") {
    return addr;
  }
  if (t.native_token) return `native:${t.contract_ticker_symbol ?? "native"}`;
  return `sym:${t.contract_ticker_symbol ?? "?"}:${t.contract_name ?? ""}`;
}

export function pickSquad(items: BalancePlayer[] | undefined): BalancePlayer[] {
  if (!items?.length) return [];
  const usable = items.filter(
    (t) =>
      t.type !== "nft" &&
      t.type !== "dust" &&
      (t.quote ?? 0) > 0 &&
      (t.contract_ticker_symbol || t.native_token)
  );

  const byValue = [...usable].sort(
    (a, b) => (b.quote ?? 0) - (a.quote ?? 0)
  );
  const captain = byValue.find((t) => t.native_token) ?? byValue[0];
  if (!captain) return [];
  const rest = byValue.filter((t) => t !== captain);
  return [captain, ...rest].slice(0, 11);
}

export function squadValuation(items: BalancePlayer[] | undefined): number {
  if (!items?.length) return 0;
  return items.reduce((s, t) => s + (t.quote ?? 0), 0);
}

/** Full roster for the table: everything returned except dust (spam already off at API). */
export function filterTableTokens(
  items: BalancePlayer[] | undefined
): BalancePlayer[] {
  if (!items?.length) return [];
  return items.filter((t) => t.type !== "dust");
}

export function deltaPct(
  quote: number,
  quote24: number | undefined
): number | null {
  if (quote24 == null || !Number.isFinite(quote24)) return null;
  if (Math.abs(quote24) < 1e-9) return null;
  return ((quote - quote24) / quote24) * 100;
}

export function formatDeltaPct(pct: number | null): string {
  if (pct == null || !Number.isFinite(pct)) return "—";
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

export function playerAriaLabel(t: BalancePlayer): string {
  const sym = t.contract_ticker_symbol ?? "token";
  const usd =
    t.pretty_quote ??
    `$${(t.quote ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  const d = deltaPct(t.quote ?? 0, t.quote_24h);
  const delta =
    d == null
      ? "24h change unknown"
      : `24h USD delta about ${d.toFixed(1)} percent versus quote 24 hours ago`;
  return `${sym}, valuation ${usd}, ${delta}`;
}
