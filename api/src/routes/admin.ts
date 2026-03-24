import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ResourceManager } from '../services/resource-manager';

export default function adminRoutes(prisma: PrismaClient) {
  const router = Router();
  const resourceManager = new ResourceManager(prisma);

  // Add tokens to user
  router.post('/tokens', async (req, res) => {
    try {
      const { discordId, amount, description } = req.body;

      if (!discordId || !amount) {
        return res.status(400).json({ error: 'discordId and amount are required' });
      }

      let user = await prisma.user.findUnique({
        where: { discordId },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            discordId,
            tokenBalance: 0,
          },
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          tokenBalance: { increment: amount },
        },
      });

      await prisma.tokenTransaction.create({
        data: {
          userId: user.id,
          amount,
          type: 'admin_add',
          description: description || 'Admin token addition',
        },
      });

      res.json({ balance: updatedUser.tokenBalance });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // List all servers
  router.get('/servers', async (req, res) => {
    try {
      const servers = await prisma.gameServer.findMany({
        include: {
          user: true,
          instance: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(servers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get resource pool status
  router.get('/resources', async (req, res) => {
    try {
      const pool = await resourceManager.getResourcePool();
      res.json(pool);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

