const express = require('express');
const router = express.Router();
const {
  handleLogoUpload,
  getLogos,
  downloadSampleCSV,
  validateCSV,
} = require('../controllers/uploadController');

// Upload & CSV routes
router.post('/upload-logo', handleLogoUpload);
router.get('/logos', getLogos);
router.get('/sample-csv', downloadSampleCSV);
router.post('/upload-csv', validateCSV);

module.exports = router;
