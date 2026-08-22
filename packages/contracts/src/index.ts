export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  targetRoles: string[];
  industries: string[];
  locations: string[];
  workMode: 'remote' | 'hybrid' | 'onsite' | 'any';
  compensation?: string;
  careerPriorities: string[];
  dealBreakers: string[];
  resumeUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: string;
  employmentType: string;
  salary?: string;
  description: string;
  requiredSkills: string[];
  applicationUrl?: string;
  createdAt: Date;
}

export interface Match {
  id: string;
  userId: string;
  jobId: string;
  score: number;
  reasons: string[];
  gaps: string[];
  job?: Job;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  savedAt: Date;
  job?: Job;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  appliedAt: Date;
  job?: Job;
}
