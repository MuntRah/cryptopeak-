import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCurrency } from '../context/CurrencyContext'
import { useTheme } from '../context/ThemeContext'
import { Home, TrendingUp, Briefcase, CreditCard, User, LogOut, ListOrdered } from 'lucide-react'

const Layout = () => {
  const { user, logout } = useAuth()
  const { formatPrice, currency } = useCurrency()
  const { isDarkMode } = useTheme()
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/trading', icon: TrendingUp, label: 'Trading' },
    { path: '/portfolio', icon: Briefcase, label: 'Portfolio' },
    { path: '/orders', icon: ListOrdered, label: 'Orders' },
    { path: '/deposit', icon: CreditCard, label: 'Deposit' },
    { path: '/profile', icon: User, label: 'Profile' }
  ]

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">CryptoPeak</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map(({ path, icon: Icon, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === path
                        ? `border-blue-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`
                        : `border-transparent ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} hover:border-gray-300`
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-right">
                <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{user?.userName}</p>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{formatPrice(user?.balance)} <span className="text-xs">({currency})</span></p>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
