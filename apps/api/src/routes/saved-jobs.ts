import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/', authMiddleware, async (req: any, res) => {
  const saved = await prisma.savedJob.findMany({
    where: { userId: req.user.userId },
    include: { job: true }
  });
  res.json(saved);
});

router.post('/:id/save', authMiddleware, async (req: any, res) => {
  const saved = await prisma.savedJob.create({
    data: { userId: req.user.userId, jobId: req.params.id }
  });
  res.json(saved);
});

router.delete('/:id/save', authMiddleware, async (req: any, res) => {
  await prisma.savedJob.deleteMany({
    where: { userId: req.user.userId, jobId: req.params.id }
  });
  res.json({ success: true });
});

export default router;
