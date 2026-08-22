import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import jobsRoutes from './routes/jobs';
import matchesRoutes from './routes/matches';
import savedJobsRoutes from './routes/saved-jobs';
import applicationsRoutes from './routes/applications';
import resumeRoutes from './routes/resume';

dotenv.config({ path: '../../.env' });

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/jobs', jobsRoutes);
app.use('/matches', matchesRoutes);
app.use('/saved', savedJobsRoutes);
app.use('/applications', applicationsRoutes);
app.use('/resume', resumeRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', brand: process.env.APP_NAME || 'Talvion' });
});

app.listen(port, () => {
  console.log(`[Backend] Talvion API running on port ${port}`);
});
