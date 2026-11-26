import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../config/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken') || 
                AsyncStorage.getItem('authToken'); // for React Native
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signup: (email, password, firstName, lastName) =>
    apiClient.post('/auth/signup', {
      email,
      password,
      firstName,
      lastName,
    }),

  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  getProfile: () =>
    apiClient.get('/auth/profile'),
};

export default apiClient;
