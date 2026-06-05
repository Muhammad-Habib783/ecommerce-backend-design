import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to every request automatically
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const addProduct = (data) => api.post('/products', data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Auth
export const getMe = () => api.get('/auth/me');
export const saveProfile = (data) => api.post('/auth/profile', data);

export default api;

export const rateProduct = (id, rating) => api.post(`/products/${id}/rate`, { rating });