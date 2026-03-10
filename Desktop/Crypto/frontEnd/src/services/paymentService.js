import api from './api'

export const paymentService = {
  createDeposit: (amount, currency = 'USD') => 
    api.post('/api/payments/deposit', { amount, currency }),
  getDeposits: () => api.get('/api/payments/deposits'),
  getDepositById: (id) => api.get(`/api/payments/deposits/${id}`),
  resetBalance: () => api.post('/api/payments/reset-balance')
}
