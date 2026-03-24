# VelocityDrop Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL (or use Docker Compose)
- Discord Bot Token and Application ID

## Initial Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**

Create `.env` files in each package directory:

**Root `.env`:**
```env
DATABASE_URL=postgresql://velocitydrop:velocitydrop@localhost:5432/velocitydrop
```

**`bot/.env`:**
```env
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here
DISCORD_GUILD_ID=your_guild_id_here  # Optional, for faster command registration
API_BASE_URL=http://localhost:3001
```

**`api/.env`:**
```env
DATABASE_URL=postgresql://velocitydrop:velocitydrop@localhost:5432/velocitydrop
API_PORT=3001
RESOURCE_POOL_CPU_CORES=4
RESOURCE_POOL_RAM_GB=8
RESOURCE_POOL_DISK_GB=100
VALHEIM_SERVER_PORT_START=2456
VALHEIM_SERVER_PASSWORD=changeme
```

3. **Start PostgreSQL database:**
```bash
docker-compose up -d postgres
```

4. **Set up database:**
```bash
cd prisma
npx prisma generate
npx prisma migrate dev --name init
```

5. **Initialize resource pool:**
The resource pool will be automatically initialized when the API starts, but you can also do it manually by making a request to `/api/admin/resources`.

## Running the Application

### Development Mode

Start all services:
```bash
npm run dev
```

This will start:
- Discord bot (watches for changes)
- API server on port 3001
- Web dashboard on port 3002

### Individual Services

**Discord Bot:**
```bash
cd bot
npm run dev
```

**API Server:**
```bash
cd api
npm run dev
```

**Web Dashboard:**
```bash
cd web
npm run dev
```

## Discord Bot Setup

1. Go to https://discord.com/developers/applications
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token
5. Go to "OAuth2" > "URL Generator"
6. Select scopes: `bot`, `applications.commands`
7. Select bot permissions: `Send Messages`, `Use Slash Commands`
8. Copy the generated URL and invite the bot to your server
9. Add the bot token and client ID to `bot/.env`

## Testing

1. **Create a server:**
   - Use Discord: `/server create name:MyServer game:valheim`
   - Or API: `POST /api/servers` with `{ "discordId": "your_id", "name": "MyServer", "gameType": "valheim" }`

2. **Add tokens (admin):**
   - Use Discord: `/admin tokens user:@user amount:10`
   - Or API: `POST /api/admin/tokens` with `{ "discordId": "user_id", "amount": 10 }`

3. **Start server:**
   - Use Discord: `/server start name:MyServer`
   - Or API: `POST /api/servers/{id}/start` with `{ "discordId": "your_id" }`

4. **Check status:**
   - Use Discord: `/server status name:MyServer`
   - Or API: `GET /api/servers/{id}/status?discordId=your_id`

5. **Stop server:**
   - Use Discord: `/server stop name:MyServer`
   - Or API: `POST /api/servers/{id}/stop` with `{ "discordId": "your_id" }`

## Web Dashboard

1. Open http://localhost:3002
2. Enter your Discord ID when prompted
3. View your servers and token balance
4. Start/stop servers from the web interface

## Admin Dashboard

1. Open http://localhost:3002/admin
2. View resource pool status
3. View all servers across all users

## Troubleshooting

### Bot commands not appearing
- Make sure the bot is invited with `applications.commands` scope
- Wait a few minutes for global commands to propagate, or use `DISCORD_GUILD_ID` for instant guild commands
- Check bot logs for registration errors

### Database connection errors
- Ensure PostgreSQL is running: `docker-compose ps`
- Check `DATABASE_URL` in your `.env` files
- Verify database exists: `docker-compose exec postgres psql -U velocitydrop -d velocitydrop`

### Docker container errors
- Ensure Docker is running
- Check Docker permissions
- Verify port availability (Valheim uses ports 2456-2457 UDP)

### Resource allocation errors
- Check resource pool: `GET /api/admin/resources`
- Ensure you have enough CPU/RAM/disk available
- Adjust `RESOURCE_POOL_*` environment variables if needed

## Production Deployment

For production deployment:

1. Use environment-specific `.env` files
2. Set up proper database (managed PostgreSQL service)
3. Configure reverse proxy (nginx) for API and web
4. Use process manager (PM2) for bot and API
5. Set up monitoring and logging
6. Configure SSL certificates
7. Set up external Docker host for game servers
8. Implement proper authentication for web dashboard

