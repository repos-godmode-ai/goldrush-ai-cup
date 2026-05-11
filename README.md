# goldrush-ai-cup

## Training Ground (demo app)

Football-themed **GoldRush Foundational** dashboard (pitch, XI, charts): see [`training-ground/README.md`](training-ground/README.md). Run with `GOLDRUSH_API_KEY` in `training-ground/.env.local`.

**Vercel:** import this repo with **Root Directory = `./`**. The repo is an **npm workspace** (`training-ground`); root `npm ci` hoists **`next`** so Vercel detects Next.js. Root [`vercel.json`](vercel.json) runs `npm run build -w training-ground`. Details: [`training-ground/DEPLOY_VERCEL.md`](training-ground/DEPLOY_VERCEL.md).

---

This repository includes **GoldRush Agent Skills** so you (and Cursor) can see exactly what each skill contains, reinstall from upstream, and run the CLI to verify connectivity.

## GoldRush Agent Skills (in this repo)

Agent Skills are markdown packs plus reference files that follow the [Agent Skills](https://agentskills.io) convention. Cursor and other compatible agents load them for routing, parameters, SDK usage, and credit-aware workflows.

### What is installed here

| Skill | Folder | Open this first |
|-------|--------|-------------------|
| Foundational REST API | [`.agents/skills/goldrush-foundational-api/`](.agents/skills/goldrush-foundational-api/) | [`SKILL.md`](.agents/skills/goldrush-foundational-api/SKILL.md) |
| Streaming (GraphQL / WebSocket) | [`.agents/skills/goldrush-streaming-api/`](.agents/skills/goldrush-streaming-api/) | [`SKILL.md`](.agents/skills/goldrush-streaming-api/SKILL.md) |
| x402 (pay-per-request) | [`.agents/skills/goldrush-x402/`](.agents/skills/goldrush-x402/) | [`SKILL.md`](.agents/skills/goldrush-x402/SKILL.md) |
| GoldRush CLI (+ MCP) | [`.agents/skills/goldrush-cli/`](.agents/skills/goldrush-cli/) | [`SKILL.md`](.agents/skills/goldrush-cli/SKILL.md) |

Each skill’s `references/` directory holds endpoint lists, workflows, and integration notes.

`skills-lock.json` records which skills were installed and hashes of their `SKILL.md` files for reproducibility.

### Reinstall or update from GitHub

From the repository root:

```bash
npx --yes skills add covalenthq/goldrush-agent-skills
```

That clones [covalenthq/goldrush-agent-skills](https://github.com/covalenthq/goldrush-agent-skills) and copies skills into `.agents/skills/`. After an update, commit the changed files if you want the repo to stay in sync.

### API key (Foundational / Streaming / most CLI commands)

Create a key at [GoldRush Platform](https://goldrush.dev/platform/), then either:

```bash
export GOLDRUSH_API_KEY=your_api_key_here
```

A template variable name is in [`.env.example`](.env.example) if you prefer copying to `.env` for local tooling.

For the CLI (stores in the OS keychain per the CLI skill), run:

```bash
npx --yes @covalenthq/goldrush-cli auth
```

### Run the CLI yourself (sanity check)

```bash
npx --yes @covalenthq/goldrush-cli --help
npx --yes @covalenthq/goldrush-cli chains
```

Commands like `balances` or `transfers` need a valid API key. Use kebab-case chain names (for example `eth-mainnet`) as described in each `SKILL.md`.

### Full API index (all doc paths)

GoldRush publishes a machine-readable index at [https://goldrush.dev/docs/llms.txt](https://goldrush.dev/docs/llms.txt).

### Security note

Third-party skills run with whatever permissions your agent grants them. The `npx skills` installer may show security assessments; review [skills.sh/covalenthq/goldrush-agent-skills](https://skills.sh/covalenthq/goldrush-agent-skills) before relying on them in sensitive environments.
