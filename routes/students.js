const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { 
  getProfile, 
  updateProfile,
  getAllStudents,
  getStudentById,
  getAttendance,
  getFees,
  updateFees,
  getPlacementStatus,
  updatePlacementStatus
} = require('../controllers/studentController');

// @route   GET /api/students
// @desc    Get all students (Admin only)
// @access  Private
router.get('/', auth, getAllStudents);

// @route   GET /api/students/profile
// @desc    Get current student profile
// @access  Private
router.get('/profile', auth, getProfile);

// @route   PUT /api/students/profile
// @desc    Update current student profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   GET /api/students/:id
// @desc    Get student by ID (Admin only)
// @access  Private
router.get('/:id', auth, getStudentById);

// @route   GET /api/students/attendance
// @desc    Get current student attendance
// @access  Private
router.get('/attendance', auth, getAttendance);

// @route   GET /api/students/fees
// @desc    Get current student fee details
// @access  Private
router.get('/fees', auth, getFees);

// @route   PUT /api/students/fees
// @desc    Update student fee payment
// @access  Private
router.put('/fees', auth, updateFees);

// @route   GET /api/students/placement
// @desc    Get current student placement status
// @access  Private
router.get('/placement', auth, getPlacementStatus);

// @route   PUT /api/students/placement
// @desc    Update student placement status
// @access  Private
router.put('/placement', auth, updatePlacementStatus);

module.exports = router;