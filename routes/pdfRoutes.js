const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generatePDF, previewPDF } = require('../controllers/pdfController');

// PDF routes require authentication
router.post('/generate-pdf', protect, generatePDF);
router.post('/preview-pdf', protect, previewPDF);

module.exports = router;
