const db = require('../config/db');
const tradingEngine = require('../services/tradingEngine');

exports.getOpenTrades = (req, res) => {
  try {
    const trades = db.prepare(`
      SELECT * FROM trades 
      WHERE user_id = ? AND status = 'OPEN' 
      ORDER BY open_time DESC
    `).all(req.user.id);

    return res.json({ success: true, trades });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTradeHistory = (req, res) => {
  try {
    const trades = db.prepare(`
      SELECT * FROM trades 
      WHERE user_id = ? AND status = 'CLOSED' 
      ORDER BY close_time DESC 
      LIMIT 100
    `).all(req.user.id);

    return res.json({ success: true, trades });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.placeOrder = (req, res) => {
  try {
    const { symbol, type, lotSize, sl, tp } = req.body;

    if (!symbol || !type || !lotSize) {
      return res.status(400).json({ success: false, message: 'Symbol, type, and lotSize are required' });
    }

    const trade = tradingEngine.openPosition({
      userId: req.user.id,
      symbol,
      type,
      lotSize,
      sl,
      tp
    });

    const metrics = tradingEngine.getUserMetrics(req.user.id);

    return res.status(201).json({
      success: true,
      message: `${type} order executed successfully!`,
      trade,
      metrics
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.closeOrder = (req, res) => {
  try {
    const { id } = req.params;
    const result = tradingEngine.closePosition({
      userId: req.user.id,
      tradeId: id
    });

    const metrics = tradingEngine.getUserMetrics(req.user.id);

    return res.json({
      success: true,
      message: 'Position closed successfully',
      result,
      metrics
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateSlTp = (req, res) => {
  try {
    const { id } = req.params;
    const { sl, tp } = req.body;

    const trade = tradingEngine.updateSlTp({
      userId: req.user.id,
      tradeId: id,
      sl,
      tp
    });

    return res.json({ success: true, trade });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
