import axios from 'axios';

// 1. Get the URL from the environment, or default to localhost
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// 2. Safely ensure /api/v1 is appended exactly once
// (This prevents it from becoming /api/v1/api/v1 if you already added it in Vercel)
const finalBaseUrl = rawUrl.endsWith('/api/v1') 
  ? rawUrl 
  : `${rawUrl.replace(/\/$/, '')}/api/v1`;

const apiClient = axios.create({
  baseURL: finalBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;