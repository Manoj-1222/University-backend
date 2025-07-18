const express = require('express');
const router = express.Router();
const multer = require('multer');
const { apply } = require('../controllers/admissionController');
const validate = require('../middleware/validate');
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

router.post('/apply', upload.array('documents', 5), validate(admissionSchema), apply);

module.exports = router; 