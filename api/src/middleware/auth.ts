import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  discordId?: string;
}

export function validateDiscordId(req: AuthRequest, res: Response, next: NextFunction) {
  const discordId = req.body.discordId || req.query.discordId;

  if (!discordId) {
    return res.status(401).json({ error: 'Discord ID is required' });
  }

  req.discordId = discordId;
  next();
}

