import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    await db.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'UP', database: 'connected' });
  } catch (error: any) {
    // Return the actual error message so we can diagnose
    res.status(503).json({
      status: 'DOWN',
      error: error.message || 'Database connection failed',
    });
  }
});

export default router;