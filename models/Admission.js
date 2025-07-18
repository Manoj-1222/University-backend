const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  course: String,
  documents: [String], // file paths
  status: { type: String, default: "Pending" }
});

module.exports = mongoose.model('Admission', admissionSchema); 