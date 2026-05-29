const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { sendMails, verifySmtp, getSmtpSettings } = require('../controllers/mailController');

// All mail routes require authentication
router.post('/send-mails', protect, sendMails);
router.post('/verify-smtp', protect, verifySmtp);
router.get('/smtp-settings', protect, getSmtpSettings);

module.exports = router;
