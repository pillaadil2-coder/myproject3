import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('royalfx_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me')
};

export const tradeAPI = {
  getOpenTrades: () => api.get('/trades/open'),
  getTradeHistory: () => api.get('/trades/history'),
  placeOrder: (data) => api.post('/trades/order', data),
  closeOrder: (id) => api.post(`/trades/close/${id}`),
  updateSlTp: (id, data) => api.put(`/trades/update-sltp/${id}`, data)
};

export const walletAPI = {
  getTransactions: () => api.get('/wallet/transactions'),
  requestDeposit: (formData) => api.post('/wallet/deposit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  requestWithdraw: (data) => api.post('/wallet/withdraw', data)
};

export const kycAPI = {
  getStatus: () => api.get('/kyc/status'),
  submitKyc: (formData) => api.post('/kyc/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export const marketAPI = {
  getInstruments: () => api.get('/market/instruments'),
  getQuote: (symbol) => api.get(`/market/quote/${encodeURIComponent(symbol)}`)
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getTraders: () => api.get('/admin/traders'),
  adjustBalance: (data) => api.post('/admin/traders/adjust-balance', data),
  updateLeverage: (data) => api.post('/admin/traders/leverage', data),
  getTransactions: (params) => api.get('/admin/transactions', { params }),
  approveDeposit: (id) => api.post(`/admin/deposit/${id}/approve`),
  rejectDeposit: (id, data) => api.post(`/admin/deposit/${id}/reject`, data),
  approveWithdrawal: (id) => api.post(`/admin/withdraw/${id}/approve`),
  rejectWithdrawal: (id, data) => api.post(`/admin/withdraw/${id}/reject`, data),
  getKycList: () => api.get('/admin/kyc/list'),
  updateKycStatus: (userId, data) => api.post(`/admin/kyc/${userId}/status`, data),
  getOpenTrades: () => api.get('/admin/trades/open'),
  forceCloseTrade: (id) => api.post(`/admin/trades/${id}/force-close`)
};

export default api;
