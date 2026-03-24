# VelocityDrop

Discord bot for on-demand game server management with token-based payment system.

## Features

- 🎮 Spin up game servers on-demand (starting with Valheim)
- 💰 Token-based payment system (no monthly fees)
- 🤖 Discord bot interface with slash commands
- 🌐 Web dashboard for server management
- 📊 Resource pooling and allocation
- 🐳 Docker-based server orchestration

## Project Structure

- `bot/` - Discord bot application
- `api/` - REST API server
- `web/` - Next.js web dashboard (operators)
- `site/` - Public marketing site (Vercel; see [site/README.md](site/README.md))
- `server-manager/` - Game server orchestration
- `prisma/` - Database schema and migrations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up database:
```bash
npm run db:migrate
npm run db:generate
```

4. Start development servers:
```bash
npm run dev
```

## Environment Variables

See `.env.example` for required environment variables.

## Development

- `npm run dev` - Start bot, API, and dashboard (does **not** include the marketing site)
- `npm run dev:site` - Start the public marketing site only
- `npm run build` - Build all packages
- `npm run build:site` - Build only the marketing site
- `npm run db:studio` - Open Prisma Studio

### Local URLs (after you start the matching command)

| What | Command | URL |
|------|---------|-----|
| Marketing site | `npm run dev:site` | http://localhost:3000 |
| Operator dashboard | `npm run dev --workspace=web` (or root `dev` runs it) | http://localhost:3002 |
| REST API | root `npm run dev` | http://localhost:3001 |

**“Unable to connect” in the browser** usually means nothing is listening on that port: start the right script above, or you opened the wrong port (marketing is **3000**, not 3002/3001).

### Vercel (marketing site)

Set the Vercel project **Root Directory** to **`site`** so Vercel runs **`next build`** there only. If the root is left at **`.`**, Vercel would run the monorepo **`npm run build`** (bot `tsc`, api, …) and fail. The root [`vercel.json`](vercel.json) sets **`buildCommand`** to `npm run build:site` as a safety net when the project root is the repo. Details: [site/README.md](site/README.md).

