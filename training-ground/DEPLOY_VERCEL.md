# Deploy Training Ground to Vercel

The repo uses an **npm workspace**: the Next.js app is the **`training-ground`** package. The **root** `package-lock.json` installs dependencies and **hoists `next` to `node_modules/next`**, which satisfies Vercel’s “Next.js version detected” check when **Root Directory = `./`** (repository root).

## Root Directory

Use **repository root** (`./` / default). Do **not** point Vercel only at `training-ground` unless you also copy a lockfile there — the supported layout is **workspace root + `vercel.json`**.

## What Vercel runs (from root `vercel.json`)

| Step | Command |
|------|---------|
| Install | `npm ci` |
| Build | `npm run build -w training-ground` |

## Option A — GitHub import

1. Import this repo on **latest `main`** (includes root `package-lock.json` and workspace `package.json`).
2. **Root Directory:** `./` (default).
3. **Environment variables:** `GOLDRUSH_API_KEY` or `COVALENT_API_KEY` (Production + Preview as needed).
4. Optional after first deploy: `NEXT_PUBLIC_SITE_URL` = your `https://….vercel.app` URL.
5. Deploy.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| “No Next.js version detected” | Use **latest `main`**; ensure **Root Directory is repo root**; root `npm ci` must run (see `vercel.json`). Do not delete root `package-lock.json`. |
| 503 on `/api/matchday` | Set `GOLDRUSH_API_KEY` (or `COVALENT_API_KEY`) in Vercel env; redeploy. |
| Wrong OG URL | Set `NEXT_PUBLIC_SITE_URL` to the live production URL. |

## Option B — CLI

From repository root:

```bash
npx vercel login
npx vercel link
npx vercel env add GOLDRUSH_API_KEY production
npx vercel --prod
```

## Option C — GitHub Actions

See `.github/workflows/deploy-training-ground.yml` — set `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, then run the workflow manually.
