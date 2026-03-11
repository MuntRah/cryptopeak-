# Technical Design Document (TDD)
## CryptoPeak - Cryptocurrency Trading Platform

### 1. System Overview
**Project:** CryptoPeak Trading Platform  
**Architecture:** Full-Stack Web Application  
**Deployment:** Docker Containerization  
**Date:** March 2026  

### 2. Architecture Design

#### 2.1 High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │  External APIs  │
│   (React)       │◄──►│  (Spring Boot)  │◄──►│   (Binance)     │
│   Port: 3000    │    │   Port: 8080    │    │   (Stripe)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │    SQLite       │
│  (Web Server)   │    │   (Database)    │
└─────────────────┘    └─────────────────┘
```

#### 2.2 Technology Stack

**Frontend:**
- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.0.8
- **Styling:** Tailwind CSS 3.3.6
- **State Management:** React Query (TanStack)
- **Routing:** React Router DOM 6.20.0
- **HTTP Client:** Axios 1.6.2
- **Charts:** Recharts 2.10.3

**Backend:**
- **Framework:** Spring Boot 3.2.5
- **Language:** Java 17
- **Database:** SQLite with JPA/Hibernate
- **Security:** Spring Security with JWT
- **Build Tool:** Maven 3.9
- **Migration:** Flyway

**Infrastructure:**
- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx (Production)
- **Reverse Proxy:** Nginx configuration
- **Health Checks:** Docker health monitoring

### 3. Database Design

#### 3.1 Entity Relationship Diagram
```
┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    User     │    │ CryptoHolding   │    │CryptoTransaction│
├─────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)     │◄──►│ id (PK)         │    │ id (PK)         │
│ email       │    │ user_id (FK)    │    │ user_id (FK)    │
│ password    │    │ crypto_id       │    │ crypto_id       │
│ balance     │    │ crypto_symbol   │    │ type            │
│ created_at  │    │ quantity        │    │ quantity        │
└─────────────┘    │ avg_buy_price   │    │ price_per_unit  │
                   └─────────────────┘    │ total_amount    │
                                          │ created_at      │
┌─────────────┐    ┌─────────────────┐    └─────────────────┘
│ LimitOrder  │    │    Deposit      │
├─────────────┤    ├─────────────────┤
│ id (PK)     │    │ id (PK)         │
│ user_id(FK) │    │ user_id (FK)    │
│ crypto_id   │    │ amount          │
│ order_type  │    │ payment_intent  │
│ quantity    │    │ status          │
│ limit_price │    │ created_at      │
│ status      │    └─────────────────┘
│ created_at  │
└─────────────┘
```

#### 3.2 Key Tables

**Users Table:**
- Stores user authentication and profile data
- Tracks account balance for trading
- Encrypted password storage

**CryptoHolding Table:**
- Tracks user's cryptocurrency portfolio
- Calculates average buy price
- Real-time quantity management

**CryptoTransaction Table:**
- Records all buy/sell transactions
- Audit trail for trading activity
- Links to user and cryptocurrency data

**LimitOrder Table:**
- Manages pending limit orders
- Automatic execution logic
- Order status tracking

### 4. API Design

#### 4.1 Authentication Endpoints
```
POST /api/users/register     - User registration
POST /api/users/login        - User authentication
POST /api/users/logout       - User logout
PUT  /api/users/profile      - Update profile
POST /api/users/reset-password - Password reset
```

#### 4.2 Trading Endpoints
```
GET  /api/crypto/top         - Get top cryptocurrencies
GET  /api/crypto/{id}        - Get specific crypto data
POST /api/trading/buy        - Execute buy order
POST /api/trading/sell       - Execute sell order
GET  /api/trading/holdings   - Get user portfolio
GET  /api/trading/transactions - Get transaction history
```

#### 4.3 Limit Order Endpoints
```
POST /api/limit-orders       - Create limit order
GET  /api/limit-orders       - Get user's limit orders
PUT  /api/limit-orders/{id}  - Update limit order
DELETE /api/limit-orders/{id} - Cancel limit order
```

#### 4.4 Payment Endpoints
```
POST /api/payments/create-intent - Create payment intent
POST /api/payments/confirm       - Confirm payment
GET  /api/balance               - Get user balance
```

### 5. Security Implementation

#### 5.1 Authentication Flow
1. User submits credentials
2. Backend validates against database
3. JWT token generated with user claims
4. Token returned to frontend
5. Token included in subsequent requests
6. Backend validates token on each request

#### 5.2 Security Measures
- **Password Hashing:** BCrypt with salt
- **JWT Tokens:** 24-hour expiration
- **CORS Configuration:** Restricted origins
- **Input Validation:** Server-side validation
- **SQL Injection Prevention:** JPA/Hibernate ORM
- **XSS Protection:** Content Security Policy headers

### 6. External Integrations

#### 6.1 Binance API Integration
```java
// Real-time price fetching
GET https://api.binance.com/api/v3/ticker/24hr
GET https://api.binance.com/api/v3/klines

// Implementation in CryptoService
@Service
public class CryptoService {
    private final String BINANCE_API_URL = "https://api.binance.com/api/v3";
    
    public List<CryptoCurrency> getTopCryptocurrencies(int limit) {
        // Fetch and process Binance data
    }
}
```

#### 6.2 Stripe Payment Integration
```java
// Payment processing
@Service
public class PaymentService {
    public PaymentIntentResponse createPaymentIntent(Double amount) {
        // Create Stripe payment intent
    }
}
```

### 7. Frontend Architecture

#### 7.1 Component Structure
```
src/
├── components/
│   ├── Layout.jsx           - Main layout wrapper
│   ├── PriceChart.jsx       - Price visualization
│   └── PortfolioChart.jsx   - Portfolio charts
├── pages/
│   ├── Dashboard.jsx        - Main dashboard
│   ├── Trading.jsx          - Trading interface
│   ├── Portfolio.jsx        - Portfolio management
│   └── Profile.jsx          - User profile
├── context/
│   ├── AuthContext.jsx      - Authentication state
│   ├── CurrencyContext.jsx  - Currency conversion
│   └── ThemeContext.jsx     - Dark/light theme
└── services/
    ├── api.js               - HTTP client setup
    ├── cryptoService.js     - Crypto API calls
    └── paymentService.js    - Payment API calls
```

#### 7.2 State Management
- **React Query:** Server state management
- **Context API:** Global application state
- **Local State:** Component-specific state

### 8. Deployment Architecture

#### 8.1 Docker Configuration
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
```

#### 8.2 Docker Compose Setup
```yaml
services:
  cryptopeak-frontend:
    build: ./frontEnd
    ports:
      - "3000:80"
    depends_on:
      - cryptopeak-backend
      
  cryptopeak-backend:
    build: ./intrenProject
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
```

### 9. Performance Considerations

#### 9.1 Frontend Optimization
- **Code Splitting:** Route-based lazy loading
- **Caching:** React Query caching strategy
- **Bundle Optimization:** Vite build optimization
- **Image Optimization:** Lazy loading and compression

#### 9.2 Backend Optimization
- **Database Indexing:** Primary and foreign key indexes
- **Connection Pooling:** HikariCP configuration
- **Caching:** In-memory caching for frequent queries
- **API Rate Limiting:** Prevent abuse

### 10. Monitoring & Logging

#### 10.1 Health Checks
- **Frontend:** Nginx health endpoint
- **Backend:** Spring Boot Actuator
- **Database:** Connection health monitoring

#### 10.2 Logging Strategy
- **Application Logs:** Structured JSON logging
- **Error Tracking:** Exception handling and logging
- **Performance Metrics:** Response time monitoring

### 11. Testing Strategy

#### 11.1 Backend Testing
- **Unit Tests:** Service layer testing
- **Integration Tests:** Repository testing
- **Security Tests:** JWT validation testing

#### 11.2 Frontend Testing
- **Component Tests:** React component testing
- **Integration Tests:** API integration testing
- **E2E Tests:** User workflow testing

### 12. Scalability Considerations

#### 12.1 Horizontal Scaling
- **Load Balancing:** Multiple frontend instances
- **Database Scaling:** Read replicas for queries
- **Caching Layer:** Redis for session management

#### 12.2 Performance Monitoring
- **Metrics Collection:** Application performance metrics
- **Alert System:** Automated monitoring alerts
- **Capacity Planning:** Resource usage tracking