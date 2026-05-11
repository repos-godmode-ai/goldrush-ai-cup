# Training Ground — verification plan

Use this checklist whenever you change the app or upgrade dependencies.

## 1. Install and build (no API key required)

```bash
cd training-ground
npm ci
npm run verify
```

`npm run verify` runs `next build` and must finish with **Compiled successfully**.

## 2. API key and dev server

```bash
cp .env.example .env.local
# Set GOLDRUSH_API_KEY=... from https://goldrush.dev/platform/
npm run dev
```

Open **http://localhost:3000** and click **Kick off matchday** with the default address.

**Expect:** pitch tiles, stat cards, and either a real `portfolio_v2` curve or the **spot fallback** line with the amber explanation banner.

## 3. HTTP checks (optional)

With dev server running:

| Check | Command | Expected |
|--------|---------|----------|
| Missing key | Stop server, unset env, `npm run dev`, then call API | `503` + message about `GOLDRUSH_API_KEY` |
| Bad address | `curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000/api/matchday?chain=base-mainnet&address=0xbad"` | `400` |
| Good shape | `curl -s "http://127.0.0.1:3000/api/matchday?chain=base-mainnet&address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" \| head -c 200` | JSON with `balances`, `portfolio_series`, `partial_errors` |

## 4. Regression rules

- **`cache: "no-store"`** on upstream `fetch` — no cross-wallet caching.
- **`export const dynamic = "force-dynamic"`** on `api/matchday` — route is never statically optimized with stale params.
- **Fallback chart** — if `portfolio_v2` yields no time buckets but balances have USD, `portfolio_series_is_fallback` is `true`.

## 5. Production deploy

Set **`GOLDRUSH_API_KEY`** (or **`COVALENT_API_KEY`**) in the host’s environment (e.g. Vercel project settings). Never commit `.env.local`.
