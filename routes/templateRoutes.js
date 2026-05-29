const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  resetTemplate,
} = require('../controllers/templateController');

// All template routes require authentication
router.get('/templates', protect, getTemplates);
router.post('/templates', protect, createTemplate);
router.put('/templates/:id', protect, updateTemplate);
router.delete('/templates/:id', protect, deleteTemplate);
router.post('/templates/:id/reset', protect, resetTemplate);

module.exports = router;
