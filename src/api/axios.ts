import axios, { AxiosInstance } from 'axios';

export const apiUMS = axios.create({
//   baseURL: 'http://ums-service:8000/api',
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export const apiInnotter = axios.create({
//   baseURL: 'http://innotter-service:8002/api',
  baseURL: 'http://localhost:8002',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

/// Track refresh state across all instances
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Helper function to attach refresh interceptor to any Axios instance
const attachRefreshInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Avoid infinite loop if the refresh-token endpoint itself fails
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }

      // Handle expired Access Token (401 Unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If refresh is already in progress, add request to queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => instance(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Trigger token renewal
          await apiUMS.post('/auth/refresh-token');
          
          processQueue(null);
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          
          // Redirect to login ONLY if refresh token request genuinely failed
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors
attachRefreshInterceptor(apiUMS);
attachRefreshInterceptor(apiInnotter);