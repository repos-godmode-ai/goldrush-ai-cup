"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Trophy, AlertTriangle, Sparkles } from "lucide-react";
import { PitchSquad } from "./PitchSquad";
import { MomentumChart } from "./MomentumChart";
import { StatsRibbon } from "./StatsRibbon";

export type BalancePlayer = {
  contract_ticker_symbol?: string;
  contract_name?: string;
  contract_address?: string;
  logo_url?: string;
  quote?: number;
  quote_24h?: number;
  pretty_quote?: string;
  type?: string;
  native_token?: boolean;
};

type MatchdayPayload = {
  chain: string;
  address: string;
  balances: { items?: BalancePlayer[] } | null;
  balances_error?: boolean;
  portfolio_series: { date: string; value: number }[];
  portfolio_raw_error?: boolean;
  summary: { items?: Record<string, unknown>[] } | null;
  summary_error?: boolean;
  approvals: { items?: unknown[] } | null;
  approvals_error?: boolean;
  partial_errors: string[];
};

const CHAINS = [
  { id: "base-mainnet", label: "Base (Foundational)" },
  { id: "eth-mainnet", label: "Ethereum" },
  { id: "matic-mainnet", label: "Polygon" },
  { id: "arbitrum-mainnet", label: "Arbitrum" },
  { id: "optimism-mainnet", label: "Optimism" },
  { id: "bsc-mainnet", label: "BNB Chain" },
  { id: "gnosis-mainnet", label: "Gnosis" },
];

function pickSquad(items: BalancePlayer[] | undefined): BalancePlayer[] {
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

function squadValuation(items: BalancePlayer[] | undefined): number {
  if (!items?.length) return 0;
  return items.reduce((s, t) => s + (t.quote ?? 0), 0);
}

export function MatchdayApp() {
  const [chain, setChain] = useState("base-mainnet");
  const [address, setAddress] = useState(
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MatchdayPayload | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setClientError(null);
    try {
      const res = await fetch(
        `/api/matchday?chain=${encodeURIComponent(chain)}&address=${encodeURIComponent(address.trim())}`
      );
      const json = (await res.json()) as MatchdayPayload & {
        error?: boolean;
        error_message?: string;
      };
      if (!res.ok) {
        setClientError(json.error_message ?? "Request failed");
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setClientError("Network error — try again.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [chain, address]);

  const squad = useMemo(
    () => pickSquad(data?.balances?.items),
    [data?.balances?.items]
  );

  const totalValue = useMemo(
    () => squadValuation(data?.balances?.items),
    [data?.balances?.items]
  );

  const approvalCount = data?.approvals?.items?.length ?? 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-16">
      {/* Stadium lights */}
      <div
        className="pointer-events-none fixed inset-0 flood-beam"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 15% 0%, rgba(255,220,120,0.15), transparent 55%), radial-gradient(ellipse 50% 35% at 85% 0%, rgba(255,220,120,0.12), transparent 50%)",
        }}
      />

      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-amber-300/90">
              <Trophy className="size-3.5" />
              GoldRush Foundational · demo
            </p>
            <h1
              className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-white sm:text-6xl"
              style={{ textShadow: "0 4px 24px rgba(0,0,0,0.45)" }}
            >
              TRAINING GROUND
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-300">
              Your wallet is the club. Tokens are your squad. On-chain balances,
              portfolio momentum, caps, and contract risk — powered by the same
              REST APIs documented in this repo&apos;s GoldRush skills.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Sparkles className="size-4 text-amber-400" />
            <span>v0.1 · Foundational only (stable on the go)</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pt-8">
        {/* Controls */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 rounded-2xl border border-white/15 bg-white/5 p-5 shadow-xl shadow-black/40 backdrop-blur-xl"
        >
          <div className="grid gap-4 sm:grid-cols-[1fr_180px_auto] sm:items-end">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Manager wallet (EVM / ENS)
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x… or vitalik.eth"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white outline-none ring-amber-400/40 placeholder:text-zinc-500 focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Home stadium (chain)
              </label>
              <select
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-amber-400/40"
              >
                {CHAINS.map((c) => (
                  <option key={c.id} value={c.id} className="bg-zinc-900">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={load}
              disabled={loading}
              className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 text-sm font-bold uppercase tracking-wide text-black shadow-lg shadow-amber-900/30 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Scouting…
                </>
              ) : (
                "Kick off matchday"
              )}
            </motion.button>
          </div>
          <AnimatePresence>
            {clientError ? (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-200"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                {clientError}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.section>

        {data ? (
          <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.08 }}
              className="space-y-8"
            >
              <StatsRibbon
                summary={data.summary}
                totalValue={totalValue}
                approvalCount={approvalCount}
                chain={data.chain}
                address={data.address}
              />
              <PitchSquad squad={squad} />
              <MomentumChart
                series={data.portfolio_series}
                hasPortfolioError={Boolean(data.portfolio_raw_error)}
              />
              {data.partial_errors?.length ? (
                <p className="text-center text-xs text-amber-200/80">
                  Some feeds returned errors (chart or approvals may be
                  incomplete): {data.partial_errors.join(" · ")}
                </p>
              ) : null}
            </motion.div>

            <aside className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-5"
              >
                <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-white">
                  SIDELINE NOTES
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-300">
                  <li>
                    <strong className="text-amber-300">Starting XI</strong> — top
                    holdings by USD from{" "}
                    <code className="rounded bg-black/40 px-1 text-xs">
                      balances_v2
                    </code>{" "}
                    (spam filtered).
                  </li>
                  <li>
                    <strong className="text-amber-300">Season form</strong> —
                    aggregated{" "}
                    <code className="rounded bg-black/40 px-1 text-xs">
                      portfolio_v2
                    </code>{" "}
                    points when holdings expose timestamps.
                  </li>
                  <li>
                    <strong className="text-amber-300">Caps</strong> —{" "}
                    <code className="rounded bg-black/40 px-1 text-xs">
                      transactions_summary
                    </code>
                    .
                  </li>
                  <li>
                    <strong className="text-amber-300">Contract talks</strong>{" "}
                    — open token approvals from{" "}
                    <code className="rounded bg-black/40 px-1 text-xs">
                      approvals
                    </code>{" "}
                    (revoke risky spenders off-pitch).
                  </li>
                </ul>
              </motion.div>
            </aside>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 py-20 text-center text-zinc-400">
            <p className="text-lg text-zinc-300">
              Hit <strong className="text-amber-400">Kick off matchday</strong>{" "}
              to load live GoldRush data.
            </p>
            <p className="mt-2 text-sm">
              Default address is a well-known public wallet — swap in yours.
            </p>
          </div>
        )}
      </main>

      <footer className="relative z-10 mx-auto mt-16 max-w-6xl border-t border-white/10 px-4 py-8 text-center text-xs text-zinc-500">
        Built for the GoldRush skills in this repo · Not affiliated with FIFA or
        any league · On-chain data only via{" "}
        <a
          className="text-amber-500/90 underline"
          href="https://goldrush.dev/docs/"
          target="_blank"
          rel="noreferrer"
        >
          GoldRush Foundational API
        </a>
      </footer>
    </div>
  );
}
