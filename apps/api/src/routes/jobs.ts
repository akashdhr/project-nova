import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const jobs = await prisma.job.findMany();
  res.json(jobs);
});

router.get('/:id', async (req, res) => {
  const job = await prisma.job.findUnique({ where: { id: req.params.id } });
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

export default router;
