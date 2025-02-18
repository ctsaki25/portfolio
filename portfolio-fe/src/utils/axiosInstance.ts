import axios from 'axios';
import { API_URL_V1 } from '../config/api';

const axiosInstance = axios.create({
  baseURL: API_URL_V1,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
