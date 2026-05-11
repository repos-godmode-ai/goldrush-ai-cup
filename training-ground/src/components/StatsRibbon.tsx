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

type CardDef = {
  icon: typeof Shirt;
  title: string;
  value: string;
  sub: string;
  tip: string;
};

export function StatsRibbon({
  summary,
  totalValue,
  approvalCount,
  chain,
  address,
  richScout,
  gasScout,
  approvalsError,
  reduceMotion,
  onOpenApprovals,
}: {
  summary: { items?: SummaryRow[] } | null;
  totalValue: number;
  approvalCount: number;
  chain: string;
  address: string;
  richScout?: boolean;
  gasScout?: boolean;
  approvalsError?: boolean;
  reduceMotion?: boolean;
  onOpenApprovals?: () => void;
}) {
  const row = summary?.items?.[0];
  const caps = row?.total_count ?? 0;
  const transfers = row?.transfer_count;
  const lastKick =
    row?.latest_transaction?.block_signed_at != null
      ? new Date(row.latest_transaction.block_signed_at).toLocaleDateString()
      : "—";

  const summaryTipParts = [
    "From GET …/transactions_summary/ with quote-currency=USD.",
    richScout ? "`with-transfer-count=true` (+3 credits)." : null,
    gasScout ? "`with-gas=true` (+1 credit per skill docs)." : null,
    "`items[0].total_count` is career caps.",
    richScout
      ? "`transfer_count` counts ERC-20 movement style events when returned."
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  const cards: CardDef[] = [
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
      sub:
        richScout || gasScout
          ? "Summary with optional rich / gas flags (see ⓘ)."
          : "Total transactions for this wallet on this chain.",
      tip: summaryTipParts,
    },
    {
      icon: Shield,
      title: "Contract talks",
      value: approvalCount.toLocaleString(),
      sub:
        approvalCount > 0 && !approvalsError
          ? "Click this card to review spenders."
          : "Rows in the token approvals list for this wallet.",
      tip: "From GET /v1/{chain}/approvals/{wallet}/ — each item is a token with one or more spender contracts. Review spenders in your wallet app; this UI lists rows.",
    },
  ];

  const motionProps = (i: number) => ({
    initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion
      ? { duration: 0 }
      : { delay: 0.05 * i, duration: 0.3 },
  });

  const canOpenApprovals =
    Boolean(onOpenApprovals) &&
    approvalCount > 0 &&
    !approvalsError;

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
        {cards.map((c, i) => {
          const isApprovals = c.title === "Contract talks";
          const inner = (
            <>
              <c.icon className="mb-2 size-5 text-amber-400" aria-hidden />
              <p className="flex flex-wrap items-center gap-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <span>{c.title}</span>
                <TruthTip label={c.title} detail={c.tip} />
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-3xl tabular-nums text-white">
                {c.value}
              </p>
              <p className="mt-1 text-xs text-zinc-400">{c.sub}</p>
            </>
          );

          if (isApprovals && canOpenApprovals) {
            return (
              <motion.button
                key={c.title}
                type="button"
                {...motionProps(i)}
                onClick={onOpenApprovals}
                className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-left backdrop-blur-sm transition hover:border-amber-400/50 hover:bg-amber-950/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60"
              >
                {inner}
              </motion.button>
            );
          }

          return (
            <motion.div
              key={c.title}
              {...motionProps(i)}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            >
              {inner}
            </motion.div>
          );
        })}
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
