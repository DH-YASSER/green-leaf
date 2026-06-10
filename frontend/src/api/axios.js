import axios from 'axios';
import { handleMockRequest } from './mockApi';

// Always enable mock data for GitHub Pages deployment and demo purposes
const USE_MOCK = true;

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

// Configure mock adapter if USE_MOCK is enabled
if (USE_MOCK) {
  axiosInstance.defaults.adapter = async (config) => {
    try {
      const response = await handleMockRequest(config);
      return {
        data: response.data,
        status: response.status,
        statusText: 'OK',
        headers: {},
        config: config,
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

// Request interceptor: attach JWT token from localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '#/login'; // Updated for HashRouter
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;