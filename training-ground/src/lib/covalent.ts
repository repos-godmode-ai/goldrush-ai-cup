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
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    next: { revalidate: 30 },
  });

  const json = (await res.json()) as CovalentEnvelope<T>;
  return json;
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

  return [...bucket.entries()]
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
