const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false // Don't include password in queries by default
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  phone: {
    type: String
  },
  
  // Personal Details
  dateOfBirth: Date,
  bloodGroup: String,
  
  // Academic Information
  currentCGPA: {
    type: Number,
    default: 0.0
  },
  totalCredits: {
    type: Number,
    default: 0
  },
  
  // Attendance
  attendance: {
    percentage: {
      type: Number,
      default: 0
    }
  },
  
  // Fee Structure
  totalFee: {
    type: Number,
    default: 0
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  
  // Placement Status
  placementStatus: {
    type: String,
    enum: ['Not Placed', 'Placed', 'Higher Studies'],
    default: 'Not Placed'
  },
  company: String,
  package: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);