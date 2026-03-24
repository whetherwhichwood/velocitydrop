import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { validateDiscordId, AuthRequest } from '../middleware/auth';

export default function tokenRoutes(prisma: PrismaClient) {
  const router = Router();

  // Get token balance
  router.get('/balance', validateDiscordId, async (req: AuthRequest, res) => {
    try {
      const discordId = req.discordId!;

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

      res.json({ balance: user.tokenBalance });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

