# CryptoPeak - Cryptocurrency Trading Platform

A full-stack cryptocurrency trading platform built with React and Spring Boot, featuring real-time market data, portfolio management, and secure trading capabilities.

## 🚀 Features

- **Real-time Trading** - Live cryptocurrency prices from Binance API
- **Portfolio Management** - Track holdings, profits/losses, and performance
- **Limit Orders** - Advanced trading with automated order execution
- **Multi-Currency Support** - USD, BHD, EUR, GBP, JPY
- **Secure Payments** - Stripe integration for deposits
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Query** - Server state management
- **Recharts** - Data visualization

### Backend
- **Spring Boot 3** - Java web framework
- **Spring Security** - Authentication & authorization
- **SQLite** - Lightweight database
- **JWT** - Secure token-based auth
- **Maven** - Dependency management

### Infrastructure
- **Docker** - Containerization
- **Nginx** - Web server & reverse proxy
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

- **Docker** & **Docker Compose**
- **Node.js 18+** (for local development)
- **Java 17+** (for local development)
- **Maven 3.6+** (for local development)

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/MuntRah/cryptopeak-.git
   cd cryptopeak-
   ```

2. **Start the application**
   ```bash
   cd frontEnd
   docker-compose up -d --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Local Development

1. **Start Backend**
   ```bash
   cd backEnd
   ./mvnw spring-boot:run
   ```

2. **Start Frontend**
   ```bash
   cd frontEnd
   npm install
   npm run dev
   ```

## 📁 Project Structure

```
cryptopeak/
├── frontEnd/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   └── services/        # API service functions
│   ├── Dockerfile           # Frontend container config
│   └── docker-compose.yml   # Full-stack orchestration
├── backEnd/                 # Spring Boot backend
│   ├── src/main/java/       # Java source code
│   ├── src/main/resources/  # Configuration files
│   └── Dockerfile           # Backend container config
├── PRD.md                   # Product Requirements Document
├── TDD.md                   # Technical Design Document
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

**Backend (.env.example):**
```
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=your-stripe-key
DATABASE_URL=jdbc:sqlite:cryptopeak.db
```

**Frontend (.env.example):**
```
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose build cryptopeak-frontend
docker-compose build cryptopeak-backend
```

## 📊 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `PUT /api/users/profile` - Update profile

### Trading
- `GET /api/crypto/top` - Get top cryptocurrencies
- `POST /api/trading/buy` - Execute buy order
- `POST /api/trading/sell` - Execute sell order
- `GET /api/trading/holdings` - Get portfolio

### Limit Orders
- `POST /api/limit-orders` - Create limit order
- `GET /api/limit-orders` - Get user's orders
- `DELETE /api/limit-orders/{id}` - Cancel order

## 🧪 Testing

### Backend Tests
```bash
cd backEnd
./mvnw test
```

### Frontend Tests
```bash
cd frontEnd
npm run test
```

## 📈 Monitoring

- **Health Check**: http://localhost:8080/actuator/health
- **Frontend Health**: http://localhost:3000/health
- **Docker Health**: `docker ps` (check health status)

## 🔒 Security Features

- JWT-based authentication
- Password encryption with BCrypt
- CORS protection
- Input validation and sanitization
- Secure HTTP headers
- Rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 Documentation

- **[PRD.md](PRD.md)** - Product Requirements Document
- **[TDD.md](TDD.md)** - Technical Design Document
- **[TEST_CASES.md](TEST_CASES.md)** - Comprehensive Testing Guide

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Array Innovation** - Development Team
- **MuntRah** - Lead Developer

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: me.alrahim.02@gmail.com

---

**Built with ❤️ by Array Innovation**