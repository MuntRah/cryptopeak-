import { useQuery } from '@tanstack/react-query'
import { cryptoService } from '../services/cryptoService'
import { useCurrency } from '../context/CurrencyContext'
import { useTheme } from '../context/ThemeContext'
import { TrendingUp, TrendingDown, Clock } from 'lucide-react'
import PortfolioChart from '../components/PortfolioChart'

const Portfolio = () => {
  const { formatPrice, getCurrencySymbol } = useCurrency()
  const { isDarkMode } = useTheme()
  const { data: holdings, isLoading: holdingsLoading } = useQuery({
    queryKey: ['holdings'],
    queryFn: () => cryptoService.getHoldings().then(res => res.data)
  })

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => cryptoService.getTransactions().then(res => res.data)
  })

  const totalValue = holdings?.reduce((sum, h) => {
    const currentPrice = h.currentPrice || 0
    const quantity = h.quantity || 0
    return sum + (quantity * currentPrice)
  }, 0) || 0

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Portfolio</h1>

      {/* Portfolio Performance Chart */}
      <PortfolioChart />

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Holdings</h2>
        <div className="mb-4">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Portfolio Value</p>
          <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatPrice(totalValue)}</p>
        </div>
        
        {holdingsLoading ? (
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading...</p>
        ) : holdings?.length > 0 ? (
          <div className="space-y-4">
            {holdings.map((holding) => {
              const currentPrice = holding.currentPrice || 0
              const quantity = holding.quantity || 0
              const avgBuyPrice = holding.averageBuyPrice || 0
              const value = quantity * currentPrice
              const profitLoss = value - (avgBuyPrice * quantity)
              const profitLossPercent = avgBuyPrice > 0 ? ((profitLoss / (avgBuyPrice * quantity)) * 100) : 0
              
              return (
                <div key={holding.id} className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">
                        {holding.cryptoSymbol?.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{holding.cryptoName || 'Unknown'}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{quantity.toFixed(8)} {holding.cryptoSymbol?.toUpperCase()}</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Avg Buy: {formatPrice(avgBuyPrice)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{formatPrice(value)}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>@ {formatPrice(currentPrice)}</p>
                    <div className={`flex items-center justify-end text-sm ${
                      profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {profitLoss >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="ml-1">{profitLoss >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No holdings yet. Start trading to build your portfolio!</p>
        )}
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Transaction History</h2>
        {transactionsLoading ? (
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading...</p>
        ) : transactions?.length > 0 ? (
          <div className="space-y-3">
            {transactions.slice(0, 10).map((tx) => {
              const txDate = tx.transactionDate ? new Date(tx.transactionDate) : null
              const isValidDate = txDate && !isNaN(txDate.getTime())
              
              return (
                <div key={tx.id} className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.transactionType === 'BUY' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {tx.transactionType === 'BUY' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {tx.transactionType} {tx.cryptoSymbol?.toUpperCase()}
                      </p>
                      <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Clock className="w-4 h-4 mr-1" />
                        {isValidDate ? txDate.toLocaleString() : 'Date unavailable'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{(tx.quantity || 0).toFixed(8)}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatPrice(tx.totalAmount || 0)}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>@ {formatPrice(tx.pricePerUnit || 0)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No transactions yet</p>
        )}
      </div>
    </div>
  )
}

export default Portfolio
