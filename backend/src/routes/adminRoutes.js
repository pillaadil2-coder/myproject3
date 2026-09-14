const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard stats
router.get('/stats', adminController.getDashboardStats);

// Traders
router.get('/traders', adminController.getTraders);
router.post('/traders/adjust-balance', adminController.adjustBalance);
router.post('/traders/leverage', adminController.updateUserLeverage);

// Transactions
router.get('/transactions', adminController.getTransactions);
router.post('/deposit/:id/approve', adminController.approveDeposit);
router.post('/deposit/:id/reject', adminController.rejectDeposit);
router.post('/withdraw/:id/approve', adminController.approveWithdrawal);
router.post('/withdraw/:id/reject', adminController.rejectWithdrawal);

// KYC
router.get('/kyc/list', adminController.getKycList);
router.post('/kyc/:userId/status', adminController.updateKycStatus);

// Trades Risk Monitor
router.get('/trades/open', adminController.getAllOpenTrades);
router.post('/trades/:id/force-close', adminController.adminForceCloseTrade);

module.exports = router;
