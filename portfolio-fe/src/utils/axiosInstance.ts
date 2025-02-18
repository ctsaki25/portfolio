import axios from 'axios';
import { API_URL_V1 } from '../config/api';

const axiosInstance = axios.create({
  baseURL: API_URL_V1,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add JWT token
axiosInstance.interceptors.request.use(
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

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
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

export default axiosInstance;
