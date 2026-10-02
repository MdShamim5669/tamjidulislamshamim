import axios from 'axios';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://animated-portfolio-server-1.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds to safely handle Render cold-start without dropping connection
});

// Automatic Auth & Dynamic BaseURL Interceptor
api.interceptors.request.use(
  (config) => {
    config.baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://animated-portfolio-server-1.onrender.com/api';

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      const key = localStorage.getItem('admin_cv_key') || 'samim5669';

      // Always attach x-admin-key as standard fallback for admin routes
      if (key) {
        config.headers['x-admin-key'] = key;
      }

      // Attach JWT token if valid
      if (token && token.startsWith('eyJ')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      config.headers['x-admin-key'] = 'samim5669';
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

// Automatic Retry Interceptor: handles Render cold-starts (timeouts/502/503/network drops) & 401 token invalidation
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || (config._retryCount && config._retryCount >= 2)) {
      return Promise.reject(error);
    }

    // If 401 Unauthorized: Stale JWT expired, clear it and retry using master key
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentToken = localStorage.getItem('admin_token');
      if (currentToken) {
        localStorage.removeItem('admin_token');
        if (config.headers) {
          delete config.headers.Authorization;
          config.headers['x-admin-key'] = localStorage.getItem('admin_cv_key') || 'samim5669';
        }
        config._retryCount = (config._retryCount || 0) + 1;
        return api(config);
      }
    }

    // Check for transient network error or server wake-up delay
    const isColdStartOrNetworkError =
      error.message === 'Network Error' ||
      error.code === 'ECONNABORTED' ||
      (error.response && [502, 503, 504].includes(error.response.status));

    if (isColdStartOrNetworkError) {
      config._retryCount = (config._retryCount || 0) + 1;
      // Wait 2.5s for Render container to finish waking up, then retry
      await new Promise((resolve) => setTimeout(resolve, 2500));
      return api(config);
    }

    return Promise.reject(error);
  }
);

/**
 * Silently warms up the Render backend in the background.
 */
export const warmUpBackend = () => {
  if (typeof window !== 'undefined') {
    api.get('/health').catch(() => {});
  }
};

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
    const backendOrigin = (process.env.NEXT_PUBLIC_API_URL || 'https://animated-portfolio-server-1.onrender.com/api').replace(/\/api\/?$/, '');
    return `${backendOrigin}${trimmed}`;
  }
  
  return trimmed;
};


