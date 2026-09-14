# 👑 Royal FX Standard Broker Platform

Fullstack Next-Gen Forex, Crypto, Indices & Commodities Broker Platform inspired by **RoyalFX (royalfxs.com)**.

---

## 🚀 Live Demo & Ports
* **Frontend Web Application (WebTrader & Client Portal):** [http://localhost:5173](http://localhost:5173)
* **Backend API & Real-time Engine:** [http://localhost:5000](http://localhost:5000)

---

## 🔑 Default Accounts & Credentials

| Role | Email | Password | Starting Balance | Features |
|---|---|---|---|---|
| **Super Admin (Broker CRM)** | `admin@royalfx.com` | `admin123` | $500,000.00 | Full Backoffice CRM, Approve Deposits/Withdrawals, KYC review, Risk monitor |
| **Demo Trader** | `trader@royalfx.com` | `trader123` | $10,000.00 | Instant Trading, WebTrader access, TradingView charts |

*(Or register any new live account directly from the website — new accounts automatically receive $10,000 practice funds).*

---

## 📦 What Has Been Built

### 1. 🌐 Public Landing Page (`/`)
* **RoyalFX Style Branding**: Dark/Light themed UI, glowing accents, institutional broker design.
* **Live Market Ticker Strip**: Real-time tick updates for Forex, Gold, Oil, Crypto, and US Indices.
* **Why Trade With Royal FX**: Highlights Web-Based Trading, 24/7 Multilingual Support, Segregated Client Funds, and Tight Spreads from 0.0 Pips.
* **Account Tiers**: Standard, Pro Trader, and ECN VIP plans.
* **3-Step Setup**: Register -> Verify KYC & Deposit -> Start Trading CFDs.

### 2. 📊 WebTrader Terminal (`/trade` - `trade.royalfxs.com` style)
* **TradingView Advanced Charting**: Real-time Candlesticks, Multi-timeframes, RSI, Moving Averages.
* **Real-time Market Watch**: Category tabs (All, Forex, Crypto, Commodities, Indices), instant search, and live Bid/Ask spreads.
* **Order Execution Engine**:
  * Buy (Long) / Sell (Short)
  * Lot Size selector (0.01 to 100) with quick volume presets
  * Required Margin calculator (`Margin = Lots * ContractSize * Price / Leverage`)
  * Stop Loss (SL) & Take Profit (TP) inputs
* **Positions Management**:
  * **Open Positions**: Real-time floating Profit & Loss, margin level, and One-Click "Close Position" button.
  * **Trade History**: Complete log of closed orders with realized P&L and timestamps.
* **Account Status Bar**: Live metrics for Balance, Equity, Margin, Free Margin, and Margin Level %.

### 3. 💳 Client Portal & Wallet (`/dashboard`)
* **Trader Identity**: Account ID, Leverage (1:100), KYC verification status badge.
* **Deposit System**: USDT TRC20 (with Broker wallet & QR), Bank Wire details, and UPI.
* **Withdrawal System**: Free margin safety validation, destination address, and real-time status.
* **KYC Upload**: Passport, National ID, or Driving License document upload for compliance.
* **Transaction History**: Complete record of all deposits and withdrawals with status indicators.

### 4. 🛡️ Broker Admin CRM Backoffice (`/admin`)
* **Dashboard Analytics**: Total Traders, Total Client Balances, Total Approved Deposits, Total Withdrawals, and Active Open Market Trades.
* **Trader Management**: Full directory of traders with live equity, balance adjustment (Credit/Debit funds), and leverage settings.
* **Deposit Approval**: Approve (auto-credit wallet) or Reject pending deposits.
* **Withdrawal Approval**: Approve (auto-deduct wallet) or Reject pending withdrawals.
* **KYC Review**: Approve or Reject trader identity documents.
* **Risk Management**: Live monitor of all open positions across the platform with emergency "Force Close" functionality.

### 5. ⚡ Real-Time Price & Execution Engine (`backend/src/services`)
* **High-frequency Socket.IO Price Feeds**: Live micro-volatility simulation across 16 major instruments.
* **Automated SL & TP Engine**: Closes positions automatically when market price hits stop-loss or take-profit targets.
* **Margin Call & Stop-Out Liquidation**: Protects trader and broker from negative balance by automatically liquidating losing positions if Margin Level drops below 30%.

---

## 🛠️ Tech Stack
* **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Socket.IO Client, TradingView Widget
* **Backend**: Node.js, Express, Socket.IO, JWT, Bcrypt, Multer
* **Database**: SQLite (via `better-sqlite3`, WAL mode, zero configuration needed)

---

## 🏃 How to Run Locally

### 1. Start Backend:
```bash
cd backend
node src/server.js
```

### 2. Start Frontend:
```bash
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
