const express = require('express');
const router = express.Router();
const priceEngine = require('../services/priceEngine');
const db = require('../config/db');

// Get all instruments with current live quotes
router.get('/instruments', (req, res) => {
  try {
    const quotes = priceEngine.getAllPrices();
    return res.json({ success: true, instruments: quotes });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get quote for single symbol
router.get('/quote/:symbol', (req, res) => {
  try {
    const symbol = decodeURIComponent(req.params.symbol);
    const quote = priceEngine.getPrice(symbol);
    if (!quote) {
      return res.status(404).json({ success: false, message: 'Symbol not found' });
    }
    return res.json({ success: true, quote });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
