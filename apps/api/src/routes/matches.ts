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
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/', authMiddleware, async (req: any, res) => {
  // If we don't have matches, generate demo matches on the fly from demo jobs
  let matches = await prisma.match.findMany({
    where: { userId: req.user.userId },
    include: { job: true }
  });

  if (matches.length === 0) {
    const jobs = await prisma.job.findMany({ take: 5 });
    const scores = [95, 92, 89, 84, 78];
    for (let i = 0; i < jobs.length; i++) {
      const match = await prisma.match.create({
        data: {
          userId: req.user.userId,
          jobId: jobs[i].id,
          score: scores[i] || 75,
          reasons: ['Strong experience in relevant tech', 'Matches location preference'],
          gaps: ['Slightly lower years of experience']
        },
        include: { job: true }
      });
      matches.push(match);
    }
  }
  res.json(matches);
});

export default router;
