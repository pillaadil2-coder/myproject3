const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticateToken);

router.get('/transactions', walletController.getTransactions);
router.post('/deposit', upload.single('proof'), walletController.requestDeposit);
router.post('/withdraw', walletController.requestWithdrawal);

module.exports = router;
