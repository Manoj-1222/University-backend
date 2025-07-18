const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { z } = require('zod');
const rateLimiter = require('../middleware/rateLimiter');

const loginSchema = z.object({
  rollNo: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6)
});

router.post('/login', rateLimiter, validate(loginSchema), login);
router.post('/logout', logout);

module.exports = router; 