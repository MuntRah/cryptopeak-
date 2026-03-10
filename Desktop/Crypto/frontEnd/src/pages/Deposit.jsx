import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentService } from '../services/paymentService'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import { CreditCard, Clock, RotateCcw } from 'lucide-react'

const Deposit = () => {
  const { refreshUser } = useAuth()
  const { formatPrice, getCurrencySymbol, currency, convertToUSD } = useCurrency()
  const { isDarkMode } = useTheme()
  const queryClient = useQueryClient()
  const [amount, setAmount] = useState('')

  const { data: deposits, isLoading } = useQuery({
    queryKey: ['deposits'],
    queryFn: () => paymentService.getDeposits().then(res => res.data)
  })

  const depositMutation = useMutation({
    mutationFn: ({ amount }) => {
      // Convert from user's currency to USD before sending to backend
      const amountInUSD = convertToUSD(amount)
      return paymentService.createDeposit(amountInUSD, 'USD')
    },
    onSuccess: () => {
      toast.success('Deposit successful!')
      queryClient.invalidateQueries(['deposits'])
      refreshUser()
      setAmount('')
    },
    onError: (error) => {
      toast.error(error.response?.data || 'Deposit failed')
    }
  })

  const resetBalanceMutation = useMutation({
    mutationFn: () => paymentService.resetBalance(),
    onSuccess: () => {
      toast.success('Balance reset to $0')
      refreshUser()
    },
    onError: (error) => {
      toast.error(error.response?.data || 'Reset failed')
    }
  })

  const handleDeposit = () => {
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    depositMutation.mutate({ amount: parseFloat(amount) })
  }

  const handleResetBalance = () => {
    if (window.confirm('Are you sure you want to reset your balance to $0? This action cannot be undone.')) {
      resetBalanceMutation.mutate()
    }
  }

  const quickAmounts = [100, 500, 1000, 5000]

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Deposit Funds</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Add Funds</h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Amount ({currency})</label>
              <div className="relative">
                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-lg ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {getCurrencySymbol()}
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {getCurrencySymbol()}{amt}
                </button>
              ))}
            </div>

            <button
              onClick={handleDeposit}
              disabled={depositMutation.isPending}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {depositMutation.isPending ? 'Processing...' : 'Deposit Funds'}
            </button>

            <button
              onClick={handleResetBalance}
              disabled={resetBalanceMutation.isPending}
              className={`w-full flex items-center justify-center py-2 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 ${
                isDarkMode 
                  ? 'border-red-700 text-red-400 bg-gray-800 hover:bg-red-900/20' 
                  : 'border-red-300 text-red-700 bg-white hover:bg-red-50'
              }`}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {resetBalanceMutation.isPending ? 'Resetting...' : 'Reset Balance to $0'}
            </button>

            <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              This is a virtual deposit for demo purposes. No real payment will be processed.
            </p>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Deposit History</h2>
          {isLoading ? (
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading...</p>
          ) : deposits?.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {deposits.map((deposit) => (
                <div key={deposit.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                  isDarkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
                    }`}>
                      <span className="text-lg font-bold text-green-600">{getCurrencySymbol()}</span>
                    </div>
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{formatPrice(deposit.amount)}</p>
                      <div className={`flex items-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(deposit.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      deposit.status === 'COMPLETED' 
                        ? `${isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'}` 
                        : `${isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'}`
                    }`}>
                      {deposit.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No deposits yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Deposit
