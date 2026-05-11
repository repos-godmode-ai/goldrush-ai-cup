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
# Edit .env.local — set GOLDRUSH_API_KEY from https://goldrush.dev/platform/
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), pick a **chain** (kebab-case, e.g. `base-mainnet`), enter a **0x** address or **ENS**, then **Kick off matchday**.

## Stack

- Next.js 15 (App Router) + Tailwind CSS v4  
- Framer Motion (player entrance)  
- Recharts (valuation curve)  
- Server route `src/app/api/matchday/route.ts` keeps your API key off the client  

## Notes

- This is **on-chain data only**; theming is metaphorical.  
- If the momentum chart is empty, the API may use different `holdings` field shapes; squad cards still reflect live `balances_v2`.  
