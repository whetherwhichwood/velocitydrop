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
2. **Settings → General → Root Directory** → set to **`site`** (Edit → select `site` → Save). This is required so `next.config.mjs` and `app/` are found and the output is handled as Next.js, not a static site. It also ensures Vercel runs **`next build`** in `site/` only, not the monorepo root **`npm run build`** (which compiles the **bot**, **api**, etc.).
3. **Build & Development Settings** → **Framework Preset** should be **Next.js** (usually auto-detected once the root is `site`). **Output Directory** must stay **empty** (default for Next.js). If you previously set `public` or anything custom, clear it.
4. **Install Command** is overridden by [`vercel.json`](vercel.json) in this folder: `cd .. && npm install` so the monorepo root installs all workspaces.
5. **Build Command** can stay the default `npm run build` (runs `next build` in `site/`).
6. Add the environment variables from the table above in **Settings → Environment Variables**.
7. Redeploy.

### If you see: `npm error workspace @velocitydrop/bot` / `tsc` / `Command "npm run build" exited with 2`

Vercel is running the **repository root** `npm run build`, which builds **every** workspace (bot → `tsc`, api, web, …). The marketing deploy must **not** do that.

**Fix:** In Vercel → **Settings → General → Root Directory** → **`site`** → Save → Redeploy.

The repo root [`vercel.json`](../vercel.json) also sets **`buildCommand`** to `npm run build:site` so if the project root is the **repo root** (`.`), the install/build still only produces the Next app. Prefer **Root Directory = `site`** so the Next.js framework preset and output are correct.

### If you see: “No Output Directory named public”

Vercel is treating the deploy like a **static** site (it expects a build output folder named `public`) instead of **Next.js**.

Do **all** of the following:

1. **Settings → Build & Development → Output Directory** → leave **empty** (delete `public` or any custom value if it was set).
2. **Framework Preset** → **Next.js** (not “Other” or “Other static”).
3. **Root Directory** → **`site`** (strongly recommended). The app’s `app/`, `next.config.mjs`, and `public/` live there.
4. Redeploy after saving.

The repo also includes a **root** [`next.config.mjs`](../next.config.mjs) that re-exports the site config so Vercel can detect Next.js when the connected Git root is the monorepo root, plus root [`vercel.json`](../vercel.json) with `"framework": "nextjs"` and `buildCommand: npm run build:site`. If the error persists, **Root Directory = `site`** is the fix that always aligns with Vercel’s Next.js builder.

No Docker or database is required for this app.

### Build log: `npm warn deprecated …`

During `npm install`, npm may print deprecation notices. They are **warnings**, not errors, unless `npm install` exits non-zero. The repo root [`.npmrc`](../.npmrc) turns off `fund` and `audit` summaries. The root [`package.json`](../package.json) uses **`overrides`** so newer **`glob`** and **`rimraf`** are used, which removes most old `glob` / `rimraf` / `inflight` noise. You may still see a few lines for **`eslint@8`** and `@humanwhocodes/*` until **`eslint-config-next`** moves to **ESLint 9** (typically when you upgrade to **Next.js 15+**).
