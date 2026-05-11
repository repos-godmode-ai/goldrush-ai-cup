# Training Ground — architecture & product roadmap

This document is the **authoritative product and technical plan** for the Training Ground experience. It assumes you already have a working MVP (Foundational-only, pitch UI, charts) and defines how to evolve it without lying to users about what GoldRush is or what football is.

---

## 1. Executive framing

**What this product is:** a **wallet-centric portfolio cockpit** with a **football stadium metaphor**. Every number on screen must trace to a **GoldRush Foundational** (or later Streaming) response field. Nothing is “World Cup official data.”

**What this product is not:** a sports stats product, a betting surface, or a replacement for explorers. If you need real squads, fixtures, or injuries, that is a **different data plane** (sports APIs) and must stay **visually and verbally separated** from GoldRush panels.

**Design principle:** *Tifo, not tabloid* — expressive visuals and terrace language, but **precise legends** (“USD from `balances_v2`”, “last 21d from `portfolio_v2` when available”) so sophisticated users trust you.

---

## 2. Domain model — football language we earn

| Terrace / manager term | Honest on-chain meaning | GoldRush source (today) | Notes |
|------------------------|-------------------------|-------------------------|--------|
| **Club** | One EVM identity you analyse | Path param `walletAddress` | ENS resolves server-side. |
| **Home stadium** | Chain context | `chainName` (kebab-case) | Foundational vs Streaming use different casing in other products — centralise mapping when you add Streaming. |
| **Squad / roster** | Token positions with economic weight | `balances_v2` items | Exclude spam; NFTs are “youth cups” only if you add an NFT mode later. |
| **Starting XI** | Top *k* holdings by USD quote | Derived sort on `quote` | *k* = 11 is fine; formation slots are **layout**, not tactical truth. |
| **Captain** | Native gas asset or highest-value line | `native_token` + sort | GK metaphor is flavour; label as “club captain (native)” in tooltips later. |
| **Form (24h)** | Short-horizon PnL proxy (USD) | `quote` vs `quote_24h` | Not sporting “player form” — tooltips should say **“24h USD delta (quote vs quote_24h)”**. |
| **Season / momentum** | Valuation through time | `portfolio_v2` aggregation | When API shape lacks buckets, **spot fallback** is mandatory and must stay **explicit** (you already flag `portfolio_series_is_fallback`). |
| **Caps** | Activity volume | `transactions_summary.total_count` | Optional: `with-transfer-count` for “transfer market touches” — **cost + latency** trade-off per skill docs. |
| **Medical / contract talks** | Approval surface | `approvals` rows | Drill-down to spenders = “agent clauses” in copy only; behaviour is revoke education. |
| **Away fixture** | Same wallet on another chain | New request, same mental model | Multi-chain “tour” is a strong v1 narrative without new APIs if you add tabs. |

Anything outside this table needs a **new row** before you ship it.

---

## 3. GoldRush stratification — how an architect uses the suite

### Tier A — Foundational REST (current MVP)

**Best for:** historical and near-real-time reads, pagination, portfolio accounting, security snapshots.  
**Why it anchors the product:** predictable HTTP, easy to cache *policy* (you correctly use `no-store` for wallet routes), works behind a single server key.

**Cost discipline:** prefer **primary** endpoints from the skill index; mark `specialized` calls behind “Scout report (advanced)” toggles so casual users do not burn credits.

### Tier B — Streaming (GraphQL / WebSocket) — *phase 2*

**Best for:** “matchday live” — wallet activity, OHLCV on a shortlist of tokens, new pairs as “rumour mill” for power users.  
**Architecture rule:** never mix REST kebab-case and Streaming `SCREAMING_SNAKE_CASE` in the same module without a **single `chainBridge`**.

**Product rule:** add Streaming only when you have a **second screen** (“Live stand”) so Foundational users are never forced into WebSocket complexity.

### Tier C — x402 — *optional lane*

**Best for:** demos, agents, “guest turnstile” on Base Sepolia per skill docs.  
**Rule:** keep x402 **environment-gated**; never silently substitute x402 on mainnet until your docs and GoldRush say it is production-ready.

### Tier D — CLI / MCP

**Best for:** operator scripts, content generation, internal QA — not the consumer web UI. Link from README as “staff entrance”.

---

## 4. Information architecture (screens & journeys)

### Journey A — *Matchday scout* (default)

1. Pick **stadium** (chain).  
2. Enter **club** (address / ENS).  
3. **Kick off** → parallel Foundational bundle (already implemented).  
4. Read: **XI**, **momentum**, **caps**, **approvals count**.

### Journey B — *Tactics board* (near-term)

- Break “XI” into **filters**: stablecoins as “defensive line”, volatile alts as “attack”, LSTs as “set-piece specialists”.  
- Still 100% derived from `balances_v2` + `type` / heuristics — no new API.

### Journey C — *Away leg* (v1)

- Persist last *N* `(chain, address)` in `localStorage` with consent copy.  
- Quick switcher = “continental tour” without multi-wallet Foundational unless you add `allchains` endpoints later (credits higher — gate behind “Pro scout”).

### Journey D — *Live stand* (phase 2)

- Subscribe to `walletTxs` or OHLCV for **pinned** tokens from the XI.  
- Clear **latency** and **disconnect** UX (stadium lights dim, reconnect banner).

---

## 5. Frontend architecture — how I would harden this as lead FE

### 5.1 Rendering strategy

- **Server Components** for static chrome (stadium frame, legal footer, educational copy).  
- **Client island** for interactive matchday (already the right split).  
- **Route Handlers** as the only place that touches secrets — never move the key to the browser.

### 5.2 Design system (tokens)

Define CSS variables (you started this in `globals.css`) and **commit to a scale**:

- **Pitch:** two greens + one stripe rhythm; never more than three greens on screen.  
- **Floodlights:** one warm accent (`amber` family) for CTAs; one cool accent for data (`emerald`/`teal`) so charts do not fight buttons.  
- **Typography:** display face for headlines only; body for all numerals that must compare — **tabular lining figures** for USD columns when you add a table view.

### 5.3 Motion discipline

- **One primary motion motif** (e.g. staggered XI reveal).  
- Charts: **no** entrance animation on every refresh — it causes seasickness. Animate **opacity once per session** or on first paint only.  
- Respect `prefers-reduced-motion`: reduce stagger to zero, swap sweeps for fades.

### 5.4 Charts as honest storytelling

- **Y-axis:** always show currency; never imply “goals”.  
- **X-axis:** if using fallback line, **annotate** “two synthetic points — spot NAV” (you already explain in prose — keep that in chart subtitle too).  
- **Empty states:** distinguish **“no API key”**, **“upstream error”**, **“wallet empty”**, **“wallet only dust”** — different copy and colour.

### 5.5 Accessibility

- Pitch tiles must have **accessible names**: e.g. `aria-label="ETH, 24h form up, valuation 12,400 dollars"`.  
- Colour-only form arrows need **textual backup** (“+3.1% vs 24h ago”).  
- Keyboard path: chain select, address input, kick-off button — tab order locked.

### 5.6 Performance

- **Image policy:** token logos via `<img>` with `loading="lazy"` and size caps; avoid loading 50 logos on first paint.  
- **Bundle:** keep Recharts on the matchday island only; consider **dynamic import** if the landing page grows.  
- **API:** parallel `Promise.all` is correct; add **timeouts** and per-call **abort** if you expose “refresh” spam.

---

## 6. API layer patterns (backend-for-frontend)

| Pattern | Status | Recommendation |
|---------|--------|------------------|
| Wallet routes `no-store` | Done | Keep. |
| `force-dynamic` on matchday | Done | Keep. |
| Multi-key env (`GOLDRUSH` / `COVALENT`) | Done | Document in deploy playbooks. |
| Partial success JSON | Done | Next: expose `{ source: "balances" \| "portfolio", ok: boolean }[]` for UI badges. |
| Rate limiting | Not done | Add **per-IP** throttle on `/api/matchday` before public deploy. |
| Observability | Not done | Structured log: `chain`, `address_hash` (truncated), `latency_ms`, `partial_errors.length`. |

---

## 7. Roadmap — phased, shippable slices

### Shipped (MVP) — *League licence*

- Foundational bundle + pitch + chart + approvals count + verification doc.  
- **v0.3:** showcase bar + demo presets (one-click load), loading skeleton, recent clubs (`localStorage`), **Contract talks** modal (spenders), optional **`with-gas`** on summary, presenter **SHOWCASE.md** runbook.  
- **Exit criterion:** `npm run verify` green; manual matchday happy path with real key.

### Near (v0.2) — *Press conference polish*

**Done in repo:** truth tips (stats + chart), `prefers-reduced-motion` (CSS + Framer), sortable full roster table beside pitch, optional **`with-transfer-count`** (“Rich scout”) with credit call-out.

**Still open:** per-row tooltips on roster cells; optional **`with-gas`** toggle with credit copy; explicit **credit estimate** numbers (not just prose).

### Mid (v1.0) — *European nights*

- **Multi-fixture:** saved clubs + chain switcher.  
- **Approvals drill-down** modal listing spenders (still Foundational).  
- **PDF / share card** export of XI (client-only, no server storage).

### Phase 2 — *Live stand*

- Streaming module behind feature flag.  
- Pin max **5** tokens for OHLCV to control cost and UI noise.

### Non-goals (unless product pivots)

- Real-world fixtures, odds, or league tables from non-GoldRush sources **without** a labelled “Sports feed” panel.  
- On-chain trading execution from this UI.

---

## 8. Risk register (architect view)

| Risk | Mitigation |
|------|------------|
| Metaphor reads as misleading | Legends + footer + tooltips always name endpoints. |
| Credit burn on heavy wallets | Pagination, caps on items, “load more” for tables. |
| Cross-wallet cache bugs | Already mitigated — periodic audit that **no** `fetch` to GoldRush uses default cache. |
| Streaming auth & reconnect churn | Phase 2 only; use official SDK path from skill. |
| Logo CDN failures | Fallback monogram already partially there — unify. |

---

## 9. Success metrics (even for a demo)

- **Technical:** p95 `/api/matchday` under **3 seconds** on a warm connection; zero unhandled server exceptions.  
- **Trust:** user testing — “Do you believe this is real wallet data?” — target ≥ 90% yes after reading one legend.  
- **Delight:** time-to-first-XI under **5 seconds** after click on typical wallets.

---

## 10. How this document relates to other files

| File | Role |
|------|------|
| [README.md](./README.md) | Quick start & stack. |
| [VERIFICATION.md](./VERIFICATION.md) | Mechanical QA checklist. |
| **ARCHITECTURE.md** (this file) | Product truth, FE craft, GoldRush strategy, roadmap. |

When README and this doc disagree, **update README** to match this file.
