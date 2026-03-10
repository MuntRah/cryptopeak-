import { useQuery } from '@tanstack/react-query'
import { cryptoService } from '../services/cryptoService'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { useTheme } from '../context/ThemeContext'
import { TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { formatPrice } = useCurrency()
  const { isDarkMode } = useTheme()
  
  const { data: cryptos, isLoading } = useQuery({
    queryKey: ['topCryptos'],
    queryFn: () => cryptoService.getTopCryptos(5).then(res => res.data)
  })

  const { data: holdings } = useQuery({
    queryKey: ['holdings'],
    queryFn: () => cryptoService.getHoldings().then(res => res.data)
  })

  const { data: senseiCheck } = useQuery({
    queryKey: ['senseiCheck'],
    queryFn: () => cryptoService.checkEmotionalState().then(res => res.data),
    refetchInterval: 60000
  })

  const totalPortfolioValue = holdings?.reduce((sum, h) => sum + (h.quantity * h.currentPrice), 0) || 0

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Available Balance</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatPrice(user?.balance || 0)}</p>
            </div>
            <Wallet className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Portfolio Value</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatPrice(totalPortfolioValue)}</p>
            </div>
            <Activity className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Assets</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatPrice((user?.balance || 0) + totalPortfolioValue)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {senseiCheck?.alertType && (
        <div className={`p-4 rounded-lg ${
          senseiCheck.alertType === 'WARNING' 
            ? `${isDarkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border` 
            : `${isDarkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} border`
        }`}>
          <h3 className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Trading Sensei Alert</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-1`}>{senseiCheck.message}</p>
        </div>
      )}

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
        <div className="p-6">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Top Cryptocurrencies</h2>
          {isLoading ? (
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading...</p>
          ) : (
            <div className="space-y-4">
              {cryptos?.map((crypto) => {
                const price = crypto.currentPrice || crypto.current_price || 0
                const change = crypto.priceChangePercentage24h || crypto.price_change_percentage_24h || 0
                
                return (
                  <div key={crypto.id} className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <div className="flex items-center space-x-4">
                      <img src={crypto.image} alt={crypto.name} className="w-10 h-10" />
                      <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{crypto.name}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{crypto.symbol?.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{formatPrice(price)}</p>
                      <div className={`flex items-center text-sm ${
                        change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="ml-1">{Math.abs(change).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
