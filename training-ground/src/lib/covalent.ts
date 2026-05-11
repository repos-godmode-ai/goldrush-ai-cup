/**
 * GoldRush / Covalent Foundational REST — matches skills in .agents/skills/goldrush-foundational-api
 */
const API_BASE = "https://api.covalenthq.com/v1";

export type CovalentEnvelope<T> = {
  data: T | null;
  error: boolean;
  error_message?: string;
  error_code?: number;
};

export async function covalentFetch<T>(
  path: string,
  apiKey: string
): Promise<CovalentEnvelope<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      /** Never cache per-wallet responses (would leak data across users in prod). */
      cache: "no-store",
    });

    const text = await res.text();
    let json: CovalentEnvelope<T>;
    try {
      json = JSON.parse(text) as CovalentEnvelope<T>;
    } catch {
      return {
        data: null,
        error: true,
        error_message: `Upstream returned non-JSON (HTTP ${res.status}).`,
      };
    }
    return json;
  } catch (e) {
    return {
      data: null,
      error: true,
      error_message:
        e instanceof Error ? e.message : "Network error calling GoldRush API.",
    };
  }
}

/** Sum portfolio holdings across tokens into one time series for charts */
export function aggregatePortfolioSeries(
  items: PortfolioItem[] | null | undefined
): { date: string; value: number }[] {
  if (!items?.length) return [];

  const bucket = new Map<string, number>();

  for (const item of items) {
    const holdings = item.holdings;
    if (!Array.isArray(holdings)) continue;

    for (const h of holdings) {
      const rawT =
        (h as Record<string, unknown>).timestamp ??
        (h as Record<string, unknown>).block_signed_at ??
        (h as Record<string, unknown>).date;
      const t = rawT != null ? String(rawT) : "";
      if (!t) continue;

      const v =
        num((h as Record<string, unknown>).close_quote) ??
        num((h as Record<string, unknown>).high_quote) ??
        num((h as Record<string, unknown>).open_quote) ??
        num((h as Record<string, unknown>).quote) ??
        num((h as Record<string, unknown>).close) ??
        num((h as Record<string, unknown>).close_balance_quote) ??
        0;

      bucket.set(t, (bucket.get(t) ?? 0) + v);
    }
  }

  const sorted = [...bucket.entries()]
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return sorted;
}

/** Flat “season” line from current spot USD so the chart is never empty when balances exist. */
export function spotValuationFallbackSeries(totalUsd: number): {
  date: string;
  value: number;
}[] {
  if (!Number.isFinite(totalUsd) || totalUsd <= 0) return [];
  const now = new Date().toISOString();
  const t2 = new Date(Date.now() + 60_000).toISOString();
  return [
    { date: now, value: totalUsd },
    { date: t2, value: totalUsd },
  ];
}

function num(x: unknown): number | null {
  if (x == null) return null;
  const n = typeof x === "number" ? x : parseFloat(String(x));
  return Number.isFinite(n) ? n : null;
}

export type PortfolioItem = {
  contract_ticker_symbol?: string;
  contract_name?: string;
  holdings?: Record<string, unknown>[];
};

export function isValidEvmAddress(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr.trim());
}
