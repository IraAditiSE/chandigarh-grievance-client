import axios from 'axios';

const apiClient = axios.create({
  // It will look for an environment variable first, then fallback to localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;