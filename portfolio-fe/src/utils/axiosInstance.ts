import axios from 'axios';

export const useAxiosInstance = () => {
  const token = localStorage.getItem('token');
  
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  // Add request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Only handle 401/403 for requests that included an Authorization header
      if ((error.response?.status === 401 || error.response?.status === 403) &&
          error.config?.headers?.Authorization) {
        // Only redirect to login if not already on login page
        if (!window.location.pathname.includes('/login')) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
