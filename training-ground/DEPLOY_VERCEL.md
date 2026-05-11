# Deploy Training Ground to Vercel

The Next.js app lives in **`training-ground/`**. Vercel must use that folder as the **Root Directory**.

## Option A — GitHub (recommended, ~3 minutes)

1. Push this repo (or merge PR **#2**) so `main` includes `training-ground/`.
2. In [Vercel Dashboard](https://vercel.com/new) → **Add New…** → **Project** → **Import** your Git repository.
3. Under **Configure Project**:
   - **Root Directory**: click **Edit** → set to `training-ground` (not the repo root).
   - **Framework Preset**: Next.js (auto-detected).
   - **Build Command**: `npm run build` (default).
   - **Output**: leave default (Next handles `.next`).
4. **Environment Variables** (Production + Preview):
   - `GOLDRUSH_API_KEY` = your key from [goldrush.dev/platform](https://goldrush.dev/platform/)  
     *or* `COVALENT_API_KEY` if you use that name (the app accepts either).
   - After the first deploy, add **`NEXT_PUBLIC_SITE_URL`** = your production URL (e.g. `https://your-app.vercel.app`) so Open Graph `metadataBase` is correct.
5. **Deploy**. First build runs `npm ci` + `next build` from `training-ground/`.

### After deploy

- Open the `.vercel.app` URL; use **demo presets** or **Kick off matchday**.
- If the API returns **503**, the env var is missing or misspelled in the Vercel project settings.

---

## Option B — Vercel CLI (from your laptop)

```bash
cd training-ground
npx vercel login          # browser or device code
npx vercel link           # create/link project
npx vercel env add GOLDRUSH_API_KEY production
npx vercel --prod
```

Set `NEXT_PUBLIC_SITE_URL` when you know the production hostname:

```bash
npx vercel env add NEXT_PUBLIC_SITE_URL production
# paste https://<your-project>.vercel.app
```

---

## Option C — GitHub Actions (manual)

1. Create a Vercel project and add **Org ID** + **Project ID** (Project → Settings → General) and a [token](https://vercel.com/account/tokens).
2. In GitHub: **Settings → Secrets and variables → Actions** add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
3. Run workflow **Deploy Training Ground to Vercel** under **Actions → workflow_dispatch** (file: `.github/workflows/deploy-training-ground.yml`).

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails “Cannot find module” | Root Directory must be **`training-ground`**, not repo root. |
| 503 on `/api/matchday` | Add `GOLDRUSH_API_KEY` or `COVALENT_API_KEY` in Vercel **Environment Variables**; redeploy. |
| Wrong OG / canonical URL | Set `NEXT_PUBLIC_SITE_URL` to the live `https://…vercel.app` URL. |
