const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
  getProfile, 
  getGrades, 
  getAttendance, 
  updateProfile,
  test 
} = require('../controllers/studentController');

// Test route
router.get('/test', auth, test);

// Get student profile
router.get('/profile', auth, getProfile);

// Get student grades
router.get('/grades', auth, getGrades);

// Get student attendance
router.get('/attendance', auth, getAttendance);

// Update student profile
router.put('/profile', auth, updateProfile);

module.exports = router;