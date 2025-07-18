const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNo: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  name: String,
  department: String,
  semester: Number,
  contact: String,
  parentsDetails: {
    fatherName: String,
    motherName: String
  },
  attendance: [{ date: Date, status: String }],
  grades: [{ subject: String, marks: Number }]
});

module.exports = mongoose.model('Student', studentSchema); 