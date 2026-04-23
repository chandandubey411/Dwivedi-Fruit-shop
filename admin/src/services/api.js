import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const adminInfo = localStorage.getItem('adminInfo');
  if (adminInfo) {
    const { token } = JSON.parse(adminInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
