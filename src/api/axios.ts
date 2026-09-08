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

let isRefreshing = false;

// Queue now stores request resolvers instead of plain promises
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

const attachRefreshInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If the refresh route itself failed, clear queue and reject
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If token refresh is already in progress, queue subsequent requests
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => instance(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Call token refresh endpoint (ensure cookies are sent)
          await apiUMS.post('/auth/refresh-token', {}, { withCredentials: true });
          
          processQueue(null);
          
          // Retry original failed request
          return instance(originalRequest);
        } catch (refreshError: any) {
          processQueue(refreshError);

          // REDIRECT ONLY IF BACKEND EXPLICITLY RETURNED 401 OR 403 ON REFRESH
          // (Do not log out on network loss or 500 server errors)
          if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
            window.location.href = '/login';
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

attachRefreshInterceptor(apiUMS);
attachRefreshInterceptor(apiInnotter);