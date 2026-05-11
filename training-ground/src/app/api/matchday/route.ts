import { NextRequest, NextResponse } from "next/server";
import {
  aggregatePortfolioSeries,
  covalentFetch,
  isValidEvmAddress,
} from "@/lib/covalent";

const ALLOWED_CHAINS = new Set([
  "base-mainnet",
  "eth-mainnet",
  "matic-mainnet",
  "arbitrum-mainnet",
  "optimism-mainnet",
  "bsc-mainnet",
  "gnosis-mainnet",
]);

export async function GET(req: NextRequest) {
  const key = process.env.GOLDRUSH_API_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error: true,
        error_message:
          "Set GOLDRUSH_API_KEY in training-ground/.env.local (see README).",
      },
      { status: 503 }
    );
  }

  const address = req.nextUrl.searchParams.get("address")?.trim() ?? "";
  const chain = req.nextUrl.searchParams.get("chain")?.trim() ?? "base-mainnet";

  if (!ALLOWED_CHAINS.has(chain)) {
    return NextResponse.json(
      { error: true, error_message: "Unsupported chain for this demo." },
      { status: 400 }
    );
  }

  const looksEns = address.includes(".");
  if (!looksEns && !isValidEvmAddress(address)) {
    return NextResponse.json(
      {
        error: true,
        error_message:
          "Enter a valid 0x… EVM address (or an ENS name like vitalik.eth).",
      },
      { status: 400 }
    );
  }
  if (looksEns && address.length < 3) {
    return NextResponse.json(
      { error: true, error_message: "That name looks too short." },
      { status: 400 }
    );
  }

  const enc = encodeURIComponent(address);

  const [balances, portfolio, summary, approvals] = await Promise.all([
    covalentFetch<unknown>(
      `/${chain}/address/${enc}/balances_v2/?quote-currency=USD&no-spam=true`,
      key
    ),
    covalentFetch<{ items?: unknown[] }>(
      `/${chain}/address/${enc}/portfolio_v2/?quote-currency=USD&days=21`,
      key
    ),
    covalentFetch<{ items?: unknown[] }>(
      `/${chain}/address/${enc}/transactions_summary/?quote-currency=USD`,
      key
    ),
    covalentFetch<{ items?: unknown[] }>(
      `/${chain}/approvals/${enc}/`,
      key
    ),
  ]);

  const errors: string[] = [];
  if (balances.error) errors.push(balances.error_message ?? "balances failed");
  if (portfolio.error) errors.push(portfolio.error_message ?? "portfolio failed");
  if (summary.error) errors.push(summary.error_message ?? "summary failed");
  if (approvals.error) errors.push(approvals.error_message ?? "approvals failed");

  const portfolioItems = (portfolio.data?.items ?? []) as Parameters<
    typeof aggregatePortfolioSeries
  >[0];
  const series = aggregatePortfolioSeries(portfolioItems);

  return NextResponse.json({
    chain,
    address,
    balances: balances.data,
    balances_error: balances.error,
    portfolio_series: series,
    portfolio_raw_error: portfolio.error,
    summary: summary.data,
    summary_error: summary.error,
    approvals: approvals.data,
    approvals_error: approvals.error,
    partial_errors: errors,
  });
}
