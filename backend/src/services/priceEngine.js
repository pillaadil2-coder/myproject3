const db = require('../config/db');

class PriceEngine {
  constructor() {
    this.prices = {}; // symbol -> { symbol, bid, ask, spread, digits, change24h, high, low }
    this.io = null;
    this.intervalId = null;
  }

  init(io) {
    this.io = io;
    this.loadSymbols();
    this.startSimulation();
    console.log('[PriceEngine] Initialized with', Object.keys(this.prices).length, 'symbols');
  }

  loadSymbols() {
    const rows = db.prepare('SELECT * FROM symbols').all();
    for (const row of rows) {
      const bid = row.base_price;
      const ask = Number((bid + row.spread).toFixed(row.digits));
      this.prices[row.symbol] = {
        symbol: row.symbol,
        name: row.name,
        category: row.category,
        bid: bid,
        ask: ask,
        spread: row.spread,
        pip_size: row.pip_size,
        contract_size: row.contract_size,
        digits: row.digits,
        change24h: (Math.random() * 2 - 1).toFixed(2), // Initial daily change %
        high: Number((bid * 1.008).toFixed(row.digits)),
        low: Number((bid * 0.992).toFixed(row.digits))
      };
    }
  }

  startSimulation() {
    this.intervalId = setInterval(() => {
      this.tick();
    }, 800);
  }

  tick() {
    const updatedSymbols = [];

    for (const symbol in this.prices) {
      const item = this.prices[symbol];
      
      // Calculate realistic random fluctuation percentage
      let volatility = 0.0003; // ~0.03% for forex
      if (item.category === 'crypto') volatility = 0.0015; // ~0.15% for crypto
      if (item.category === 'commodities') volatility = 0.0006; // Gold/Oil

      const deltaFactor = (Math.random() - 0.495) * volatility;
      let newBid = item.bid * (1 + deltaFactor);
      newBid = Number(newBid.toFixed(item.digits));

      // Keep within realistic high/low bounds
      if (newBid > item.high) item.high = newBid;
      if (newBid < item.low) item.low = newBid;

      const newAsk = Number((newBid + item.spread).toFixed(item.digits));

      item.bid = newBid;
      item.ask = newAsk;

      updatedSymbols.push({
        symbol: item.symbol,
        bid: item.bid,
        ask: item.ask,
        spread: item.spread,
        high: item.high,
        low: item.low,
        change24h: item.change24h
      });
    }

    // Process open trades PnL and automated SL/TP/Liquidation
    this.processOpenTrades();

    // Broadcast live prices to connected clients
    if (this.io) {
      this.io.emit('price_update', updatedSymbols);
    }
  }

  processOpenTrades() {
    try {
      const openTrades = db.prepare("SELECT * FROM trades WHERE status = 'OPEN'").all();
      if (!openTrades || openTrades.length === 0) return;

      const updateTradePnlStmt = db.prepare(`
        UPDATE trades 
        SET current_price = ?, pnl = ? 
        WHERE id = ?
      `);

      const closeTradeStmt = db.prepare(`
        UPDATE trades 
        SET status = 'CLOSED', close_price = ?, pnl = ?, close_time = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);

      const updateUserBalanceStmt = db.prepare(`
        UPDATE users 
        SET balance = balance + ? 
        WHERE id = ?
      `);

      // Group trades by user to evaluate margin & stop-out
      const userTradesMap = {};

      for (const trade of openTrades) {
        const quote = this.prices[trade.symbol];
        if (!quote) continue;

        let currentPrice = trade.type === 'BUY' ? quote.bid : quote.ask;
        let pnl = 0;
        const contractSize = quote.contract_size;

        if (trade.type === 'BUY') {
          pnl = (quote.bid - trade.open_price) * trade.lot_size * contractSize;
        } else {
          pnl = (trade.open_price - quote.ask) * trade.lot_size * contractSize;
        }
        pnl = Number(pnl.toFixed(2));

        // 1. Check Take Profit
        if (trade.tp && trade.tp > 0) {
          if ((trade.type === 'BUY' && quote.bid >= trade.tp) ||
              (trade.type === 'SELL' && quote.ask <= trade.tp)) {
            // Trigger TP Auto-Close
            closeTradeStmt.run(currentPrice, pnl, trade.id);
            updateUserBalanceStmt.run(pnl, trade.user_id);
            if (this.io) {
              this.io.to(`user_${trade.user_id}`).emit('trade_closed', {
                tradeId: trade.id,
                reason: 'Take Profit Triggered',
                pnl
              });
            }
            continue;
          }
        }

        // 2. Check Stop Loss
        if (trade.sl && trade.sl > 0) {
          if ((trade.type === 'BUY' && quote.bid <= trade.sl) ||
              (trade.type === 'SELL' && quote.ask >= trade.sl)) {
            // Trigger SL Auto-Close
            closeTradeStmt.run(currentPrice, pnl, trade.id);
            updateUserBalanceStmt.run(pnl, trade.user_id);
            if (this.io) {
              this.io.to(`user_${trade.user_id}`).emit('trade_closed', {
                tradeId: trade.id,
                reason: 'Stop Loss Triggered',
                pnl
              });
            }
            continue;
          }
        }

        // Update trade floating PnL
        updateTradePnlStmt.run(currentPrice, pnl, trade.id);
        trade.pnl = pnl;
        trade.current_price = currentPrice;

        if (!userTradesMap[trade.user_id]) {
          userTradesMap[trade.user_id] = [];
        }
        userTradesMap[trade.user_id].push(trade);
      }

      // 3. Margin Call & Auto Liquidation (Stop-out level: 30%)
      for (const userId in userTradesMap) {
        const user = db.prepare('SELECT id, balance FROM users WHERE id = ?').get(userId);
        if (!user) continue;

        const userTrades = userTradesMap[userId];
        const totalMargin = userTrades.reduce((sum, t) => sum + t.margin, 0);
        const totalPnl = userTrades.reduce((sum, t) => sum + t.pnl, 0);
        const equity = user.balance + totalPnl;

        if (totalMargin > 0) {
          const marginLevel = (equity / totalMargin) * 100;

          // If margin level drops below 30%, liquidate worst position
          if (marginLevel < 30) {
            userTrades.sort((a, b) => a.pnl - b.pnl);
            const worstTrade = userTrades[0];
            if (worstTrade) {
              closeTradeStmt.run(worstTrade.current_price, worstTrade.pnl, worstTrade.id);
              updateUserBalanceStmt.run(worstTrade.pnl, user.id);
              if (this.io) {
                this.io.to(`user_${user.id}`).emit('trade_closed', {
                  tradeId: worstTrade.id,
                  reason: 'Margin Stop-Out Liquidation (< 30%)',
                  pnl: worstTrade.pnl
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.error('[PriceEngine] Error in processOpenTrades:', err.message);
    }
  }

  getPrice(symbol) {
    return this.prices[symbol] || null;
  }

  getAllPrices() {
    return Object.values(this.prices);
  }
}

const priceEngine = new PriceEngine();
module.exports = priceEngine;
