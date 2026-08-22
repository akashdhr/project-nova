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

// Dummy resume upload endpoint
router.post('/', authMiddleware, async (req: any, res) => {
  // In a real implementation this would handle multipart/form-data
  const profile = await prisma.profile.update({
    where: { userId: req.user.userId },
    data: { resumeUrl: 'mock-s3-url.pdf' }
  });
  res.json({ success: true, profile });
});

export default router;
