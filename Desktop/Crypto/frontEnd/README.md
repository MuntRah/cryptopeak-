# Crypto Trading Platform Frontend

React frontend for the crypto trading platform.

## Features

- User authentication (login/register)
- Real-time crypto prices
- Buy/sell cryptocurrencies
- Portfolio management
- Deposit funds
- Trading Sensei alerts and reports
- Transaction history

## Tech Stack

- React 18
- Vite
- React Router
- TanStack Query (React Query)
- Axios
- Tailwind CSS
- Recharts
- React Hot Toast
- Lucide React Icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Environment Variables

Create a `.env` file:
```
VITE_API_URL=http://localhost:8080
```

## Project Structure

```
src/
├── components/     # Reusable components
├── context/        # React context (Auth)
├── pages/          # Page components
├── services/       # API services
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```
