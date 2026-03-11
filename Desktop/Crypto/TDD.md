# Technical Design Document
## CryptoPeak - How We Built It

**Project:** CryptoPeak Trading Platform  
**Team:** Array Innovation  
**Date:** March 2026  
**Version:** 1.0  

---

## The Big Picture

We built CryptoPeak as a modern web application that feels fast and reliable. Think of it like online banking, but for cryptocurrency trading. Everything runs in Docker containers, which means it works the same way whether we're testing on our laptops or running it in production.

The whole system is pretty straightforward - a React frontend talks to a Spring Boot backend, which connects to external APIs for real crypto prices and payment processing. We chose technologies that our team knows well and that have strong community support.

---

## How Everything Connects

### The Main Components
**Frontend (React)** - What users see and interact with
- Runs on port 4567 in our Docker setup
- Built with modern React and styled with Tailwind CSS
- Uses Vite for super-fast development and building

**Backend (Spring Boot)** - The business logic and data handling
- Runs on port 9876 in our Docker setup
- Written in Java 17 with Spring Boot 3.2.5
- Handles all the trading logic and user management

**Database (SQLite)** - Where we store everything
- Simple file-based database that's perfect for our needs
- Automatic migrations with Flyway
- Stores users, trades, portfolios, and limit orders

**External Services** - The outside world
- Binance API for real-time crypto prices
- Stripe for secure payment processing

### Why These Choices Made Sense
We picked React because it's what most developers know, and the ecosystem is huge. Spring Boot gives us enterprise-level features without the complexity. SQLite keeps things simple - no database server to manage, and it's surprisingly powerful for our use case.

Docker containers mean we can develop locally and deploy anywhere without "it works on my machine" problems.

---

## The Database Story

We keep things simple with five main tables that handle everything:

**Users** - Basic account info, encrypted passwords, and account balances
**CryptoHolding** - What crypto each user owns and their average buy prices
**CryptoTransaction** - Every buy and sell trade (our audit trail)
**LimitOrder** - Pending orders that execute when prices hit target levels
**Deposit** - Payment records and Stripe integration data

The relationships are straightforward - users have holdings, transactions, and orders. Everything links back to the user account, making queries fast and data consistent.

---

## API Design Philosophy

We designed our APIs to be predictable and RESTful. If you've used any modern web API, ours will feel familiar:

**Authentication Routes** - Register, login, logout, password reset
**Trading Routes** - Buy crypto, sell crypto, view portfolio, transaction history
**Limit Order Routes** - Create, view, update, and cancel pending orders
**Payment Routes** - Add money to accounts via Stripe integration
**Market Data Routes** - Get current prices and crypto information

Every endpoint returns consistent JSON responses, and we use standard HTTP status codes. Error messages are clear and helpful for debugging.

---

## Security That Actually Works

Security isn't an afterthought - it's built into every layer:

**Authentication** - JWT tokens that expire in 24 hours
**Password Storage** - BCrypt hashing with proper salting
**API Protection** - CORS configured to only allow our frontend
**Input Validation** - Everything gets validated on the server side
**Database Security** - JPA/Hibernate prevents SQL injection attacks

We also use HTTPS everywhere and follow security best practices. The JWT approach means users stay logged in across browser sessions but tokens expire regularly for security.

---

## Frontend Architecture

The React frontend is organized around user workflows:

**Pages** - Dashboard, Trading, Portfolio, Profile (the main user destinations)
**Components** - Reusable pieces like charts, forms, and layout elements
**Context** - Global state for authentication, currency preferences, and themes
**Services** - API communication and data fetching logic

We use React Query for server state management, which gives us automatic caching, background updates, and error handling. The Context API handles global state like user authentication and currency preferences.

---

## External Integrations

**Binance API** - We fetch real-time prices every 30 seconds
- Uses their public API endpoints (no API key required)
- Handles rate limiting and error responses gracefully
- Caches data to reduce API calls and improve performance

**Stripe Payments** - Secure payment processing
- Creates payment intents for deposits
- Handles webhooks for payment confirmations
- Never stores sensitive payment data on our servers

Both integrations have fallback handling - if Binance is down, we show cached prices with a warning. If Stripe has issues, users get clear error messages.

---

## Docker Deployment

We use multi-stage Docker builds to keep images small and secure:

**Frontend Image** - Builds the React app and serves it with Nginx
**Backend Image** - Packages the Spring Boot app with embedded Tomcat

Docker Compose orchestrates everything:
- Frontend and backend containers
- Shared network for communication
- Volume mounting for database persistence
- Health checks to ensure everything's running

The whole stack starts with one command: `docker-compose up`

---

## Performance and Reliability

**Frontend Performance**
- Code splitting so pages load fast
- React Query caching reduces API calls
- Optimized bundle sizes with Vite
- Responsive design that works on any device

**Backend Performance**
- Database connection pooling
- Efficient JPA queries with proper indexing
- Caching for frequently accessed data
- Rate limiting to prevent abuse

**Monitoring**
- Health check endpoints for both services
- Structured logging for debugging
- Error tracking and alerting
- Performance metrics collection

---

## Testing Strategy

We test the things that matter most:

**Backend Tests** - Service layer logic, repository operations, security features
**Frontend Tests** - Component behavior, user interactions, API integration
**Integration Tests** - End-to-end user workflows

The test suite runs automatically on every code change, and we maintain high coverage on critical paths like trading and authentication.

---

## What We Learned

**Keep It Simple** - We chose proven technologies over trendy ones
**Security First** - Built security in from the start, not bolted on later
**User Experience** - Every technical decision considered the user impact
**Maintainability** - Code that's easy to understand and modify

**Real-World Challenges We Solved**
- Currency conversion accuracy (exchange rates change constantly)
- Real-time price updates without overwhelming the API
- Secure payment processing with clear user feedback
- Portfolio calculations that handle partial sales correctly

---

## Future Technical Improvements

**Short Term**
- Redis caching layer for better performance
- WebSocket connections for real-time price updates
- Mobile app using React Native
- Enhanced monitoring and alerting

**Medium Term**
- Microservices architecture for better scaling
- Multiple database replicas for high availability
- Advanced trading features like stop-loss orders
- API rate limiting and usage analytics

**Long Term**
- Machine learning for trading insights
- Blockchain integration for DeFi features
- Multi-region deployment for global users
- Advanced security features like 2FA

---

## Development Workflow

**Local Development** - Docker Compose for consistent environments
**Code Quality** - Automated linting, formatting, and testing
**Deployment** - Container-based deployment with health checks
**Monitoring** - Logs and metrics for troubleshooting

**Team Practices**
- Code reviews for all changes
- Feature branches and pull requests
- Automated testing before deployment
- Documentation that stays up-to-date

---

