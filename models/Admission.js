const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  previousEducation: {
    type: String,
    default: ''
  },
  documents: [String], // file paths
  status: { 
    type: String, 
    default: "Pending",
    enum: ['Pending', 'Approved', 'Rejected']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admission', admissionSchema); 