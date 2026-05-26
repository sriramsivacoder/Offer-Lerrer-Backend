const express = require('express');
const router = express.Router();
const { sendMails, verifySmtp, getSmtpSettings } = require('../controllers/mailController');

// Mail routes
router.post('/send-mails', sendMails);
router.post('/verify-smtp', verifySmtp);
router.get('/smtp-settings', getSmtpSettings);

module.exports = router;
