import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cryptoService } from '../services/cryptoService'
import { limitOrderService } from '../services/limitOrderService'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'
import { TrendingUp, TrendingDown, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import PriceChart from '../components/PriceChart'

const Trading = () => {
  const { user, refreshUser } = useAuth()
  const { formatPrice, getCurrencySymbol, convertToUSD, convertPrice } = useCurrency()
  const { isDarkMode } = useTheme()
  const queryClient = useQueryClient()
  const [selectedCrypto, setSelectedCrypto] = useState(null)
  const [quantity, setQuantity] = useState('')
  const [tradeType, setTradeType] = useState('buy')
  const [orderType, setOrderType] = useState('market') // 'market' or 'limit'
  const [limitPrice, setLimitPrice] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('none') // 'none', 'asc', 'desc'

  const { data: cryptos, isLoading: cryptosLoading } = useQuery({
    queryKey: ['topCryptos', 20],
    queryFn: () => cryptoService.getTopCryptos(20).then(res => res.data)
  })

  const { data: holdings, isLoading: holdingsLoading } = useQuery({
    queryKey: ['holdings'],
    queryFn: () => cryptoService.getHoldings().then(res => res.data)
  })

  const buyMutation = useMutation({
    mutationFn: ({ cryptoId, quantity }) => cryptoService.buyCrypto(cryptoId, quantity),
    onSuccess: () => {
      toast.success('Purchase successful!')
      queryClient.invalidateQueries(['holdings'])
      queryClient.invalidateQueries(['topCryptos'])
      refreshUser()
      setQuantity('')
      setSelectedCrypto(null)
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.response?.data || error.message || 'Purchase failed'
      console.error('Buy error:', error)
      toast.error(typeof errorMsg === 'string' ? errorMsg : 'Purchase failed')
    }
  })

  const sellMutation = useMutation({
    mutationFn: ({ cryptoId, quantity }) => cryptoService.sellCrypto(cryptoId, quantity),
    onSuccess: () => {
      toast.success('Sale successful!')
      queryClient.invalidateQueries(['holdings'])
      queryClient.invalidateQueries(['topCryptos'])
      refreshUser()
      setQuantity('')
      setSelectedCrypto(null)
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.response?.data || error.message || 'Sale failed'
      console.error('Sell error:', error)
      toast.error(typeof errorMsg === 'string' ? errorMsg : 'Sale failed')
    }
  })

  const limitOrderMutation = useMutation({
    mutationFn: (orderData) => limitOrderService.createLimitOrder(orderData),
    onSuccess: () => {
      toast.success('Limit order created successfully!')
      queryClient.invalidateQueries(['limitOrders'])
      refreshUser()
      setQuantity('')
      setLimitPrice('')
      setSelectedCrypto(null)
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.response?.data || error.message || 'Failed to create limit order'
      console.error('Limit order error:', error)
      toast.error(typeof errorMsg === 'string' ? errorMsg : 'Failed to create limit order')
    }
  })

  const handleTrade = () => {
    if (!selectedCrypto || !quantity || quantity <= 0) {
      toast.error('Please select a crypto and enter valid quantity')
      return
    }

    if (orderType === 'limit' && (!limitPrice || limitPrice <= 0)) {
      toast.error('Please enter a valid limit price')
      return
    }

    const cryptoId = selectedCrypto.cryptoId || selectedCrypto.id

    if (orderType === 'market') {
      console.log('Selected crypto:', selectedCrypto)
      console.log('Crypto ID being sent:', cryptoId)
      console.log('Quantity:', parseFloat(quantity))

      const mutation = tradeType === 'buy' ? buyMutation : sellMutation
      mutation.mutate({ cryptoId, quantity: parseFloat(quantity) })
    } else {
      // Limit order - convert price from user's currency to USD
      const priceInUSD = convertToUSD(parseFloat(limitPrice))
      
      limitOrderMutation.mutate({
        cryptoId,
        cryptoSymbol: selectedCrypto.cryptoSymbol || selectedCrypto.symbol,
        cryptoName: selectedCrypto.cryptoName || selectedCrypto.name,
        orderType: tradeType.toUpperCase(),
        quantity: parseFloat(quantity),
        limitPrice: priceInUSD
      })
    }
  }

  const handleTradeTypeChange = (type) => {
    setTradeType(type)
    setSelectedCrypto(null)
    setQuantity('')
    setLimitPrice('')
    setSearchQuery('')
    setSortOrder('none')
  }

  const displayList = tradeType === 'buy' ? cryptos : holdings
  const isLoading = tradeType === 'buy' ? cryptosLoading : holdingsLoading

  // Helper functions - defined before useMemo
  const getPrice = (item) => {
    if (tradeType === 'buy') {
      return item.currentPrice || item.current_price || 0
    } else {
      return item.currentPrice || 0
    }
  }

  const getChange = (item) => {
    if (tradeType === 'buy') {
      return item.priceChangePercentage24h || item.price_change_percentage_24h || 0
    } else {
      return item.profitLossPercentage || 0
    }
  }

  // Filter and sort list based on search query and sort order
  const filteredList = useMemo(() => {
    if (!displayList) return []
    
    // First, filter by search query
    let filtered = displayList
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = displayList.filter(item => {
        const name = (item.cryptoName || item.name || '').toLowerCase()
        const symbol = (item.cryptoSymbol || item.symbol || '').toLowerCase()
        return name.includes(query) || symbol.includes(query)
      })
    }

    // Then, sort by price if sort order is set
    if (sortOrder !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        const priceA = getPrice(a)
        const priceB = getPrice(b)
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA
      })
    }

    return filtered
  }, [displayList, searchQuery, sortOrder, tradeType])

  const toggleSortOrder = () => {
    if (sortOrder === 'none') {
      setSortOrder('desc') // Most expensive first
    } else if (sortOrder === 'desc') {
      setSortOrder('asc') // Cheapest first
    } else {
      setSortOrder('none') // Reset to default
    }
  }

  const getSortIcon = () => {
    if (sortOrder === 'desc') return <ArrowDown className="h-4 w-4" />
    if (sortOrder === 'asc') return <ArrowUp className="h-4 w-4" />
    return <ArrowUpDown className="h-4 w-4" />
  }

  const getSortLabel = () => {
    if (sortOrder === 'desc') return 'Most Expensive'
    if (sortOrder === 'asc') return 'Cheapest'
    return 'Sort by Price'
  }

  const totalCost = useMemo(() => {
    if (!selectedCrypto || !quantity) return '0.00'
    
    const qty = parseFloat(quantity || 0)
    if (isNaN(qty)) return '0.00'
    
    if (orderType === 'market') {
      const priceUSD = getPrice(selectedCrypto)
      const priceConverted = convertPrice(priceUSD) // Convert USD to user's currency
      return (priceConverted * qty).toFixed(2)
    } else {
      // For limit orders, use the limit price entered by user (already in user's currency)
      const price = parseFloat(limitPrice || 0)
      if (isNaN(price)) return '0.00'
      return (price * qty).toFixed(2)
    }
  }, [selectedCrypto, quantity, orderType, limitPrice, convertPrice])
  
  const availableQuantity = tradeType === 'sell' && selectedCrypto ? selectedCrypto.quantity : null

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Trading</h1>

      {selectedCrypto && (
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <PriceChart cryptoId={selectedCrypto.cryptoId || selectedCrypto.id} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {tradeType === 'buy' ? 'Available Cryptocurrencies' : 'Your Holdings'}
              </h2>
            </div>
            
            {/* Search and Filter Bar */}
            <div className="mb-4 space-y-3">
              <div className="flex gap-2">
                {/* Search Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className={`h-5 w-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${tradeType === 'buy' ? 'cryptocurrencies' : 'holdings'}...`}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-md leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                
                {/* Sort Button */}
                <button
                  onClick={toggleSortOrder}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                    sortOrder !== 'none'
                      ? `${isDarkMode ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-blue-50 border-blue-500 text-blue-700'}`
                      : `${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`
                  }`}
                >
                  {getSortIcon()}
                  <span className="hidden sm:inline">{getSortLabel()}</span>
                </button>
              </div>
              
              {/* Results Info */}
              {(searchQuery || sortOrder !== 'none') && (
                <div className="flex items-center justify-between text-sm">
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                    {searchQuery && `Found ${filteredList.length} result${filteredList.length !== 1 ? 's' : ''}`}
                    {searchQuery && sortOrder !== 'none' && ' • '}
                    {sortOrder !== 'none' && `Sorted by ${getSortLabel().toLowerCase()}`}
                  </p>
                  {(searchQuery || sortOrder !== 'none') && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSortOrder('none')
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {isLoading ? (
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Loading...</p>
            ) : filteredList && filteredList.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredList.map((item) => {
                  const price = getPrice(item)
                  const change = getChange(item)
                  const itemId = item.cryptoId || item.id
                  const itemName = item.cryptoName || item.name
                  const itemSymbol = item.cryptoSymbol || item.symbol
                  
                  return (
                    <div
                      key={itemId}
                      onClick={() => setSelectedCrypto(item)}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        (selectedCrypto?.cryptoId || selectedCrypto?.id) === itemId 
                          ? `border-blue-500 ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-50'}` 
                          : `${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt={itemName} className="w-10 h-10" onError={(e) => e.target.src = 'https://via.placeholder.com/40'} />
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{itemName}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {itemSymbol?.toUpperCase()}
                            {tradeType === 'sell' && item.quantity && (
                              <span className="ml-2 text-blue-600">• {item.quantity.toFixed(8)} available</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{formatPrice(price)}</p>
                        <div className={`flex items-center text-sm ${
                          change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span className="ml-1">{change >= 0 ? '+' : ''}{Math.abs(change).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-8">
                <Search className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No results found for "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                {tradeType === 'sell' ? 'No holdings to sell. Buy some crypto first!' : 'No cryptocurrencies available'}
              </p>
            )}
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Trade</h2>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <button
                onClick={() => handleTradeTypeChange('buy')}
                className={`flex-1 py-2 px-4 rounded-md font-medium ${
                  tradeType === 'buy' ? 'bg-green-600 text-white' : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => handleTradeTypeChange('sell')}
                className={`flex-1 py-2 px-4 rounded-md font-medium ${
                  tradeType === 'sell' ? 'bg-red-600 text-white' : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
              >
                Sell
              </button>
            </div>

            {/* Order Type Toggle */}
            <div className="flex space-x-2">
              <button
                onClick={() => setOrderType('market')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                  orderType === 'market' 
                    ? `${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}` 
                    : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
              >
                Market
              </button>
              <button
                onClick={() => setOrderType('limit')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                  orderType === 'limit' 
                    ? `${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}` 
                    : `${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`
                }`}
              >
                Limit
              </button>
            </div>

            {selectedCrypto ? (
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <img 
                    src={selectedCrypto.image} 
                    alt={selectedCrypto.cryptoName || selectedCrypto.name} 
                    className="w-8 h-8"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                  />
                  <div>
                    <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{selectedCrypto.cryptoName || selectedCrypto.name}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatPrice(getPrice(selectedCrypto))}</p>
                    {availableQuantity && (
                      <p className="text-xs text-blue-600">Available: {availableQuantity.toFixed(8)}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Select a cryptocurrency to trade</p>
            )}

            <div>
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Quantity</label>
              <input
                type="number"
                step="0.00000001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                max={availableQuantity || undefined}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="0.00"
              />
              {availableQuantity && (
                <button
                  onClick={() => setQuantity(availableQuantity.toString())}
                  className="mt-1 text-xs text-blue-600 hover:text-blue-700"
                >
                  Max: {availableQuantity.toFixed(8)}
                </button>
              )}
            </div>

            {/* Limit Price Input - Only show for limit orders */}
            {orderType === 'limit' && (
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Limit Price ({getCurrencySymbol()})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder={selectedCrypto ? formatPrice(getPrice(selectedCrypto)) : '0.00'}
                />
                {selectedCrypto && (
                  <p className={`mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Current price: {formatPrice(getPrice(selectedCrypto))}
                  </p>
                )}
              </div>
            )}

            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="flex justify-between text-sm mb-2">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Total {tradeType === 'buy' ? 'Cost' : 'Revenue'}:</span>
                <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {getCurrencySymbol()}{totalCost}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Available Balance:</span>
                <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{formatPrice(user?.balance)}</span>
              </div>
            </div>

            <button
              onClick={handleTrade}
              disabled={!selectedCrypto || !quantity || (orderType === 'limit' && !limitPrice) || buyMutation.isPending || sellMutation.isPending || limitOrderMutation.isPending}
              className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {buyMutation.isPending || sellMutation.isPending || limitOrderMutation.isPending 
                ? 'Processing...' 
                : `${orderType === 'limit' ? 'Place Limit Order' : `${tradeType === 'buy' ? 'Buy' : 'Sell'}`} ${(selectedCrypto?.cryptoSymbol || selectedCrypto?.symbol)?.toUpperCase() || ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Trading
