import { useTheme } from '../context/ThemeContext'

export const useDarkMode = () => {
  const { isDarkMode } = useTheme()

  const classes = {
    // Backgrounds
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    bgCard: isDarkMode ? 'bg-gray-800' : 'bg-white',
    bgInput: isDarkMode ? 'bg-gray-700' : 'bg-white',
    bgHover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    
    // Text colors
    text: isDarkMode ? 'text-gray-200' : 'text-gray-900',
    textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-500' : 'text-gray-500',
    
    // Borders
    border: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    borderLight: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    
    // Combined common patterns
    card: `${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`,
    input: `${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`,
  }

  return { isDarkMode, ...classes }
}
