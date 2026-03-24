# VelocityDrop public marketing site

Next.js App Router landing page for VelocityDrop (Discord bot, on-demand game servers). This package is **static marketing only**; the interactive bot panel is a **browser mock** and does not call the VelocityDrop API.

## Local development

From the monorepo root:

```bash
npm install
npm run dev:site
```

Or from `site/`:

```bash
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

If you see “Unable to connect,” the dev server is not running. Run `npm run dev:site` from the repo root (or `npm run dev` inside `site/`). This app does **not** start when you run root `npm run dev` (that only runs the bot, API, and operator dashboard).

## Environment variables

Create `site/.env.local` (optional):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_DISCORD_INVITE_URL` | OAuth install / invite URL for “Add to Discord” (use `#` until ready) |
| `NEXT_PUBLIC_GITHUB_REPO` | Public repo URL for footer link (e.g. `https://github.com/you/velocitydrop`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata (e.g. `https://velocitydrop.vercel.app`) |

## Deploy on Vercel (GitHub)

This repo is an npm **workspace** monorepo. The marketing app lives under `site/`. Vercel must **not** run the root `npm run build` (that builds the bot, API, and other packages).

**Option A (recommended):**

1. Import the GitHub repo in Vercel.
2. Set **Root Directory** to `site`.
3. **Install Command** should install from the monorepo root so workspaces resolve: the repo includes [`site/vercel.json`](vercel.json) with `cd .. && npm install`. Vercel applies it when the project root is `site`.
4. **Build Command** defaults to `npm run build` (Next.js) inside `site/`.
5. Framework: Next.js (auto-detected).
6. Add the environment variables above in the project settings.
7. Deploy.

**Option B:** Leave the Vercel **Root Directory** at the repository root (`.`). The repo root [`vercel.json`](../vercel.json) sets `buildCommand` to `npm run build:site` so only the Next app builds.

No Docker or database is required for this app.
