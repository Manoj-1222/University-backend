const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { login, register, getMe } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new student
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login student
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current logged in student
// @access  Private
router.get('/me', auth, getMe);

module.exports = router;