import axios from 'axios'

const api = axios.create({
  baseURL: '/',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('campusfind_token')
      localStorage.removeItem('campusfind_user')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

// ── Items ─────────────────────────────────────────────────────────────────────
export const itemsAPI = {
  list: (params) => api.get('/items', { params }),
  get: (id) => api.get(`/items/${id}`),
  myItems: () => api.get('/items/my'),
  reportLost: (formData) =>
    api.post('/items/lost', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  reportFound: (formData) =>
    api.post('/items/found', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.patch(`/items/${id}`, data),
}

// ── Matches ───────────────────────────────────────────────────────────────────
export const matchesAPI = {
  list: () => api.get('/matches'),
  get: (id) => api.get(`/matches/${id}`),
  updateStatus: (id, status) => api.patch(`/matches/${id}`, { status }),
}

// ── Claims ────────────────────────────────────────────────────────────────────
export const claimsAPI = {
  submit: (data) => api.post('/claims', data),
  myClaims: () => api.get('/claims/my'),
  get: (id) => api.get(`/claims/${id}`),
}

// ── Notifications ─────────────────────────────────────────────────────────────
export const notificationsAPI = {
  list: () => api.get('/notifications'),
  unreadCount: () => api.get('/notifications/unread-count'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  analytics: () => api.get('/admin/analytics'),
  items: (params) => api.get('/admin/items', { params }),
  updateItem: (id, data) => api.patch(`/admin/items/${id}`, data),
  claims: (params) => api.get('/admin/claims', { params }),
  getClaim: (id) => api.get(`/admin/claims/${id}`),
  reviewClaim: (id, data) => api.patch(`/admin/claims/${id}/review`, data),
  users: () => api.get('/admin/users'),
}

export default api
