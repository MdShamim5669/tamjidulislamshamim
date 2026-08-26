import axios from 'axios';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://animated-portfolio-server.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Automatic Auth & Content-Type Interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      const key = localStorage.getItem('admin_cv_key');

      if (token && token.startsWith('eyJ')) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (key) {
        config.headers['x-admin-key'] = key;
      }
    }

    // When uploading FormData (multipart/form-data), remove Content-Type so browser sets boundary automatically
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for global handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

