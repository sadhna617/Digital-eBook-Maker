import axios from 'axios';

// Base URLs (replace with your actual ones)
const SPRING_BOOT_BASE_URL = 'http://localhost:8081';
const DOTNET_BASE_URL = 'http://localhost:5261';

// Create axios instance with JWT interceptor
const api = axios.create({
  baseURL: SPRING_BOOT_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken'); // Assumes token is stored after .NET login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper functions
export const fetchDashboardStats = () => api.get('/user/dashboard/stats');
export const fetchRecentEbooks = () => api.get('/ebooks/recent');
export const logoutUser = () => {
  // Call .NET logout endpoint if needed
  return axios.post(`${DOTNET_BASE_URL}/logout`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
  }).then(() => {
    localStorage.removeItem('jwtToken');
    window.location.href = '/login'; // Redirect to login page
  });
};




