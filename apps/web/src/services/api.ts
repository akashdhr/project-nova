import axios from 'axios';
import { API_URL } from '@/config/brand';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authService = {
  login: async (data: any) => api.post('/auth/login', data),
  signup: async (data: any) => api.post('/auth/signup', data),
};

export const profileService = {
  get: async () => api.get('/profile'),
  update: async (data: any) => api.put('/profile', data),
};

export const jobService = {
  getAll: async () => api.get('/jobs'),
  getById: async (id: string) => api.get(`/jobs/${id}`),
};

export const matchService = {
  getMatches: async () => api.get('/matches'),
};

export const savedJobService = {
  get: async () => api.get('/saved'),
  save: async (id: string) => api.post(`/saved/${id}/save`),
  unsave: async (id: string) => api.delete(`/saved/${id}/save`),
};

export const applicationService = {
  get: async () => api.get('/applications'),
  apply: async (data: any) => api.post('/applications', data),
};

export const resumeService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post('/resume', formData);
  }
};

export default api;
