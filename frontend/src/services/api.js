import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  getMe: () => api.get('/auth/me'),
};

export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductDetails: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
};

export const cartAPI = {
  getCart: () => api.get('/cart/'),
  addToCart: (data) => api.post('/cart/add', data),
  updateCart: (id, quantity) => api.put(`/cart/update/${id}`, { quantity }),
  removeFromCart: (id) => api.delete(`/cart/remove/${id}`),
};

export const orderAPI = {
  checkout: (data) => api.post('/orders/checkout', data),
  getOrders: () => api.get('/orders/'),
  getOrderDetail: (id) => api.get(`/orders/${id}`),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  // Add more as needed...
  getProducts: () => api.get('/products/'), // Reuse or separate
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  addProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  getAllOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, status) => api.patch(`/admin/orders/${id}`, { status }),
};

export default api;
