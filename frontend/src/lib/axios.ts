import axios from 'axios';

// Get the API URL based on the environment
const getApiUrl = () => {
  // Check if we're in production (Vercel)
  if (import.meta.env.PROD) {
    // Replace this with your production backend URL once deployed
    return 'https://your-backend-url.vercel.app/api';
  }
  
  // In development, use the local IP/hostname
  const hostname = window.location.hostname;
  return `http://${hostname}:5000/api`;
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is a network error or the server is down
    if (!error.response) {
      return Promise.reject({
        message: 'Network error - please check your connection',
      });
    }

    // If the error is that the token has expired
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${getApiUrl()}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/signin';
        return Promise.reject({
          message: 'Session expired - please sign in again',
        });
      }
    }

    // Return the error message from the server if available
    return Promise.reject({
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api; 