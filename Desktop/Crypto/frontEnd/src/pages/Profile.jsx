import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { useTheme } from '../context/ThemeContext'
import { useQuery } from '@tanstack/react-query'
import { cryptoService } from '../services/cryptoService'
import toast from 'react-hot-toast'
import api from '../services/api'
import { User, Mail, Shield, TrendingUp, Globe, Moon, Sun } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()
  const { currency, setCurrency, formatPrice } = useCurrency()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const { data: weeklyReport } = useQuery({
    queryKey: ['weeklyReport'],
    queryFn: () => cryptoService.getWeeklyReport().then(res => res.data),
    retry: false
  })

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.put('/auth/users/change-password', {
        oldPass: oldPassword,
        newPass: newPassword
      })
      toast.success('Password changed successfully!')
      setOldPassword('')
      setNewPassword('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency)
    toast.success(`Currency changed to ${newCurrency}`)
  }

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD' }
  ]

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Username</p>
                <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{user?.userName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{user?.emailAddress}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account Balance</p>
                <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{formatPrice(user?.balance)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
            <Globe className="w-5 h-5 mr-2" />
            Currency Preference
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            Select your preferred currency for displaying prices
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {currencies.map((curr) => (
              <button
                key={curr.code}
                onClick={() => handleCurrencyChange(curr.code)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  currency === curr.code
                    ? `border-blue-500 ${isDarkMode ? 'bg-blue-600/20 hover:bg-blue-600/30' : 'bg-blue-50 hover:bg-blue-100'}`
                    : `${isDarkMode ? 'border-gray-600 hover:border-blue-500 bg-gray-700/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-semibold ${currency === curr.code && isDarkMode ? 'text-blue-400' : isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{curr.code}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{curr.name}</p>
                  </div>
                  <span className={`text-2xl ${currency === curr.code && isDarkMode ? 'text-blue-400' : ''}`}>{curr.symbol}</span>
                </div>
              </button>
            ))}
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'} mt-4`}>
            Note: All transactions are processed in USD. Prices are converted for display only.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
            {isDarkMode ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
            Appearance
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            Choose your preferred theme
          </p>
          <div className={`flex items-center justify-between p-4 border-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg`}>
            <div className="flex items-center space-x-3">
              {isDarkMode ? (
                <Moon className="w-6 h-6 text-blue-600" />
              ) : (
                <Sun className="w-6 h-6 text-yellow-500" />
              )}
              <div>
                <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isDarkMode ? 'Easy on the eyes' : 'Bright and clear'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4 flex items-center`}>
            <Shield className="w-5 h-5 mr-2" />
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {weeklyReport && (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Trading Sensei Weekly Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Trades</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{weeklyReport.totalTrades}</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Profitable Trades</p>
              <p className="text-2xl font-bold text-green-600">{weeklyReport.profitableTrades}</p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Win Rate</p>
              <p className="text-2xl font-bold text-purple-600">{weeklyReport.winRate?.toFixed(1)}%</p>
            </div>
          </div>
          {weeklyReport.recommendations && (
            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Recommendations:</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-1`}>{weeklyReport.recommendations}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Profile
