const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Protected auth routes
router.get('/auth/me', protect, getMe);
router.post('/auth/logout', protect, logout);

module.exports = router;
