# Showcase runbook (5 minutes)

Use this when presenting **Training Ground** live.

## Before you go on camera

1. From repo root: `npm install` then `cp training-ground/.env.example training-ground/.env.local` and set **`GOLDRUSH_API_KEY`** (or **`COVALENT_API_KEY`**).
2. `npm run verify` then `npm run dev`.
3. Open **http://localhost:3000** in a clean window (or incognito).

## Narrative (script)

1. **Showcase bar** — Expand “Demo script”; mention everything is real GoldRush Foundational data, not mock JSON.
2. **One-click preset** — Click **Vitalik · Ethereum**; point out the loading skeleton, then the stat ribbon. Open each **ⓘ** and read one sentence aloud.
3. **Pitch + roster** — Same eleven on the pitch as rows marked **XI**; sort the roster by **24h Δ** or **USD**.
4. **Season momentum** — If the amber “spot estimate” banner appears, explain it honestly (fallback from balances when portfolio time buckets are missing).
5. **Contract talks** — If the third stat is clickable, open the **modal** and scroll spenders; remind viewers to revoke in their wallet app.
6. **Optional toggles** — **Rich scout** / **Gas scout** before kick-off: mention extra credits from the skill docs, then re-run on **Binance 14** for density.

## If something fails

- **503** — API key missing or wrong env file location (`training-ground/.env.local`).
- **Empty pitch** — Wallet has no priced tokens on that chain; switch preset or chain.
- **Slow load** — Rich + Gas together on a huge wallet; turn toggles off.

## Deploy tip

Set the same env vars on Vercel (or your host). Optionally set `NEXT_PUBLIC_SITE_URL` for canonical URLs later.
