import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { cryptoService } from '../services/cryptoService'
import { useCurrency } from '../context/CurrencyContext'
import { useTheme } from '../context/ThemeContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

const PortfolioChart = () => {
  const [period, setPeriod] = useState('7d') // 7d, 30d, 90d, 1y, all
  const { formatPrice, convertPrice, getCurrencySymbol } = useCurrency()
  const { isDarkMode } = useTheme()

  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => cryptoService.getTransactions().then(res => res.data)
  })

  const { data: holdings } = useQuery({
    queryKey: ['holdings'],
    queryFn: () => cryptoService.getHoldings().then(res => res.data)
  })

  const chartData = useMemo(() => {
    if (!transactions || !holdings) return null

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case 'all':
        // Find earliest transaction
        if (transactions.length > 0) {
          const dates = transactions.map(tx => new Date(tx.transactionDate))
          startDate = new Date(Math.min(...dates))
        }
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Generate date points
    const datePoints = []
    const currentDate = new Date(startDate)
    const daysDiff = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24))
    const interval = Math.max(1, Math.floor(daysDiff / 30)) // Max 30 points

    while (currentDate <= now) {
      datePoints.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + interval)
    }
    
    // Ensure we have the current date
    if (datePoints[datePoints.length - 1].getTime() !== now.getTime()) {
      datePoints.push(new Date(now))
    }

    // Calculate portfolio value at each date point
    const data = datePoints.map(date => {
      let totalValue = 0
      
      // For each holding, calculate quantity at that date
      holdings.forEach(holding => {
        const relevantTxs = transactions.filter(tx => {
          const txDate = new Date(tx.transactionDate)
          return txDate <= date && tx.cryptoId === holding.cryptoId
        })

        let quantity = 0
        relevantTxs.forEach(tx => {
          if (tx.transactionType === 'BUY') {
            quantity += tx.quantity
          } else {
            quantity -= tx.quantity
          }
        })

        // Use current price (in real app, you'd fetch historical prices)
        totalValue += quantity * (holding.currentPrice || 0)
      })

      return {
        date: date.getTime(),
        dateLabel: period === '7d' || period === '30d' 
          ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          : date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        value: convertPrice(totalValue)
      }
    })

    // Calculate initial investment
    const initialInvestment = transactions
      .filter(tx => tx.transactionType === 'BUY')
      .reduce((sum, tx) => sum + tx.totalAmount, 0)

    return {
      data,
      initialInvestment: convertPrice(initialInvestment)
    }
  }, [transactions, holdings, period, convertPrice])

  const currentValue = chartData?.data[chartData.data.length - 1]?.value || 0
  const initialValue = chartData?.data[0]?.value || 0
  const valueChange = currentValue - initialValue
  const percentChange = initialValue > 0 ? ((valueChange / initialValue) * 100) : 0

  const periods = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
    { value: '1y', label: '1Y' },
    { value: 'all', label: 'ALL' }
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600">{payload[0].payload.dateLabel}</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  if (!chartData || !transactions || transactions.length === 0) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Portfolio Performance</h2>
        <div className="text-center py-12">
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No transaction history available yet.</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>Start trading to see your portfolio performance!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Portfolio Performance</h2>
          <div className="mt-2">
            <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatPrice(currentValue)}</p>
            <div className={`flex items-center text-sm mt-1 ${
              valueChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="font-medium">
                {valueChange >= 0 ? '+' : ''}{formatPrice(valueChange, false)} ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%)
              </span>
              <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {period === '7d' && 'Last 7 days'}
                {period === '30d' && 'Last 30 days'}
                {period === '90d' && 'Last 90 days'}
                {period === '1y' && 'Last year'}
                {period === 'all' && 'All time'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {periods.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === p.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#f0f0f0'} />
            <XAxis 
              dataKey="dateLabel" 
              stroke={isDarkMode ? '#9ca3af' : '#9ca3af'}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke={isDarkMode ? '#9ca3af' : '#9ca3af'}
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${getCurrencySymbol()}${value.toFixed(0)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={`mt-6 grid grid-cols-3 gap-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Initial Investment</p>
          <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            {formatPrice(chartData.initialInvestment)}
          </p>
        </div>
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Value</p>
          <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
            {formatPrice(currentValue)}
          </p>
        </div>
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Return</p>
          <p className={`text-lg font-semibold ${
            valueChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {valueChange >= 0 ? '+' : ''}{formatPrice(valueChange, false)} ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%)
          </p>
        </div>
      </div>
    </div>
  )
}

export default PortfolioChart
