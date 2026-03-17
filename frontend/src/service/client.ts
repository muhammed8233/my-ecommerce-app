import axios, { type InternalAxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  
  // Skip adding token for registration, verification, or resend endpoints
  const isAuthRoute = config.url?.includes('/auth/register') || 
                      config.url?.includes('/auth/verify') || 
                      config.url?.includes('/auth/resend');

  if (token && config.headers && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Force login on token expiry
    }
    return Promise.reject(error);
  }
);


export default client;
