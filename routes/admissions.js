const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
  apply, 
  getAllApplications, 
  getApplicationById, 
  updateApplicationStatus,
  deleteApplication 
} = require('../controllers/admissionController');
const validate = require('../middleware/validate');
const auth = require('../middleware/authMiddleware');
const { z } = require('zod');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const admissionSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  contact: z.string().min(10),
  course: z.string().min(2)
});

// @route   POST /api/admissions/apply
// @desc    Submit admission application
// @access  Public
router.post('/apply', upload.array('documents', 5), validate(admissionSchema), apply);

// @route   GET /api/admissions
// @desc    Get all admission applications (Admin only)
// @access  Private
router.get('/', auth, getAllApplications);

// @route   GET /api/admissions/:id
// @desc    Get single admission application
// @access  Private
router.get('/:id', auth, getApplicationById);

// @route   PUT /api/admissions/:id/status
// @desc    Update application status (Admin only)
// @access  Private
router.put('/:id/status', auth, updateApplicationStatus);

// @route   DELETE /api/admissions/:id
// @desc    Delete admission application (Admin only)
// @access  Private
router.delete('/:id', auth, deleteApplication);

module.exports = router; 