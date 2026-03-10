import api from './api'

export const cryptoService = {
  getTopCryptos: (limit = 10) => api.get(`/api/crypto/top?limit=${limit}`),
  getCryptoById: (id) => api.get(`/api/crypto/${id}`),
  buyCrypto: (cryptoId, quantity) => api.post('/api/trading/buy', { cryptoId, quantity }),
  sellCrypto: (cryptoId, quantity) => api.post('/api/trading/sell', { cryptoId, quantity }),
  getHoldings: () => api.get('/api/trading/holdings'),
  getTransactions: () => api.get('/api/trading/transactions'),
  checkEmotionalState: () => api.get('/api/trading/sensei/check'),
  getWeeklyReport: () => api.get('/api/trading/sensei/weekly-report')
}
