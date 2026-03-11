# CryptoPeak Test Cases
## Complete Testing Guide for Our Cryptocurrency Trading Platform

**Project:** CryptoPeak  
**Team:** Array Innovation  
**Date:** March 2026  
**Version:** 1.0  

---

## What This Document Covers

This is our complete testing guide for CryptoPeak. We've organized all the important tests you need to run to make sure everything works properly - from user registration to complex trading operations.

Think of this as your checklist before launching or after making changes. Each test tells you exactly what should happen when users interact with our platform.

---

## How to Use This Guide

### Test Priority Levels:
- **Must Work** - Critical features that absolutely need to function
- **Should Work** - Important features that users expect
- **Nice to Have** - Extra features that enhance the experience

### Test Status:
- ✅ **Working** - Test passes, feature works as expected
- ❌ **Broken** - Test fails, needs immediate attention
- ⚠️ **Needs Review** - Test passes but something seems off

---

## User Account & Security Tests

### Getting Started (Registration & Login)

**Test: New User Signs Up**
- Go to the registration page
- Fill out username, email, and password
- Click register
- **Should happen:** Welcome message, redirect to login page
- **Must not happen:** Error messages, blank screens

**Test: User Tries to Register with Existing Email**
- Try registering with an email that's already used
- **Should happen:** Clear error message "User already exists"
- **Must not happen:** Account created, confusing error

**Test: User Logs In Successfully**
- Enter correct email and password
- Click login
- **Should happen:** Dashboard loads, user sees their balance
- **Must not happen:** Stuck on login page, error messages

**Test: User Enters Wrong Password**
- Enter correct email but wrong password
- **Should happen:** Clear error "Login failed" or similar
- **Must not happen:** Account locked, confusing messages

**Test: User Logs Out**
- Click logout button
- **Should happen:** Redirected to login page, can't access protected pages
- **Must not happen:** Still logged in, can access account

### Password & Security

**Test: User Changes Password**
- Go to profile page
- Enter old password and new password
- **Should happen:** Success message, can login with new password
- **Must not happen:** Old password still works

**Test: User Enters Wrong Old Password**
- Try changing password with incorrect old password
- **Should happen:** Error message "Old password is incorrect"
- **Must not happen:** Password changed anyway

---

## Money & Balance Tests

### Checking Balance

**Test: User Sees Their Balance**
- Login and go to dashboard
- **Should happen:** Balance displayed clearly in header
- **Must not happen:** Balance shows as zero when user has money

**Test: Unauthorized User Tries to See Balance**
- Try accessing balance without logging in
- **Should happen:** Redirected to login page
- **Must not happen:** Balance information shown

### Adding Money (Deposits)

**Test: User Adds Money to Account**
- Go to deposit page
- Enter amount and submit
- **Should happen:** Balance increases, success message shown
- **Must not happen:** Money disappears, balance unchanged

**Test: User Checks Deposit History**
- Make a deposit, then check history
- **Should happen:** Deposit appears in history with correct amount and date
- **Must not happen:** History is empty or shows wrong amounts

**Test: Quick Amount Buttons Work**
- Click preset amount buttons (100, 500, 1000, etc.)
- **Should happen:** Amount fills in the input field
- **Must not happen:** Wrong amounts, buttons don't work

---

## Cryptocurrency Data Tests

### Market Information

**Test: Crypto Prices Load**
- Go to trading page
- **Should happen:** List of cryptocurrencies with current prices
- **Must not happen:** Empty list, loading forever, old prices

**Test: Price Charts Display**
- Click on any cryptocurrency
- **Should happen:** Chart loads with price history
- **Must not happen:** Blank chart, error messages

**Test: Search for Specific Crypto**
- Use search box to find Bitcoin or Ethereum
- **Should happen:** Results filter to show matching cryptocurrencies
- **Must not happen:** No results when crypto exists

**Test: Sort Cryptocurrencies**
- Click sort buttons (price, change, name)
- **Should happen:** List reorders correctly
- **Must not happen:** Sort doesn't work, wrong order

---

## Trading Tests

### Buying Cryptocurrency

**Test: User Buys Crypto with Enough Money**
- Have sufficient balance
- Enter amount to buy
- Click buy button
- **Should happen:** Purchase succeeds, balance decreases, holdings increase
- **Must not happen:** Money taken but no crypto received

**Test: User Tries to Buy More Than They Can Afford**
- Try buying crypto worth more than account balance
- **Should happen:** Clear error "Insufficient balance"
- **Must not happen:** Purchase goes through, negative balance

**Test: User Buys Very Small Amount**
- Try buying a tiny fraction of cryptocurrency
- **Should happen:** Purchase works or clear minimum amount message
- **Must not happen:** Confusing errors, money lost

### Selling Cryptocurrency

**Test: User Sells Crypto They Own**
- Own some cryptocurrency
- Enter amount to sell
- Click sell button
- **Should happen:** Sale succeeds, balance increases, holdings decrease
- **Must not happen:** Crypto gone but no money received

**Test: User Tries to Sell More Than They Own**
- Try selling more crypto than in holdings
- **Should happen:** Clear error "Insufficient crypto balance"
- **Must not happen:** Sale goes through, negative holdings

### Portfolio Management

**Test: User Views Their Holdings**
- Go to portfolio page
- **Should happen:** All owned cryptocurrencies listed with quantities and values
- **Must not happen:** Empty portfolio when user owns crypto

**Test: Portfolio Value Calculation**
- Check if total portfolio value matches sum of individual holdings
- **Should happen:** Math adds up correctly
- **Must not happen:** Wrong totals, missing holdings

**Test: Profit/Loss Display**
- **Should happen:** Clear indication if user is making or losing money
- **Must not happen:** Confusing numbers, wrong calculations

---

## Advanced Trading Tests

### Limit Orders

**Test: User Creates Buy Limit Order**
- Set price below current market price
- Enter quantity
- Create order
- **Should happen:** Order appears as "Pending", funds reserved
- **Must not happen:** Order executes immediately at wrong price

**Test: User Creates Sell Limit Order**
- Set price above current market price
- Enter quantity from holdings
- Create order
- **Should happen:** Order appears as "Pending", crypto reserved
- **Must not happen:** Crypto sold immediately at wrong price

**Test: Limit Order Executes Automatically**
- Create limit order
- Wait for market price to reach limit price
- **Should happen:** Order executes automatically, status changes to "Filled"
- **Must not happen:** Order stays pending when price is reached

**Test: User Cancels Limit Order**
- Create limit order
- Click cancel button
- **Should happen:** Order cancelled, funds/crypto released back to user
- **Must not happen:** Order still active, money/crypto stuck

**Test: User Views All Their Orders**
- Go to limit orders page
- **Should happen:** All orders shown with status, price, quantity
- **Must not happen:** Missing orders, wrong information

---

## User Interface Tests

### Navigation & Layout

**Test: User Navigates Between Pages**
- Click on different menu items
- **Should happen:** Pages load quickly, correct content shown
- **Must not happen:** Broken links, wrong pages

**Test: Current Page is Highlighted**
- Navigate to different sections
- **Should happen:** Active page clearly highlighted in menu
- **Must not happen:** No indication of current location

**Test: User Information in Header**
- Check header area
- **Should happen:** Username and balance clearly visible
- **Must not happen:** Generic "User" text, missing information

### Responsive Design

**Test: Site Works on Mobile**
- Open site on phone or resize browser window
- **Should happen:** Layout adjusts, everything still usable
- **Must not happen:** Text too small, buttons unreachable

**Test: Site Works on Tablet**
- Test on tablet-sized screen
- **Should happen:** Good use of space, easy to navigate
- **Must not happen:** Wasted space, cramped layout

### Loading & Performance

**Test: Pages Load Quickly**
- Navigate around the site
- **Should happen:** Pages load in under 3 seconds
- **Must not happen:** Long loading times, blank screens

**Test: Real-time Price Updates**
- Stay on trading page for a few minutes
- **Should happen:** Prices update automatically
- **Must not happen:** Stale prices, manual refresh needed

---

## Error Handling Tests

### Network Issues

**Test: What Happens When Internet is Slow**
- Simulate slow connection
- **Should happen:** Loading indicators shown, graceful degradation
- **Must not happen:** Site breaks, confusing errors

**Test: What Happens When Backend is Down**
- **Should happen:** User-friendly error message, suggestion to try again
- **Must not happen:** Technical error messages, site crash

### User Mistakes

**Test: User Enters Invalid Data**
- Try entering letters in number fields
- **Should happen:** Clear validation messages
- **Must not happen:** Form submits with bad data

**Test: User Clicks Back Button During Transaction**
- Start a trade, then click browser back button
- **Should happen:** Transaction cancelled or clear status shown
- **Must not happen:** Money/crypto in unknown state

### Session Management

**Test: User Session Expires**
- Leave site open for a long time
- **Should happen:** Automatic logout, redirect to login
- **Must not happen:** Broken functionality, confusing errors

**Test: User Opens Multiple Tabs**
- Login in one tab, logout in another
- **Should happen:** All tabs reflect logout status
- **Must not happen:** Mixed states, security issues

---

## Security Tests

### Data Protection

**Test: User Can Only See Their Own Data**
- **Should happen:** Users only see their own balance, trades, orders
- **Must not happen:** Other users' information visible

**Test: Passwords Are Protected**
- **Should happen:** Passwords never shown in plain text
- **Must not happen:** Password visible in forms, URLs, or errors

### Access Control

**Test: Unauthenticated Access Blocked**
- Try accessing protected pages without logging in
- **Should happen:** Redirect to login page
- **Must not happen:** Access to sensitive information

**Test: Invalid Tokens Rejected**
- **Should happen:** Expired or invalid login tokens cause logout
- **Must not happen:** Continued access with bad tokens

---

## Integration Tests

### External Services

**Test: Cryptocurrency Price Data**
- **Should happen:** Real prices from Binance API
- **Must not happen:** Fake prices, outdated information

**Test: Payment Processing**
- **Should happen:** Deposits work smoothly
- **Must not happen:** Payment errors, lost transactions

### Database Operations

**Test: Data Persistence**
- Make trades, logout, login again
- **Should happen:** All data still there
- **Must not happen:** Lost transactions, reset balances

**Test: Concurrent Users**
- Multiple users trading at same time
- **Should happen:** All transactions processed correctly
- **Must not happen:** Data corruption, lost trades

---

## Performance Tests

### Load Testing

**Test: Many Users at Once**
- **Should happen:** Site remains responsive
- **Must not happen:** Crashes, extreme slowdowns

**Test: Large Portfolio**
- User with many different cryptocurrencies
- **Should happen:** Portfolio loads quickly, calculations correct
- **Must not happen:** Timeouts, wrong totals

### Data Volume

**Test: Long Transaction History**
- User with hundreds of trades
- **Should happen:** History loads efficiently, pagination works
- **Must not happen:** Slow loading, browser crashes

---

## Browser Compatibility Tests

### Modern Browsers

**Test: Chrome/Edge**
- **Should happen:** Everything works perfectly
- **Must not happen:** Layout issues, broken functionality

**Test: Firefox**
- **Should happen:** Same experience as Chrome
- **Must not happen:** Different behavior, missing features

**Test: Safari**
- **Should happen:** Works on Mac/iPhone users
- **Must not happen:** iOS-specific problems

---

## Final Checklist

Before considering CryptoPeak ready for users, make sure:

### Critical Features (Must Work)
- [ ] User registration and login
- [ ] Balance display and deposits
- [ ] Buying and selling cryptocurrency
- [ ] Portfolio viewing
- [ ] Basic security (logout, session management)

### Important Features (Should Work)
- [ ] Limit orders creation and execution
- [ ] Price charts and market data
- [ ] Transaction history
- [ ] Password changes
- [ ] Mobile responsiveness

### Nice-to-Have Features
- [ ] Advanced charts
- [ ] Search and sorting
- [ ] Quick amount buttons
- [ ] Real-time price updates

---

## When Tests Fail

### Immediate Action Required:
- Any security test failure
- User can't login or register
- Money/crypto goes missing
- Site completely broken

### Fix Soon:
- UI looks wrong but functions work
- Some features slow but working
- Minor calculation errors

### Fix When Possible:
- Cosmetic issues
- Nice-to-have features not working
- Performance could be better

---

**Remember:** The goal isn't perfect software, it's software that works reliably for our users. Focus on the tests that matter most to the people using CryptoPeak every day.

**Questions about testing?** Contact the Array Innovation team.

**Last updated:** March 2026