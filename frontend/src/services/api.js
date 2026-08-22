import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

const baseURL = import.meta.env?.VITE_API_BASE_URL || API_BASE_URL || '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(STORAGE_KEYS?.TOKEN || 'dayflow_token') ||
      localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthenticated status
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Clear stored credentials if unauthorized
    }
    return Promise.reject(error);
  }
);

export default api;
