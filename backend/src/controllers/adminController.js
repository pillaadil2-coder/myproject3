const db = require('../config/db');
const tradingEngine = require('../services/tradingEngine');

exports.getDashboardStats = (req, res) => {
  try {
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'user'").get().count;
    const totalBalance = db.prepare("SELECT SUM(balance) as sum FROM users WHERE role = 'user'").get().sum || 0;
    
    const depositsApproved = db.prepare("SELECT SUM(amount) as sum FROM transactions WHERE type = 'DEPOSIT' AND status = 'APPROVED'").get().sum || 0;
    const withdrawalsApproved = db.prepare("SELECT SUM(amount) as sum FROM transactions WHERE type = 'WITHDRAWAL' AND status = 'APPROVED'").get().sum || 0;
    
    const pendingDepositsCount = db.prepare("SELECT COUNT(*) as count FROM transactions WHERE type = 'DEPOSIT' AND status = 'PENDING'").get().count;
    const pendingWithdrawalsCount = db.prepare("SELECT COUNT(*) as count FROM transactions WHERE type = 'WITHDRAWAL' AND status = 'PENDING'").get().count;
    const pendingKycCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE kyc_status = 'pending'").get().count;
    
    const openTrades = db.prepare("SELECT COUNT(*) as count, SUM(pnl) as totalPnl, SUM(margin) as totalMargin FROM trades WHERE status = 'OPEN'").get();

    return res.json({
      success: true,
      stats: {
        totalUsers,
        totalBalance: Number(totalBalance.toFixed(2)),
        totalDeposits: Number(depositsApproved.toFixed(2)),
        totalWithdrawals: Number(withdrawalsApproved.toFixed(2)),
        pendingDepositsCount,
        pendingWithdrawalsCount,
        pendingKycCount,
        openTradesCount: openTrades.count || 0,
        openTradesPnl: Number((openTrades.totalPnl || 0).toFixed(2)),
        openTradesMargin: Number((openTrades.totalMargin || 0).toFixed(2))
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTraders = (req, res) => {
  try {
    const traders = db.prepare(`
      SELECT id, name, email, role, balance, leverage, kyc_status, created_at 
      FROM users 
      ORDER BY id DESC
    `).all();

    // Attach current equity & open trades count for each trader
    const enriched = traders.map(t => {
      const metrics = tradingEngine.getUserMetrics(t.id);
      return {
        ...t,
        equity: metrics ? metrics.equity : t.balance,
        floatingPnl: metrics ? metrics.floatingPnl : 0,
        openTradesCount: metrics ? metrics.openPositionsCount : 0
      };
    });

    return res.json({ success: true, traders: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.adjustBalance = (req, res) => {
  try {
    const { userId, amount, type, note } = req.body; // type: 'CREDIT' or 'DEBIT'
    
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const delta = type === 'DEBIT' ? -val : val;

    const stmt = db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?');
    stmt.run(delta, userId);

    // Record in transactions table
    const logStmt = db.prepare(`
      INSERT INTO transactions (user_id, type, amount, method, status, notes)
      VALUES (?, ?, ?, 'ADMIN_ADJUSTMENT', 'APPROVED', ?)
    `);
    logStmt.run(userId, type === 'DEBIT' ? 'WITHDRAWAL' : 'DEPOSIT', val, note || `Admin Balance Adjustment (${type})`);

    const updatedUser = db.prepare('SELECT id, name, email, balance FROM users WHERE id = ?').get(userId);
    return res.json({ success: true, message: `Balance updated for ${updatedUser.name}`, user: updatedUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUserLeverage = (req, res) => {
  try {
    const { userId, leverage } = req.body;
    const lev = parseInt(leverage, 10);
    if (!lev || lev <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid leverage' });
    }

    db.prepare('UPDATE users SET leverage = ? WHERE id = ?').run(lev, userId);
    return res.json({ success: true, message: `Leverage updated to 1:${lev}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTransactions = (req, res) => {
  try {
    const { status, type } = req.query;
    let query = `
      SELECT t.*, u.name as user_name, u.email as user_email 
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ` AND t.status = ?`;
      params.push(status);
    }
    if (type) {
      query += ` AND t.type = ?`;
      params.push(type);
    }

    query += ` ORDER BY t.created_at DESC LIMIT 200`;

    const transactions = db.prepare(query).all(...params);
    return res.json({ success: true, transactions });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveDeposit = (req, res) => {
  try {
    const { id } = req.params;
    const tx = db.prepare("SELECT * FROM transactions WHERE id = ? AND type = 'DEPOSIT' AND status = 'PENDING'").get(id);
    if (!tx) {
      return res.status(404).json({ success: false, message: 'Pending deposit transaction not found' });
    }

    const updateTx = db.prepare("UPDATE transactions SET status = 'APPROVED' WHERE id = ?");
    const updateUser = db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?');

    const transaction = db.transaction(() => {
      updateTx.run(tx.id);
      updateUser.run(tx.amount, tx.user_id);
    });
    transaction();

    return res.json({ success: true, message: `Deposit of $${tx.amount} approved and credited to trader wallet!` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.rejectDeposit = (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    db.prepare("UPDATE transactions SET status = 'REJECTED', notes = ? WHERE id = ?").run(reason || 'Rejected by admin', id);
    return res.json({ success: true, message: 'Deposit rejected' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveWithdrawal = (req, res) => {
  try {
    const { id } = req.params;
    const tx = db.prepare("SELECT * FROM transactions WHERE id = ? AND type = 'WITHDRAWAL' AND status = 'PENDING'").get(id);
    if (!tx) {
      return res.status(404).json({ success: false, message: 'Pending withdrawal transaction not found' });
    }

    const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(tx.user_id);
    if (user.balance < tx.amount) {
      return res.status(400).json({ success: false, message: 'Trader does not have enough balance' });
    }

    const updateTx = db.prepare("UPDATE transactions SET status = 'APPROVED' WHERE id = ?");
    const updateUser = db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?');

    const transaction = db.transaction(() => {
      updateTx.run(tx.id);
      updateUser.run(tx.amount, tx.user_id);
    });
    transaction();

    return res.json({ success: true, message: `Withdrawal of $${tx.amount} approved and deducted!` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.rejectWithdrawal = (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    db.prepare("UPDATE transactions SET status = 'REJECTED', notes = ? WHERE id = ?").run(reason || 'Rejected by admin', id);
    return res.json({ success: true, message: 'Withdrawal rejected' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getKycList = (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, name, email, kyc_status, kyc_doc_type, kyc_doc_number, kyc_doc_file, created_at 
      FROM users 
      WHERE kyc_status != 'unverified'
      ORDER BY id DESC
    `).all();
    return res.json({ success: true, users, kycList: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateKycStatus = (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    db.prepare('UPDATE users SET kyc_status = ? WHERE id = ?').run(status, userId);
    return res.json({ success: true, message: `Trader KYC status updated to: ${status}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllOpenTrades = (req, res) => {
  try {
    const trades = db.prepare(`
      SELECT t.*, u.name as user_name, u.email as user_email 
      FROM trades t
      JOIN users u ON t.user_id = u.id
      WHERE t.status = 'OPEN'
      ORDER BY t.open_time DESC
    `).all();

    return res.json({ success: true, trades, openTrades: trades });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminForceCloseTrade = (req, res) => {
  try {
    const { id } = req.params;
    const result = tradingEngine.closePosition({
      tradeId: id,
      isAdmin: true
    });

    return res.json({ success: true, message: 'Position force-closed by admin', result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
