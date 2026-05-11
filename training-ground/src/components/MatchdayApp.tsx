"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Loader2, Trophy, AlertTriangle, Sparkles } from "lucide-react";
import { PitchSquad } from "./PitchSquad";
import { MomentumChart } from "./MomentumChart";
import { StatsRibbon } from "./StatsRibbon";
import { SquadTable } from "./SquadTable";
import { MatchdaySkeleton } from "./MatchdaySkeleton";
import { DemoShowcaseBar } from "./DemoShowcaseBar";
import { ApprovalsModal, type ApprovalRow } from "./ApprovalsModal";
import { pickSquad, squadValuation, tokenRowKey } from "@/lib/roster";
import type { BalancePlayer } from "@/types/balance";
import { DEMO_WALLETS } from "@/lib/demoWallets";
import {
  loadRecentClubs,
  rememberClub,
  type RecentClub,
} from "@/lib/recentClubs";

export type { BalancePlayer };

type MatchdayPayload = {
  chain: string;
  address: string;
  balances: { items?: BalancePlayer[] } | null;
  balances_error?: boolean;
  portfolio_series: { date: string; value: number }[];
  portfolio_series_is_fallback?: boolean;
  portfolio_raw_error?: boolean;
  summary: { items?: Record<string, unknown>[] } | null;
  summary_error?: boolean;
  approvals: { items?: ApprovalRow[] } | null;
  approvals_error?: boolean;
  partial_errors: string[];
  rich_scout?: boolean;
  gas_scout?: boolean;
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

export function MatchdayApp() {
  const reduceMotion = useReducedMotion();
  const [chain, setChain] = useState("base-mainnet");
  const [address, setAddress] = useState(
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
  );
  const [richScout, setRichScout] = useState(false);
  const [gasScout, setGasScout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MatchdayPayload | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [recentClubs, setRecentClubs] = useState<RecentClub[]>([]);
  const [approvalsOpen, setApprovalsOpen] = useState(false);

  useEffect(() => {
    setRecentClubs(loadRecentClubs());
  }, []);

  const fetchMatchday = useCallback(
    async (opts?: { chain?: string; address?: string }) => {
      const c = opts?.chain ?? chain;
      const addr = (opts?.address ?? address).trim();
      setLoading(true);
      setClientError(null);
      try {
        const q = new URLSearchParams({ chain: c, address: addr });
        if (richScout) q.set("rich", "1");
        if (gasScout) q.set("gas", "1");
        const res = await fetch(`/api/matchday?${q.toString()}`, {
          cache: "no-store",
        });
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
        const preset = DEMO_WALLETS.find(
          (w) =>
            w.chain === c && w.address.toLowerCase() === addr.toLowerCase()
        );
        rememberClub(c, addr, preset?.label);
        setRecentClubs(loadRecentClubs());
        if (opts?.chain) setChain(opts.chain);
        if (opts?.address !== undefined) setAddress(opts.address);
      } catch {
        setClientError("Network error — try again.");
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    [chain, address, richScout, gasScout]
  );

  const runPreset = useCallback(
    async (presetChain: string, presetAddress: string) => {
      setChain(presetChain);
      setAddress(presetAddress);
      await fetchMatchday({
        chain: presetChain,
        address: presetAddress,
      });
    },
    [fetchMatchday]
  );

  const squad = useMemo(
    () => pickSquad(data?.balances?.items),
    [data?.balances?.items]
  );

  const xiKeys = useMemo(
    () => new Set(squad.map((p) => tokenRowKey(p))),
    [squad]
  );

  const totalValue = useMemo(
    () => squadValuation(data?.balances?.items),
    [data?.balances?.items]
  );

  const approvalCount = data?.approvals?.items?.length ?? 0;
  const approvalRows = (data?.approvals?.items ?? []) as ApprovalRow[];

  const panelMotion = reduceMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-16">
      <DemoShowcaseBar />

      <div
        className="pointer-events-none fixed inset-0 flood-beam"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 15% 0%, rgba(255,220,120,0.15), transparent 55%), radial-gradient(ellipse 50% 35% at 85% 0%, rgba(255,220,120,0.12), transparent 50%)",
        }}
      />

      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-amber-300/90">
              <Trophy className="size-3.5" />
              GoldRush Foundational · showcase prototype
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
            <span>v0.3 · demo presets + approvals drill-down</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-8">
        <motion.section
          {...panelMotion}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
          className="mb-10 rounded-2xl border border-white/15 bg-white/5 p-5 shadow-xl shadow-black/40 backdrop-blur-xl"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Demo presets
          </p>
          <div className="mb-6 flex flex-wrap gap-2">
            {DEMO_WALLETS.map((w) => (
              <button
                key={w.id}
                type="button"
                title={w.blurb}
                disabled={loading}
                onClick={() => void runPreset(w.chain, w.address)}
                className="rounded-full border border-amber-500/35 bg-amber-950/40 px-4 py-2 text-xs font-semibold text-amber-100 transition hover:border-amber-400/60 hover:bg-amber-900/50 disabled:opacity-50"
              >
                {w.label}
              </button>
            ))}
          </div>

          {recentClubs.length > 0 ? (
            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Recent clubs
              </p>
              <div className="flex flex-wrap gap-2">
                {recentClubs.map((rc) => (
                  <button
                    key={`${rc.chain}-${rc.address}`}
                    type="button"
                    disabled={loading}
                    onClick={() =>
                      void runPreset(rc.chain, rc.address)
                    }
                    className="max-w-full truncate rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-left text-[11px] text-zinc-300 hover:border-white/25 hover:text-white disabled:opacity-50"
                  >
                    <span className="font-mono text-zinc-500">{rc.chain}</span>{" "}
                    <span className="text-zinc-200">
                      {rc.label ?? `${rc.address.slice(0, 6)}…${rc.address.slice(-4)}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

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
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              onClick={() => void fetchMatchday()}
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

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={richScout}
                onChange={(e) => setRichScout(e.target.checked)}
                className="mt-1 size-4 rounded border-white/20 bg-black/50 text-amber-500 focus:ring-amber-400/40"
              />
              <span>
                <strong className="text-amber-200">Rich scout</strong> —{" "}
                <code className="rounded bg-black/40 px-1 text-[11px]">
                  with-transfer-count=true
                </code>{" "}
                (+3 credits).
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={gasScout}
                onChange={(e) => setGasScout(e.target.checked)}
                className="mt-1 size-4 rounded border-white/20 bg-black/50 text-amber-500 focus:ring-amber-400/40"
              />
              <span>
                <strong className="text-amber-200">Gas scout</strong> —{" "}
                <code className="rounded bg-black/40 px-1 text-[11px]">
                  with-gas=true
                </code>{" "}
                (+1 credit; slower on huge wallets).
              </span>
            </label>
          </div>

          <AnimatePresence>
            {clientError ? (
              <motion.p
                initial={
                  reduceMotion
                    ? { opacity: 1, height: "auto" }
                    : { opacity: 0, height: 0 }
                }
                animate={{ opacity: 1, height: "auto" }}
                exit={
                  reduceMotion
                    ? { opacity: 1, height: "auto" }
                    : { opacity: 0, height: 0 }
                }
                className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-200"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                {clientError}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.section>

        {loading ? (
          <MatchdaySkeleton />
        ) : data ? (
          <div className="grid gap-10 xl:grid-cols-[1fr_320px]">
            <div className="space-y-10">
              {data.balances_error ? (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-950/40 px-4 py-3 text-sm text-amber-100"
                >
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
                  <span>
                    <strong>Balances feed failed.</strong> The pitch may be empty.
                    Check your API key and chain. Other cards may still load from
                    partial responses.
                  </span>
                </motion.div>
              ) : null}

              <StatsRibbon
                summary={data.summary}
                totalValue={totalValue}
                approvalCount={approvalCount}
                chain={data.chain}
                address={data.address}
                richScout={Boolean(data.rich_scout)}
                gasScout={Boolean(data.gas_scout)}
                approvalsError={Boolean(data.approvals_error)}
                reduceMotion={Boolean(reduceMotion)}
                onOpenApprovals={() => setApprovalsOpen(true)}
              />

              <div className="grid gap-10 lg:grid-cols-[1fr_minmax(300px,1fr)] lg:items-start">
                <PitchSquad squad={squad} reduceMotion={Boolean(reduceMotion)} />
                <SquadTable items={data.balances?.items} xiKeys={xiKeys} />
              </div>

              <MomentumChart
                series={data.portfolio_series}
                hasPortfolioError={Boolean(data.portfolio_raw_error)}
                isSpotFallback={Boolean(data.portfolio_series_is_fallback)}
                reduceMotion={Boolean(reduceMotion)}
              />

              {data.partial_errors?.length ? (
                <p className="text-center text-xs text-amber-200/80">
                  Some feeds returned errors (chart or approvals may be
                  incomplete): {data.partial_errors.join(" · ")}
                </p>
              ) : null}
            </div>

            <aside className="space-y-6">
              <motion.div
                initial={
                  reduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}
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
                    <strong className="text-amber-300">Full roster</strong> — same
                    endpoint; table includes NFT rows if returned.
                  </li>
                  <li>
                    <strong className="text-amber-300">Contract talks</strong> —
                    click the stat card when the approval count is above zero to
                    open spenders.
                  </li>
                  <li>
                    <strong className="text-amber-300">Season form</strong> —{" "}
                    <code className="rounded bg-black/40 px-1 text-xs">
                      portfolio_v2
                    </code>
                    .
                  </li>
                </ul>
              </motion.div>
            </aside>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 py-20 text-center text-zinc-400">
            <p className="text-lg text-zinc-300">
              Hit <strong className="text-amber-400">Kick off matchday</strong>{" "}
              or a <strong className="text-amber-400">demo preset</strong> above.
            </p>
            <p className="mt-2 text-sm">
              You need a GoldRush API key in{" "}
              <code className="rounded bg-black/40 px-1 text-zinc-300">
                .env.local
              </code>
              .
            </p>
          </div>
        )}
      </main>

      <ApprovalsModal
        open={approvalsOpen}
        onClose={() => setApprovalsOpen(false)}
        items={approvalRows}
        chain={data?.chain ?? chain}
      />

      <footer className="relative z-10 mx-auto mt-16 max-w-7xl border-t border-white/10 px-4 py-8 text-center text-xs text-zinc-500">
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
