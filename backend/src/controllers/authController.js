const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');
const tradingEngine = require('../services/tradingEngine');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const insertStmt = db.prepare(`
      INSERT INTO users (name, email, password, role, balance, leverage, kyc_status)
      VALUES (?, ?, ?, 'user', 10000.0, 100, 'unverified')
    `);

    const result = insertStmt.run(name.trim(), email.toLowerCase().trim(), hashedPassword);
    const userId = result.lastInsertRowid;

    const token = jwt.sign({ id: userId, email: email.toLowerCase().trim() }, JWT_SECRET, { expiresIn: '7d' });

    const metrics = tradingEngine.getUserMetrics(userId);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! $10,000 trading balance credited.',
      token,
      metrics
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const metrics = tradingEngine.getUserMetrics(user.id);

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      metrics
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const metrics = tradingEngine.getUserMetrics(req.user.id);
    return res.json({ success: true, metrics });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
