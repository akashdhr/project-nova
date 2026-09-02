import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/', authMiddleware, async (req: any, res) => {
  const profile = await prisma.profile.findUnique({ where: { userId: req.user.userId } });
  res.json(profile);
});

router.put('/', authMiddleware, async (req: any, res) => {
  const { targetRoles, skills, industries, locations, workMode, compensation, careerPriorities, dealBreakers, avatarUrl, currentRole } = req.body;
  const profile = await prisma.profile.update({
    where: { userId: req.user.userId },
    data: { targetRoles, skills, industries, locations, workMode, compensation, careerPriorities, dealBreakers, avatarUrl, currentRole }
  });
  res.json(profile);
});

export default router;
