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

This repo is an npm **workspace** monorepo. The Next.js app lives under **`site/`** only. Vercel must treat **`site`** as the app root so it uses the **Next.js** builder (not a static “public folder” deploy).

### Required settings

1. Import the GitHub repo in Vercel.
2. **Settings → General → Root Directory** → set to **`site`** (Edit → select `site` → Save). This is required so `next.config.mjs` and `app/` are found and the output is handled as Next.js, not a static site.
3. **Build & Development Settings** → **Framework Preset** should be **Next.js** (usually auto-detected once the root is `site`). **Output Directory** must stay **empty** (default for Next.js). If you previously set `public` or anything custom, clear it.
4. **Install Command** is overridden by [`vercel.json`](vercel.json) in this folder: `cd .. && npm install` so the monorepo root installs all workspaces.
5. **Build Command** can stay the default `npm run build` (runs `next build` in `site/`).
6. Add the environment variables from the table above in **Settings → Environment Variables**.
7. Redeploy.

### If you see: “No Output Directory named public”

That means Vercel is not using the Next.js preset (often because **Root Directory** was the repo root). Set **Root Directory** to **`site`**, clear **Output Directory**, save, and redeploy. Do **not** point output at `site/.next` manually for a standard Next.js app on Vercel.

No Docker or database is required for this app.

### Build log: `npm warn deprecated …`

During `npm install`, you may see deprecation notices for packages such as `rimraf`, `glob`, `inflight`, or `eslint@8`. Those come from **transitive dependencies** (often pulled in by `eslint` / `eslint-config-next`). They are **warnings**, not build failures, and are safe to ignore unless `npm install` exits with a non-zero code. The repo root [`.npmrc`](../.npmrc) turns off `fund` and `audit` summaries to keep CI logs shorter. Fully clearing those warnings usually means upgrading to **Next.js 15+** and **ESLint 9** when you are ready for a larger toolchain bump.
