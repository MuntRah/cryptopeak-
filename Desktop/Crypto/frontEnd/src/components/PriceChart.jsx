import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useCurrency } from '../context/CurrencyContext'
import { useTheme } from '../context/ThemeContext'
import api from '../services/api'

const PriceChart = ({ cryptoId }) => {
  const [days, setDays] = useState(7)
  const { formatPrice, getCurrencySymbol, convertPrice } = useCurrency()
  const { isDarkMode } = useTheme()
  
  const { data: historyData, isLoading, error } = useQuery({
    queryKey: ['cryptoHistory', cryptoId, days],
    queryFn: () => {
      console.log('Fetching history for crypto ID:', cryptoId, 'days:', days)
      return api.get(`/api/history/${cryptoId}?days=${days}`).then(res => res.data)
    },
    enabled: !!cryptoId,
    retry: 1
  })

  const timeframes = [
    { label: '24H', days: 1 },
    { label: '7D', days: 7 },
    { label: '1M', days: 30 },
    { label: '3M', days: 90 },
    { label: '1Y', days: 365 }
  ]

  if (!cryptoId) {
    return (
      <div className={`h-64 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Select a cryptocurrency to view price chart
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`h-64 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Loading chart...
      </div>
    )
  }

  if (error) {
    console.error('Chart error:', error)
    return (
      <div className={`h-64 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Unable to load price chart
      </div>
    )
  }

  if (!historyData || !historyData.prices || historyData.prices.length === 0) {
    return (
      <div className={`h-64 flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        No price data available
      </div>
    )
  }

  const chartData = historyData.prices.map(item => ({
    time: new Date(item.timestamp).toLocaleDateString(),
    price: convertPrice(item.price)
  }))

  const minPrice = Math.min(...historyData.prices.map(p => convertPrice(p.price)))
  const maxPrice = Math.max(...historyData.prices.map(p => convertPrice(p.price)))
  const priceChange = historyData.prices[historyData.prices.length - 1].price - historyData.prices[0].price
  const priceChangePercent = ((priceChange / historyData.prices[0].price) * 100).toFixed(2)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 capitalize">{historyData.cryptoName}</h3>
          <p className="text-sm text-gray-500">{historyData.period} price history</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(historyData.prices[historyData.prices.length - 1].price)}
          </p>
          <p className={`text-sm ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChangePercent}%
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        {timeframes.map((tf) => (
          <button
            key={tf.days}
            onClick={() => setDays(tf.days)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              days === tf.days
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            domain={[minPrice * 0.99, maxPrice * 1.01]}
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
            tickFormatter={(value) => `${getCurrencySymbol()}${value.toFixed(0)}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
            formatter={(value) => [`${getCurrencySymbol()}${value.toFixed(2)}`, 'Price']}
          />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke={priceChange >= 0 ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriceChart
