"use client";

import { motion } from "framer-motion";
import { Shield, Shirt, Zap } from "lucide-react";
import { TruthTip } from "./TruthTip";

type SummaryRow = {
  total_count?: number;
  transfer_count?: number;
  earliest_transaction?: { block_signed_at?: string };
  latest_transaction?: { block_signed_at?: string };
};

export function StatsRibbon({
  summary,
  totalValue,
  approvalCount,
  chain,
  address,
  richScout,
  reduceMotion,
}: {
  summary: { items?: SummaryRow[] } | null;
  totalValue: number;
  approvalCount: number;
  chain: string;
  address: string;
  richScout?: boolean;
  reduceMotion?: boolean;
}) {
  const row = summary?.items?.[0];
  const caps = row?.total_count ?? 0;
  const transfers = row?.transfer_count;
  const lastKick =
    row?.latest_transaction?.block_signed_at != null
      ? new Date(row.latest_transaction.block_signed_at).toLocaleDateString()
      : "—";

  const cards = [
    {
      icon: Shirt,
      title: "Squad market value",
      value: `$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      sub: "Sum of USD quote on each balance row from balances_v2.",
      tip: "Sum of the `quote` field across items returned by GET /v1/{chain}/address/{wallet}/balances_v2/?quote-currency=USD&no-spam=true. Same tokens you see in the roster table.",
    },
    {
      icon: Zap,
      title: "Career caps",
      value: caps.toLocaleString(),
      sub: richScout
        ? "Total txs + ERC-20 movement count when rich scout is on."
        : "Total transactions for this wallet on this chain.",
      tip: richScout
        ? "From GET …/transactions_summary/?quote-currency=USD&with-transfer-count=true. `total_count` is transactions; `transfer_count` counts Transfer/Deposit/Withdraw style events (+3 credits vs base summary per GoldRush docs)."
        : "From GET …/transactions_summary/?quote-currency=USD. Uses `items[0].total_count`. Enable Rich scout on the form for `with-transfer-count` (+credits).",
    },
    {
      icon: Shield,
      title: "Contract talks",
      value: approvalCount.toLocaleString(),
      sub: "Rows in the token approvals list for this wallet.",
      tip: "From GET /v1/{chain}/approvals/{wallet}/ — each item is a token with one or more spender contracts. Review spenders in your wallet app; this UI only counts rows.",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
        <span>
          Fixture:{" "}
          <code className="rounded bg-black/40 px-1.5 py-0.5 text-zinc-300">
            {chain}
          </code>
        </span>
        <span className="truncate font-mono text-[11px] text-zinc-400">
          {address}
        </span>
        <span>Last on-ball: {lastKick}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduceMotion ? { duration: 0 } : { delay: 0.05 * i, duration: 0.3 }
            }
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
          >
            <c.icon className="mb-2 size-5 text-amber-400" aria-hidden />
            <p className="flex flex-wrap items-center gap-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <span>{c.title}</span>
              <TruthTip label={c.title} detail={c.tip} />
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-3xl tabular-nums text-white">
              {c.value}
            </p>
            <p className="mt-1 text-xs text-zinc-400">{c.sub}</p>
          </motion.div>
        ))}
      </div>

      {transfers != null ? (
        <p className="text-center text-xs text-zinc-500">
          ERC-20 movement events (transfer window):{" "}
          <strong className="tabular-nums text-zinc-300">
            {transfers.toLocaleString()}
          </strong>
          {!richScout ? (
            <>
              {" "}
              — turn on <strong className="text-zinc-400">Rich scout</strong> before
              kick-off to request this field (+credits).
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
