import axios from 'axios';
import { handleMockRequest } from './mockApi';

const USE_MOCK = false;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Mock adapter
if (USE_MOCK) {
  axiosInstance.defaults.adapter = async (config) => {
    try {
      const response = await handleMockRequest(config);

      return {
        data: response.data,
        status: response.status,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      };
    } catch (error) {
      return Promise.reject({
        message: error.message || 'Mock Request Error',
        response: {
          status: error.status || 500,
          data: { message: error.message || 'Internal Server Error' }
        }
      });
    }
  };
}

// Attach token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '#/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;