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
  const apps = await prisma.application.findMany({
    where: { userId: req.user.userId },
    include: { job: true }
  });
  res.json(apps);
});

router.post('/', authMiddleware, async (req: any, res) => {
  const { jobId, status } = req.body;
  const application = await prisma.application.create({
    data: { userId: req.user.userId, jobId, status: status || 'Applied' }
  });
  res.json(application);
});

router.patch('/:id', authMiddleware, async (req: any, res) => {
  const application = await prisma.application.update({
    where: { id: req.params.id },
    data: { status: req.body.status }
  });
  res.json(application);
});

export default router;
