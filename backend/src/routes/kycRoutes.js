const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kycController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticateToken);

router.get('/status', kycController.getKycStatus);
router.post('/submit', upload.single('document'), kycController.submitKyc);

module.exports = router;
