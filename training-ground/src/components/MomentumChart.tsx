"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

type Point = { date: string; value: number };

export function MomentumChart({
  series,
  hasPortfolioError,
  isSpotFallback,
}: {
  series: Point[];
  hasPortfolioError: boolean;
  isSpotFallback?: boolean;
}) {
  const chartData = series.map((p) => {
    const d = new Date(p.date);
    const label = Number.isNaN(d.getTime())
      ? p.date
      : d.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
    return { ...p, label };
  });

  const empty = !chartData.length;

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Activity className="size-5 text-amber-400" />
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white">
          SEASON MOMENTUM
        </h2>
      </div>
      <p className="mb-4 text-sm text-zinc-400">
        Aggregated USD valuation from{" "}
        <code className="rounded bg-black/40 px-1 text-xs">portfolio_v2</code>{" "}
        holdings time series (when exposed by the API). Think of it as your
        club&apos;s league position over the last few matchweeks.
      </p>
      {isSpotFallback ? (
        <p className="mb-3 rounded-lg border border-amber-500/30 bg-amber-950/30 px-3 py-2 text-xs text-amber-100/95">
          <strong>Spot estimate:</strong> no historical buckets parsed from{" "}
          <code className="rounded bg-black/30 px-1">portfolio_v2</code> for
          this wallet — showing a flat line at the current{" "}
          <code className="rounded bg-black/30 px-1">balances_v2</code> USD
          total so the chart still renders.
        </p>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-72 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-black/40 p-4 backdrop-blur-md"
      >
        {empty ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-zinc-400">
            <p>No time series returned for this wallet / chain.</p>
            {hasPortfolioError ? (
              <p className="text-xs text-amber-200/80">
                The portfolio endpoint returned an error — check credits or
                chain support.
              </p>
            ) : (
              <p className="max-w-md text-xs text-zinc-500">
                GoldRush still returned a valid response; this shape may use
                fields we don&apos;t aggregate yet. Squad cards above use live{" "}
                <code className="rounded bg-black/30 px-1">balances_v2</code>{" "}
                data.
              </p>
            )}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="pitchFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#065f46" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                tickFormatter={(v) =>
                  v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${(v / 1e3).toFixed(0)}k`
                }
                axisLine={false}
                tickLine={false}
                width={56}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(10,22,40,0.95)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                labelFormatter={(_, payload) =>
                  payload?.[0]?.payload?.date
                    ? new Date(payload[0].payload.date).toLocaleString()
                    : ""
                }
                formatter={(value: number) => [
                  `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                  "Squad valuation",
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#34d399"
                strokeWidth={2}
                fill="url(#pitchFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </section>
  );
}
