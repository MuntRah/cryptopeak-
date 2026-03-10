import { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext()

// Exchange rates (you can fetch these from an API in production)
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  BHD: 0.377
}

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  BHD: 'BD'
}

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('preferredCurrency') || 'USD'
  })

  useEffect(() => {
    localStorage.setItem('preferredCurrency', currency)
  }, [currency])

  const convertPrice = (priceInUSD) => {
    if (!priceInUSD) return 0
    return priceInUSD * EXCHANGE_RATES[currency]
  }

  const convertToUSD = (amount) => {
    if (!amount) return 0
    return amount / EXCHANGE_RATES[currency]
  }

  const formatPrice = (priceInUSD, showSymbol = true) => {
    const converted = convertPrice(priceInUSD)
    const symbol = showSymbol ? CURRENCY_SYMBOLS[currency] : ''
    
    if (currency === 'JPY') {
      // For JPY, show more decimals for very small values
      if (converted < 1) {
        return `${symbol}${converted.toFixed(4)}`
      }
      return `${symbol}${converted.toFixed(0)}`
    }
    
    if (currency === 'BHD') {
      // For BHD, use 3 decimal places (standard for Bahraini Dinar)
      if (converted < 0.01) {
        return `${symbol}${converted.toFixed(8)}` // Very small values
      } else if (converted < 1) {
        return `${symbol}${converted.toFixed(6)}` // Small values
      } else if (converted < 100) {
        return `${symbol}${converted.toFixed(4)}` // Medium values
      } else {
        return `${symbol}${converted.toFixed(3)}` // Large values (BHD standard)
      }
    }
    
    // For other currencies, intelligently choose decimal places
    if (converted < 0.01) {
      return `${symbol}${converted.toFixed(8)}` // Very small values (like SHIB)
    } else if (converted < 1) {
      return `${symbol}${converted.toFixed(6)}` // Small values
    } else if (converted < 100) {
      return `${symbol}${converted.toFixed(4)}` // Medium values
    } else {
      return `${symbol}${converted.toFixed(2)}` // Large values
    }
  }

  const getCurrencySymbol = () => CURRENCY_SYMBOLS[currency]

  const value = {
    currency,
    setCurrency,
    convertPrice,
    convertToUSD,
    formatPrice,
    getCurrencySymbol,
    exchangeRates: EXCHANGE_RATES,
    currencySymbols: CURRENCY_SYMBOLS
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
