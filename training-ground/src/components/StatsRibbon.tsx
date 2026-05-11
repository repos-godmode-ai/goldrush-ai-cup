"use client";

import { motion } from "framer-motion";
import { Shield, Shirt, Zap } from "lucide-react";

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
}: {
  summary: { items?: SummaryRow[] } | null;
  totalValue: number;
  approvalCount: number;
  chain: string;
  address: string;
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
      sub: "Sum of USD quotes on roster",
    },
    {
      icon: Zap,
      title: "Career caps",
      value: caps.toLocaleString(),
      sub: "Total txs logged for this wallet",
    },
    {
      icon: Shield,
      title: "Contract talks",
      value: approvalCount.toLocaleString(),
      sub: "Open token approvals (review spenders)",
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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
          >
            <c.icon className="mb-2 size-5 text-amber-400" />
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {c.title}
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-3xl text-white">
              {c.value}
            </p>
            <p className="mt-1 text-xs text-zinc-400">{c.sub}</p>
          </motion.div>
        ))}
      </div>

      {transfers != null ? (
        <p className="text-center text-xs text-zinc-500">
          Transfer window activity (ERC-20 movements):{" "}
          <strong className="text-zinc-300">{transfers}</strong> — enable{" "}
          <code className="rounded bg-black/30 px-1">with-transfer-count</code>{" "}
          on the API for richer scouting (extra credits per skill docs).
        </p>
      ) : null}
    </div>
  );
}
