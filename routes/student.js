const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, getGrades, getAttendance } = require('../controllers/studentController');

router.get('/profile', auth, getProfile);
router.get('/grades', auth, getGrades);
router.get('/attendance', auth, getAttendance);

module.exports = router; 