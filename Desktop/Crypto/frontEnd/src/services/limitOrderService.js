import api from './api'

export const limitOrderService = {
  createLimitOrder: (orderData) => api.post('/api/limit-orders', orderData),
  getUserOrders: () => api.get('/api/limit-orders'),
  getPendingOrders: () => api.get('/api/limit-orders/pending'),
  cancelOrder: (orderId) => api.put(`/api/limit-orders/${orderId}/cancel`)
}
