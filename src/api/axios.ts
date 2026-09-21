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

const AUTH_ENDPOINTS_SKIP_REFRESH = ['/auth/refresh-token', '/auth/login', '/auth/signup'];

const attachRefreshInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (AUTH_ENDPOINTS_SKIP_REFRESH.some((path) => originalRequest.url?.includes(path))) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => instance(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          await apiUMS.post('/auth/refresh-token', {}, { withCredentials: true });
          processQueue(null);
          return instance(originalRequest);
        } catch (refreshError: any) {
          processQueue(refreshError);

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