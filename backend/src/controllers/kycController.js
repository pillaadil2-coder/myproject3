const db = require('../config/db');

exports.getKycStatus = (req, res) => {
  try {
    const user = db.prepare('SELECT id, kyc_status, kyc_doc_type, kyc_doc_number, kyc_doc_file FROM users WHERE id = ?').get(req.user.id);
    return res.json({ success: true, kyc: user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitKyc = (req, res) => {
  try {
    const { docType, docNumber } = req.body;

    if (!docType || !docNumber) {
      return res.status(400).json({ success: false, message: 'Document type and document number are required' });
    }

    const filename = req.file ? req.file.filename : null;

    const stmt = db.prepare(`
      UPDATE users 
      SET kyc_status = 'pending', kyc_doc_type = ?, kyc_doc_number = ?, kyc_doc_file = ? 
      WHERE id = ?
    `);

    stmt.run(docType, docNumber, filename, req.user.id);

    return res.json({
      success: true,
      message: 'KYC documents submitted successfully! Admin will review within 24 hours.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
