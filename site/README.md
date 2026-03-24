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

1. Push this repository to GitHub (e.g. repo name `velocitydrop`).
2. In Vercel: **Add New Project** → Import the GitHub repository.
3. **Root Directory**: set to `site` (critical for this monorepo).
4. Framework Preset: Next.js (auto-detected).
5. Add the environment variables above in the Vercel project settings.
6. Deploy.

No Docker or database is required for this app.
