import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateDiscordId, AuthRequest } from '../middleware/auth';
import { ServerManager } from '../services/server-manager';

export default function serverRoutes(prisma: PrismaClient) {
  const router = Router();
  const serverManager = new ServerManager(prisma);

  // Create server
  router.post('/', validateDiscordId, async (req: AuthRequest, res) => {
    try {
      const { name, gameType } = req.body;
      const discordId = req.discordId!;

      if (!name || !gameType) {
        return res.status(400).json({ error: 'Name and gameType are required' });
      }

      // Get or create user
      let user = await prisma.user.findUnique({
        where: { discordId },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            discordId,
            username: req.body.username,
          },
        });
      }

      // Create server
      const server = await prisma.gameServer.create({
        data: {
          userId: user.id,
          name,
          gameType,
          status: 'stopped',
        },
      });

      res.json(server);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // List user's servers
  router.get('/', validateDiscordId, async (req: AuthRequest, res) => {
    try {
      const discordId = req.discordId!;

      const user = await prisma.user.findUnique({
        where: { discordId },
      });

      if (!user) {
        return res.json([]);
      }

      const servers = await prisma.gameServer.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      res.json(servers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Start server
  router.post('/:id/start', validateDiscordId, async (req: AuthRequest, res) => {
    try {
      const serverId = req.params.id;
      const discordId = req.discordId!;

      const user = await prisma.user.findUnique({
        where: { discordId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const result = await serverManager.startServer(serverId, user.id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Stop server
  router.post('/:id/stop', validateDiscordId, async (req: AuthRequest, res) => {
    try {
      const serverId = req.params.id;
      const discordId = req.discordId!;

      const user = await prisma.user.findUnique({
        where: { discordId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const result = await serverManager.stopServer(serverId, user.id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get server status
  router.get('/:id/status', validateDiscordId, async (req: AuthRequest, res) => {
    try {
      const serverId = req.params.id;
      const discordId = req.discordId!;

      const user = await prisma.user.findUnique({
        where: { discordId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const server = await prisma.gameServer.findUnique({
        where: { id: serverId },
        include: {
          instance: true,
        },
      });

      if (!server) {
        return res.status(404).json({ error: 'Server not found' });
      }

      if (server.userId !== user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      res.json(server);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

