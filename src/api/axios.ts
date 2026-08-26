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
        originalRequest._retry = true;

        try {
          // Trigger token renewal using your exact endpoint
          await apiUMS.post('/auth/refresh-token');

          // Retry the original request with renewed cookies
          return instance(originalRequest);
        } catch (refreshError) {
          // If Refresh Token is expired/invalid, redirect to login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors
attachRefreshInterceptor(apiUMS);
attachRefreshInterceptor(apiInnotter);