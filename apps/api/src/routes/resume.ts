import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const upload = multer({ storage: multer.memoryStorage() });

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

// Resume upload endpoint with consent enforcement
router.post('/', authMiddleware, upload.single('resume'), async (req: any, res) => {
  // Enforce consent in the backend
  const { termsVersion, privacyPolicyVersion } = req.body;
  
  if (!termsVersion || !privacyPolicyVersion) {
    return res.status(400).json({ error: 'Missing legal consent' });
  }

  try {
    // Record consent
    await prisma.userConsent.create({
      data: {
        userId: req.user.userId,
        termsVersion,
        privacyPolicyVersion
      }
    });

    // Mock processing and update profile
    const profile = await prisma.profile.update({
      where: { userId: req.user.userId },
      data: { resumeUrl: req.file ? req.file.originalname : 'mock-s3-url.pdf' }
    });

    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

export default router;
