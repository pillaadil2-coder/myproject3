const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/open', tradeController.getOpenTrades);
router.get('/history', tradeController.getTradeHistory);
router.post('/order', tradeController.placeOrder);
router.post('/close/:id', tradeController.closeOrder);
router.put('/update-sltp/:id', tradeController.updateSlTp);

module.exports = router;
