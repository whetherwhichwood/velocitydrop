import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import serverRoutes from './routes/servers';
import tokenRoutes from './routes/tokens';
import adminRoutes from './routes/admin';

config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/servers', serverRoutes(prisma));
app.use('/api/tokens', tokenRoutes(prisma));
app.use('/api/admin', adminRoutes(prisma));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;

