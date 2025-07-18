const Admission = require('../models/Admission');

exports.apply = async (req, res) => {
  try {
    const { name, email, contact, course } = req.body;
    const documents = req.files ? req.files.map(file => file.path) : [];
    const admission = new Admission({ name, email, contact, course, documents });
    await admission.save();
    res.status(201).json({ message: 'Application submitted', admission });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 