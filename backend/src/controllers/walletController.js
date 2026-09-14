const db = require('../config/db');
const tradingEngine = require('../services/tradingEngine');

exports.getTransactions = (req, res) => {
  try {
    const transactions = db.prepare(`
      SELECT * FROM transactions 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(req.user.id);

    return res.json({ success: true, transactions });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.requestDeposit = (req, res) => {
  try {
    const { amount, method, tx_hash, notes } = req.body;

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid deposit amount' });
    }

    if (!method) {
      return res.status(400).json({ success: false, message: 'Payment method is required' });
    }

    const proofFile = req.file ? req.file.filename : null;

    const stmt = db.prepare(`
      INSERT INTO transactions (user_id, type, amount, method, status, tx_hash, proof_file, notes)
      VALUES (?, 'DEPOSIT', ?, ?, 'PENDING', ?, ?, ?)
    `);

    const result = stmt.run(
      req.user.id,
      depositAmount,
      method,
      tx_hash || '',
      proofFile,
      notes || ''
    );

    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Deposit request submitted successfully! Funds will be credited once verified by admin.',
      transaction
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.requestWithdrawal = (req, res) => {
  try {
    const { amount, method, address, notes } = req.body;

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
    }

    const metrics = tradingEngine.getUserMetrics(req.user.id);
    if (metrics.freeMargin < withdrawAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient free margin for withdrawal. Available: $${metrics.freeMargin}`
      });
    }

    const stmt = db.prepare(`
      INSERT INTO transactions (user_id, type, amount, method, status, tx_hash, notes)
      VALUES (?, 'WITHDRAWAL', ?, ?, 'PENDING', ?, ?)
    `);

    const result = stmt.run(
      req.user.id,
      withdrawAmount,
      method || 'USDT_TRC20',
      address || '',
      notes || ''
    );

    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted! It will be reviewed by admin within 24 hours.',
      transaction
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
