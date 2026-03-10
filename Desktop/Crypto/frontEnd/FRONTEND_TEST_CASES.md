# Frontend Test Cases - CryptoPeak Trading Platform

## Authentication Pages

### TC-UI-AUTH-001: Valid Registration
**Page:** `/register` | **Priority:** High  
**Expected:** Success toast, redirect to login

### TC-UI-AUTH-002: Duplicate Email Registration
**Page:** `/register` | **Priority:** High  
**Expected:** Error toast "User already exists"

### TC-UI-AUTH-003: Valid Login
**Page:** `/login` | **Priority:** High  
**Expected:** JWT stored, redirect to dashboard

### TC-UI-AUTH-004: Invalid Login
**Page:** `/login` | **Priority:** High  
**Expected:** Error toast "Login failed"

### TC-UI-AUTH-005: Logout
**Priority:** High  
**Expected:** JWT cleared, redirect to login

---

## Dashboard

### TC-UI-DASH-001: Display Balance
**Page:** `/` | **Priority:** High  
**Expected:** User balance shown in header with currency symbol

### TC-UI-DASH-002: Protected Route
**Page:** `/` | **Priority:** High  
**Expected:** Unauthenticated users redirected to login

---

## Trading Page

### TC-UI-TRADE-001: Load Cryptocurrencies
**Page:** `/trading` | **Priority:** High  
**Expected:** Top 20 cryptos displayed with prices, 24h change

### TC-UI-TRADE-002: Display Price Chart
**Page:** `/trading` | **Priority:** High  
**Expected:** Chart loads with historical data, timeframe buttons work

### TC-UI-TRADE-003: Market Buy Order
**Page:** `/trading` | **Priority:** High  
**Expected:** Success toast, balance decreased, holdings increased

### TC-UI-TRADE-004: Market Sell Order
**Page:** `/trading` | **Priority:** High  
**Expected:** Success toast, balance increased, holdings decreased

### TC-UI-TRADE-005: Limit Order Creation
**Page:** `/trading` | **Priority:** High  
**Expected:** Limit order created with PENDING status

### TC-UI-TRADE-006: Insufficient Balance
**Page:** `/trading` | **Priority:** High  
**Expected:** Error toast with insufficient balance message

### TC-UI-TRADE-007: Search & Sort
**Page:** `/trading` | **Priority:** Medium  
**Expected:** Search filters list, sort cycles through none/desc/asc

### TC-UI-TRADE-008: Switch Buy/Sell Mode
**Page:** `/trading` | **Priority:** Medium  
**Expected:** Mode switch shows holdings (sell) or all cryptos (buy)

---

## Portfolio Page

### TC-UI-PORT-001: Display Holdings
**Page:** `/portfolio` | **Priority:** High  
**Expected:** All holdings with quantity, value, profit/loss shown

### TC-UI-PORT-002: Portfolio Chart
**Page:** `/portfolio` | **Priority:** High  
**Expected:** Chart shows portfolio value over time

### TC-UI-PORT-003: Total Value Calculation
**Page:** `/portfolio` | **Priority:** High  
**Expected:** Total value and profit/loss percentage accurate

---

## Limit Orders Page

### TC-UI-LIMIT-001: Display Orders
**Page:** `/limit-orders` | **Priority:** High  
**Expected:** All orders shown with status, type, price, quantity

### TC-UI-LIMIT-002: Filter by Status
**Page:** `/limit-orders` | **Priority:** Medium  
**Expected:** Filter buttons (All, Pending, Filled, Cancelled) work

### TC-UI-LIMIT-003: Cancel Order
**Page:** `/limit-orders` | **Priority:** High  
**Expected:** Order cancelled, success toast, list refreshed

---

## Deposit Page

### TC-UI-DEP-001: Add Funds
**Page:** `/deposit` | **Priority:** High  
**Expected:** Success toast, balance updated, deposit in history

### TC-UI-DEP-002: Quick Amount Buttons
**Page:** `/deposit` | **Priority:** Medium  
**Expected:** Buttons (100, 500, 1000, 5000) fill input

### TC-UI-DEP-003: Deposit History
**Page:** `/deposit` | **Priority:** High  
**Expected:** All deposits shown with amount, date, status

### TC-UI-DEP-004: Reset Balance
**Page:** `/deposit` | **Priority:** Medium  
**Expected:** Confirmation dialog, balance set to 0

---

## Profile Page

### TC-UI-PROF-001: Display User Info
**Page:** `/profile` | **Priority:** High  
**Expected:** Username, email, balance displayed

### TC-UI-PROF-002: Change Password
**Page:** `/profile` | **Priority:** High  
**Expected:** Success toast, password updated

### TC-UI-PROF-003: Wrong Old Password
**Page:** `/profile` | **Priority:** High  
**Expected:** Error toast "Old password is incorrect"

---

## Navigation & Layout

### TC-UI-NAV-001: Header Display
**Priority:** High  
**Expected:** Logo, nav links, balance, logout visible

### TC-UI-NAV-002: Active Route Highlighting
**Priority:** Medium  
**Expected:** Current page highlighted in navigation

### TC-UI-NAV-003: Logout Button
**Priority:** High  
**Expected:** Clears session, redirects to login

---

## Context & State

### TC-UI-CTX-001: User State Persistence
**Priority:** High  
**Expected:** User remains logged in after refresh

### TC-UI-CTX-002: Token Expiration Handling
**Priority:** High  
**Expected:** Expired token redirects to login (401)

### TC-UI-CTX-003: Currency Switching
**Priority:** Medium  
**Expected:** All prices update when currency changed

---

## Error Handling

### TC-UI-ERR-001: Network Errors
**Priority:** High  
**Expected:** User-friendly error toast when API down

### TC-UI-ERR-002: 401 Unauthorized
**Priority:** High  
**Expected:** Auto redirect to login, token cleared

### TC-UI-ERR-003: Loading States
**Priority:** Medium  
**Expected:** Loading indicators during API calls

---

**Total Test Cases:** 35  
**Document Version:** 1.0  
**Last Updated:** 2026-03-09
