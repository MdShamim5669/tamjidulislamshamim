import axios from 'axios';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : 'https://animated-portfolio-server.onrender.com/api');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45 seconds to handle Render cold-start without timing out
});

// Automatic Auth & Dynamic BaseURL Interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      config.baseURL = isLocal
        ? 'http://localhost:5000/api'
        : (process.env.NEXT_PUBLIC_API_URL || 'https://animated-portfolio-server.onrender.com/api');

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

export default api;

/**
 * Normalizes any image or asset URL.
 * Automatically resolves relative backend `/uploads/...` paths to backend server host.
 */
export const getAssetUrl = (url?: string | null, fallback: string = '/dark_villain_frames_24fps_high_quality/frame_0001.jpg'): string => {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;
  const trimmed = url.trim();
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }
  
  if (trimmed.startsWith('/uploads')) {
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const backendOrigin = isLocal
      ? 'http://localhost:5000'
      : (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, '') : 'https://animated-portfolio-server.onrender.com');
    return `${backendOrigin}${trimmed}`;
  }
  
  return trimmed;
};


