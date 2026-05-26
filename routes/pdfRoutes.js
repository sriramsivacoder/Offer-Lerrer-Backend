const express = require('express');
const router = express.Router();
const { generatePDF, previewPDF } = require('../controllers/pdfController');

// PDF routes
router.post('/generate-pdf', generatePDF);
router.post('/preview-pdf', previewPDF);

module.exports = router;
