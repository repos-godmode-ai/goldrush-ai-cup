# Training Ground — GoldRush “World Cup” squad lab

A **football-themed** on-chain portfolio UI that only uses **GoldRush Foundational REST** (same patterns as `.agents/skills/goldrush-foundational-api`):

| Football metaphor | GoldRush source |
|-------------------|-----------------|
| Starting XI | `GET …/balances_v2/?no-spam=true` |
| Season momentum chart | `GET …/portfolio_v2/?days=21` (aggregated when timestamps exist) |
| Career caps | `GET …/transactions_summary/` |
| Contract talks | `GET …/approvals/{wallet}/` |

## Run locally

```bash
cd training-ground
cp .env.example .env.local
# Set GOLDRUSH_API_KEY or COVALENT_API_KEY — https://goldrush.dev/platform/
npm install
npm run verify
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), pick a **chain** (kebab-case, e.g. `base-mainnet`), enter a **0x** address or **ENS**, then **Kick off matchday**.

**Presenter runbook:** [SHOWCASE.md](./SHOWCASE.md)

**Checklist:** [VERIFICATION.md](./VERIFICATION.md)

**Product & technical plan (football × GoldRush × frontend craft):** [ARCHITECTURE.md](./ARCHITECTURE.md)

## Stack

- Next.js 15 (App Router) + Tailwind CSS v4  
- Framer Motion (pitch stagger; respects `prefers-reduced-motion`)  
- Recharts (valuation curve)  
- Sortable roster table + accessible **TruthTip** (ⓘ) copy tied to GoldRush fields  
- Server route `src/app/api/matchday/route.ts` keeps your API key off the client; optional `?rich=1` for heavier `transactions_summary`  

## Notes

- This is **on-chain data only**; theming is metaphorical.  
- If `portfolio_v2` does not yield a parseable time series, the app shows a **spot fallback** line (current USD total from `balances_v2`) so the chart always has something useful when the wallet has value.
