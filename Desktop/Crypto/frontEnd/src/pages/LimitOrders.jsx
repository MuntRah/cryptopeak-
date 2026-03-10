import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { limitOrderService } from '../services/limitOrderService'
import { useCurrency } from '../context/CurrencyContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import { Clock, X, CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'

const LimitOrders = () => {
  const { formatPrice } = useCurrency()
  const { isDarkMode } = useTheme()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('pending') // pending, all

  const { data: orders, isLoading } = useQuery({
    queryKey: ['limitOrders', activeTab],
    queryFn: () => activeTab === 'pending' 
      ? limitOrderService.getPendingOrders().then(res => res.data)
      : limitOrderService.getUserOrders().then(res => res.data),
    refetchInterval: 10000 // Refresh every 10 seconds
  })

  const cancelMutation = useMutation({
    mutationFn: (orderId) => limitOrderService.cancelOrder(orderId),
    onSuccess: () => {
      toast.success('Order cancelled successfully')
      queryClient.invalidateQueries(['limitOrders'])
      queryClient.invalidateQueries(['user'])
    },
    onError: (error) => {
      toast.error(error.response?.data || 'Failed to cancel order')
    }
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'FILLED':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'EXPIRED':
        return <AlertCircle className="w-5 h-5 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
      case 'FILLED':
        return isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800'
      case 'EXPIRED':
        return isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
      default:
        return ''
    }
  }

  const getPriceComparison = (order) => {
    if (!order.currentPrice || order.status !== 'PENDING') return null
    
    const diff = order.currentPrice - order.limitPrice
    const diffPercent = (diff / order.limitPrice) * 100

    if (order.orderType === 'BUY') {
      if (order.currentPrice <= order.limitPrice) {
        return { text: 'Ready to execute', color: 'text-green-600', icon: <TrendingDown className="w-4 h-4" /> }
      } else {
        return { text: `${diffPercent.toFixed(2)}% above limit`, color: 'text-red-600', icon: <TrendingUp className="w-4 h-4" /> }
      }
    } else {
      if (order.currentPrice >= order.limitPrice) {
        return { text: 'Ready to execute', color: 'text-green-600', icon: <TrendingUp className="w-4 h-4" /> }
      } else {
        return { text: `${Math.abs(diffPercent).toFixed(2)}% below limit`, color: 'text-red-600', icon: <TrendingDown className="w-4 h-4" /> }
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Limit Orders</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'pending'
              ? 'bg-blue-600 text-white'
              : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          }`}
        >
          Pending Orders
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white'
              : `${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
          }`}
        >
          All Orders
        </button>
      </div>

      {/* Orders List */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
        <div className="p-6">
          {isLoading ? (
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading orders...</p>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const priceComp = getPriceComparison(order)
                return (
                  <div
                    key={order.id}
                    className={`p-4 border rounded-lg ${
                      isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(order.status)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                {order.cryptoName}
                              </h3>
                              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {order.cryptoSymbol}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                order.orderType === 'BUY' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {order.orderType}
                              </span>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Limit Price</p>
                            <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                              {formatPrice(order.limitPrice)}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Quantity</p>
                            <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                              {order.quantity.toFixed(8)}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Total Amount</p>
                            <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                              {formatPrice(order.totalAmount)}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Status</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        {order.currentPrice && order.status === 'PENDING' && (
                          <div className="mt-3 flex items-center space-x-4">
                            <div>
                              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Current Price</p>
                              <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                {formatPrice(order.currentPrice)}
                              </p>
                            </div>
                            {priceComp && (
                              <div className={`flex items-center space-x-1 text-sm ${priceComp.color}`}>
                                {priceComp.icon}
                                <span>{priceComp.text}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {order.expiryDate && order.status === 'PENDING' && (
                          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Expires: {new Date(order.expiryDate).toLocaleString()}
                          </p>
                        )}

                        {order.filledDate && (
                          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Filled: {new Date(order.filledDate).toLocaleString()}
                          </p>
                        )}
                      </div>

                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => cancelMutation.mutate(order.id)}
                          disabled={cancelMutation.isPending}
                          className={`ml-4 p-2 rounded-md transition-colors ${
                            isDarkMode
                              ? 'hover:bg-red-900/30 text-red-400'
                              : 'hover:bg-red-50 text-red-600'
                          } disabled:opacity-50`}
                          title="Cancel Order"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {activeTab === 'pending' ? 'No pending orders' : 'No orders yet'}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                Create a limit order from the Trading page
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LimitOrders
