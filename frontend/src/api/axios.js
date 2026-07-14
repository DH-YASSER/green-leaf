import axios from 'axios';
import { handleMockRequest } from './mockApi';
import { handleFirebaseRequest } from './firebaseApi';

const DATA_MODE = import.meta.env.VITE_DATA_MODE || 'firebase';
const USE_MOCK = DATA_MODE === 'mock';
const USE_FIREBASE = DATA_MODE === 'firebase';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
});

// Firebase/local demo adapter. This lets the Firebase branch run without Laravel.
if (USE_FIREBASE || USE_MOCK) {
  axiosInstance.defaults.adapter = async (config) => {
    try {
      const response = USE_FIREBASE
        ? await handleFirebaseRequest(config)
        : await handleMockRequest(config);

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
          status: error.response?.status || error.status || 500,
          data: error.response?.data || { message: error.message || 'Internal Server Error' }
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
