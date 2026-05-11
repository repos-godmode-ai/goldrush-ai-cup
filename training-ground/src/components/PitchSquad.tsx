"use client";

import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { BalancePlayer } from "./MatchdayApp";

const FORMATION = [
  { role: "GK", top: "86%", left: "50%", label: "Sweeper-keeper" },
  { role: "LB", top: "68%", left: "12%", label: "Full-back" },
  { role: "CB", top: "72%", left: "32%", label: "Centre-back" },
  { role: "CB", top: "72%", left: "68%", label: "Centre-back" },
  { role: "RB", top: "68%", left: "88%", label: "Full-back" },
  { role: "LM", top: "46%", left: "14%", label: "Wide mid" },
  { role: "CM", top: "48%", left: "38%", label: "Engine room" },
  { role: "CM", top: "48%", left: "62%", label: "Engine room" },
  { role: "RM", top: "46%", left: "86%", label: "Wide mid" },
  { role: "ST", top: "24%", left: "36%", label: "Striker" },
  { role: "ST", top: "24%", left: "64%", label: "Striker" },
];

function formIcon(p: BalancePlayer) {
  const q = p.quote ?? 0;
  const q24 = p.quote_24h ?? q;
  if (!q24 || !q) return <Minus className="size-3 text-zinc-400" />;
  const delta = (q - q24) / Math.max(q24, 1e-9);
  if (delta > 0.02) return <TrendingUp className="size-3 text-emerald-400" />;
  if (delta < -0.02) return <TrendingDown className="size-3 text-red-400" />;
  return <Minus className="size-3 text-zinc-400" />;
}

export function PitchSquad({ squad }: { squad: BalancePlayer[] }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white">
            THE PITCH — STARTING XI
          </h2>
          <p className="text-sm text-zinc-400">
            Formation 4-4-2 · Positions by squad depth (USD value). Arrows =
            24h form from GoldRush quotes.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border-2 border-white/25 shadow-2xl shadow-black/60">
        {/* Crowd */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-zinc-900/90 to-transparent" />
        <div className="pitch-stripes relative aspect-[5/3] w-full max-h-[520px] min-h-[340px]">
          <div className="grass-shimmer pointer-events-none absolute inset-0" />

          {/* Halfway line */}
          <div className="absolute left-[8%] right-[8%] top-1/2 h-0.5 -translate-y-1/2 bg-[var(--pitch-line)]/90" />
          <div className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--pitch-line)]/90" />
          {/* Penalty areas */}
          <div className="absolute bottom-[6%] left-1/2 h-[28%] w-[44%] -translate-x-1/2 rounded-t-lg border-2 border-b-0 border-[var(--pitch-line)]/90" />
          <div className="absolute top-[6%] left-1/2 h-[28%] w-[44%] -translate-x-1/2 rounded-b-lg border-2 border-t-0 border-[var(--pitch-line)]/90" />
          {/* Corners */}
          <div className="absolute bottom-2 left-2 size-6 rounded-br border-b-2 border-r-2 border-[var(--pitch-line)]/80" />
          <div className="absolute bottom-2 right-2 size-6 rounded-bl border-b-2 border-l-2 border-[var(--pitch-line)]/80" />
          <div className="absolute left-2 top-2 size-6 rounded-tr border-r-2 border-t-2 border-[var(--pitch-line)]/80" />
          <div className="absolute right-2 top-2 size-6 rounded-tl border-l-2 border-t-2 border-[var(--pitch-line)]/80" />

          {FORMATION.map((pos, i) => {
            const player = squad[i];
            return (
              <motion.div
                key={pos.role + i}
                initial={{ opacity: 0, scale: 0.85, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.04 * i, type: "spring", stiffness: 260 }}
                className="absolute w-[22%] max-w-[140px] -translate-x-1/2 -translate-y-1/2"
                style={{ top: pos.top, left: pos.left }}
              >
                {player ? (
                  <div className="rounded-xl border border-white/25 bg-black/55 p-2 text-center shadow-lg backdrop-blur-md">
                    <div className="mb-1 flex items-center justify-center gap-1">
                      {player.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={player.logo_url}
                          alt=""
                          className="size-9 rounded-full border border-white/20 bg-white/10 object-contain"
                        />
                      ) : (
                        <div className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white">
                          {(player.contract_ticker_symbol ?? "?").slice(0, 3)}
                        </div>
                      )}
                      {formIcon(player)}
                    </div>
                    <p className="truncate text-[11px] font-bold uppercase tracking-tight text-white">
                      {player.contract_ticker_symbol ?? "NATIVE"}
                    </p>
                    <p className="truncate text-[9px] text-zinc-400">
                      {pos.label}
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold text-amber-300">
                      {player.pretty_quote ?? `$${(player.quote ?? 0).toFixed(2)}`}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/20 bg-black/30 p-2 text-center text-[10px] text-zinc-500">
                    Open tryout
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
