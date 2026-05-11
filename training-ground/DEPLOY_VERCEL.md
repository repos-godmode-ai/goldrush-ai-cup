# Deploy Training Ground to Vercel

The Next.js app lives in **`training-ground/`**, but the repository now includes a **root `vercel.json`** so you can import the GitHub repo with **Root Directory left at `.` (repository root)**. You no longer need to pick a subfolder in the Vercel UI.

## Option A — GitHub import (recommended)

1. Merge **`main`** on GitHub so it includes `vercel.json`, `package.json`, and `training-ground/` (see repo history / PR **#2**).
2. [Vercel](https://vercel.com/new) → **Import** this repository.
3. **Root Directory:** leave as **`./`** (default / repository root).
4. **Framework:** Next.js (auto-detected from `vercel.json` + app build).
5. **Environment variables** (Production + Preview if you want previews to work):
   - `GOLDRUSH_API_KEY` or `COVALENT_API_KEY` — from [goldrush.dev/platform](https://goldrush.dev/platform/)
   - After first deploy: `NEXT_PUBLIC_SITE_URL` = your production URL (e.g. `https://your-project.vercel.app`)
6. **Deploy.**

Install and build are defined in root `vercel.json`:

- `npm ci --prefix training-ground`
- `npm run build --prefix training-ground`

### Optional: deploy only `training-ground/` as root

If you prefer the classic layout, set **Root Directory** to `training-ground` in Vercel and remove or ignore root `vercel.json` overrides (not recommended once root deploy is set up).

---

## Option B — Vercel CLI

From the **repository root** (not inside `training-ground/`):

```bash
npx vercel login
npx vercel link
npx vercel env add GOLDRUSH_API_KEY production
npx vercel --prod
```

---

## Option C — GitHub Actions

1. Create a Vercel project (Option A once) and add **Org ID**, **Project ID**, and a [token](https://vercel.com/account/tokens).
2. GitHub → **Settings → Secrets → Actions**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
3. Run **Deploy Training Ground to Vercel** (workflow_dispatch). The workflow runs from repo root.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| “No Next.js version detected” | Root `package.json` must list **`next`** (and `react` / `react-dom`) so Vercel can detect the framework; the real app still installs from `training-ground/` via `vercel.json`. |
| 503 on `/api/matchday` | Add `GOLDRUSH_API_KEY` (or `COVALENT_API_KEY`) in Vercel env; redeploy. |
| Wrong OG URL | Set `NEXT_PUBLIC_SITE_URL` to the live `https://…vercel.app` URL. |
