const db = require('../config/db');
const priceEngine = require('./priceEngine');

class TradingEngine {
  getUserMetrics(userId) {
    const user = db.prepare('SELECT id, name, email, balance, leverage, kyc_status, role FROM users WHERE id = ?').get(userId);
    if (!user) return null;

    const openTrades = db.prepare("SELECT * FROM trades WHERE user_id = ? AND status = 'OPEN'").all(userId);
    
    let totalMargin = 0;
    let totalFloatingPnl = 0;

    for (const trade of openTrades) {
      totalMargin += trade.margin;
      totalFloatingPnl += trade.pnl;
    }

    const equity = Number((user.balance + totalFloatingPnl).toFixed(2));
    const freeMargin = Number((equity - totalMargin).toFixed(2));
    let marginLevel = 0;
    if (totalMargin > 0) {
      marginLevel = Number(((equity / totalMargin) * 100).toFixed(2));
    }

    return {
      user,
      balance: Number(user.balance.toFixed(2)),
      equity,
      usedMargin: Number(totalMargin.toFixed(2)),
      freeMargin,
      marginLevel,
      floatingPnl: Number(totalFloatingPnl.toFixed(2)),
      openPositionsCount: openTrades.length
    };
  }

  openPosition({ userId, symbol, type, lotSize, sl, tp }) {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    if (!user) throw new Error('User not found');

    const quote = priceEngine.getPrice(symbol);
    if (!quote) throw new Error(`Invalid symbol: ${symbol}`);

    lotSize = parseFloat(lotSize);
    if (isNaN(lotSize) || lotSize <= 0) {
      throw new Error('Invalid lot size');
    }

    const openPrice = type === 'BUY' ? quote.ask : quote.bid;
    const contractSize = quote.contract_size;
    const leverage = user.leverage || 100;

    // Calculate required margin in USD
    // Standard Formula: (Lot Size * Contract Size * Market Price) / Leverage
    const requiredMargin = Number(((lotSize * contractSize * openPrice) / leverage).toFixed(2));

    const metrics = this.getUserMetrics(userId);
    if (metrics.freeMargin < requiredMargin) {
      throw new Error(`Insufficient Free Margin. Required: $${requiredMargin}, Available: $${metrics.freeMargin}`);
    }

    // Insert trade
    const insertStmt = db.prepare(`
      INSERT INTO trades (user_id, symbol, type, lot_size, open_price, current_price, sl, tp, pnl, margin, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0.0, ?, 'OPEN')
    `);

    const result = insertStmt.run(
      userId,
      symbol,
      type.toUpperCase(),
      lotSize,
      openPrice,
      openPrice,
      sl ? parseFloat(sl) : null,
      tp ? parseFloat(tp) : null,
      requiredMargin
    );

    const newTrade = db.prepare('SELECT * FROM trades WHERE id = ?').get(result.lastInsertRowid);
    return newTrade;
  }

  closePosition({ userId, tradeId, isAdmin = false }) {
    let trade;
    if (isAdmin) {
      trade = db.prepare("SELECT * FROM trades WHERE id = ? AND status = 'OPEN'").get(tradeId);
    } else {
      trade = db.prepare("SELECT * FROM trades WHERE id = ? AND user_id = ? AND status = 'OPEN'").get(tradeId, userId);
    }

    if (!trade) throw new Error('Open trade not found or already closed');

    const quote = priceEngine.getPrice(trade.symbol);
    const closePrice = trade.type === 'BUY' ? (quote ? quote.bid : trade.current_price) : (quote ? quote.ask : trade.current_price);
    
    // Realize PnL
    const contractSize = quote ? quote.contract_size : 100000;
    let realizedPnl = 0;
    if (trade.type === 'BUY') {
      realizedPnl = (closePrice - trade.open_price) * trade.lot_size * contractSize;
    } else {
      realizedPnl = (trade.open_price - closePrice) * trade.lot_size * contractSize;
    }
    realizedPnl = Number(realizedPnl.toFixed(2));

    // Update trade status and user balance in a transaction
    const updateTrade = db.prepare(`
      UPDATE trades 
      SET status = 'CLOSED', close_price = ?, pnl = ?, close_time = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

    const updateUser = db.prepare(`
      UPDATE users 
      SET balance = balance + ? 
      WHERE id = ?
    `);

    const transaction = db.transaction(() => {
      updateTrade.run(closePrice, realizedPnl, trade.id);
      updateUser.run(realizedPnl, trade.user_id);
    });

    transaction();

    return {
      success: true,
      tradeId: trade.id,
      closePrice,
      realizedPnl
    };
  }

  updateSlTp({ userId, tradeId, sl, tp }) {
    const trade = db.prepare("SELECT * FROM trades WHERE id = ? AND user_id = ? AND status = 'OPEN'").get(tradeId, userId);
    if (!trade) throw new Error('Trade not found');

    const updateStmt = db.prepare('UPDATE trades SET sl = ?, tp = ? WHERE id = ?');
    updateStmt.run(sl ? parseFloat(sl) : null, tp ? parseFloat(tp) : null, tradeId);

    return db.prepare('SELECT * FROM trades WHERE id = ?').get(tradeId);
  }
}

const tradingEngine = new TradingEngine();
module.exports = tradingEngine;
