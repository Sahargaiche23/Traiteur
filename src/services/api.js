import axios from 'axios'

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_URL = `${API_BASE}/api`

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ============ DISHES ============
export const dishesApi = {
  getAll: (params = {}) => api.get('/dishes', { params }),
  getById: (id) => api.get(`/dishes/${id}`),
  create: (data) => api.post('/dishes', data),
  update: (id, data) => api.put(`/dishes/${id}`, data),
  delete: (id) => api.delete(`/dishes/${id}`),
}

// ============ CATEGORIES ============
export const categoriesApi = {
  getAll: () => api.get('/categories'),
}

// ============ ORDERS ============
export const ordersApi = {
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
}

// ============ POSTS ============
export const postsApi = {
  getAll: () => api.get('/posts'),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  like: (id) => api.post(`/posts/${id}/like`),
  addComment: (id, data) => api.post(`/posts/${id}/comments`, data),
}

// ============ CUSTOMERS ============
export const customersApi = {
  getAll: () => api.get('/customers'),
  create: (data) => api.post('/customers', data),
}

// ============ SETTINGS ============
export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
}

// ============ AUTH ============
export const authApi = {
  adminLogin: (email, password) => api.post('/auth/admin/login', { email, password }),
  adminRegister: (data) => api.post('/auth/admin/register', data),
}

// ============ STATS ============
export const statsApi = {
  get: () => api.get('/stats'),
}

export default api
