const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  handleLogoUpload,
  getLogos,
  downloadSampleCSV,
  validateCSV,
} = require('../controllers/uploadController');

// Upload & CSV routes (protected)
router.post('/upload-logo', protect, handleLogoUpload);
router.get('/logos', protect, getLogos);
router.get('/sample-csv', protect, downloadSampleCSV);
router.post('/upload-csv', protect, validateCSV);

module.exports = router;
