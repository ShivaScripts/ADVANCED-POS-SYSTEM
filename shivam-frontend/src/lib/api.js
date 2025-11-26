import axios from 'axios';

// Get the base URL from your environment, or default it
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// This is the magic part:
// An "interceptor" that adds the auth token to *every* request
// sent with this 'api' instance.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;