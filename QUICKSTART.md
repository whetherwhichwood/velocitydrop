# VelocityDrop Quick Start

Get VelocityDrop running in 5 minutes!

## Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Docker installed and running (`docker ps`)
- [ ] Discord bot token ready

## Setup Steps

1. **Install dependencies:**
```bash
npm run setup
```

2. **Start PostgreSQL:**
```bash
docker-compose up -d postgres
```

3. **Configure environment:**

Create `bot/.env`:
```env
DISCORD_BOT_TOKEN=your_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_guild_id_here
API_BASE_URL=http://localhost:3001
```

Create `api/.env`:
```env
DATABASE_URL=postgresql://velocitydrop:velocitydrop@localhost:5432/velocitydrop
API_PORT=3001
RESOURCE_POOL_CPU_CORES=4
RESOURCE_POOL_RAM_GB=8
RESOURCE_POOL_DISK_GB=100
VALHEIM_SERVER_PORT_START=2456
VALHEIM_SERVER_PASSWORD=changeme
```

4. **Start everything:**
```bash
npm run dev
```

This starts:
- Discord bot (ready for commands)
- API server (http://localhost:3001)
- Web dashboard (http://localhost:3002)

It does **not** start the public marketing site. For that, run in another terminal:

```bash
npm run dev:site
```

Then open http://localhost:3000 (marketing landing page).

## First Steps

1. **Invite bot to Discord:**
   - Go to https://discord.com/developers/applications
   - Your app → OAuth2 → URL Generator
   - Select: `bot`, `applications.commands`
   - Copy URL and open in browser

2. **Add tokens to yourself:**
   ```
   /admin tokens user:@yourself amount:10
   ```

3. **Create your first server:**
   ```
   /server create name:MyValheimServer game:valheim
   ```

4. **Start the server:**
   ```
   /server start name:MyValheimServer
   ```

5. **Check status:**
   ```
   /server status name:MyValheimServer
   ```

## Web Dashboard

1. Open http://localhost:3002
2. Enter your Discord ID
3. View and manage your servers

## Troubleshooting

**Bot not responding?**
- Check `bot/.env` has correct token
- Verify bot is online in Discord
- Check bot logs for errors

**Database errors?**
- Ensure PostgreSQL is running: `docker-compose ps`
- Run migrations: `npm run db:migrate`

**Port conflicts?**
- Change ports in `.env` files
- Update `API_BASE_URL` in `bot/.env`

**Docker errors?**
- Ensure Docker is running
- Check Docker permissions
- Verify ports 2456-2457 are available

## Next Steps

- Read [SETUP.md](./SETUP.md) for detailed configuration
- Check [README.md](./README.md) for architecture overview
- Customize resource limits in `api/.env`

