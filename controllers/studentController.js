const Student = require('../models/Student');

exports.getProfile = async (req, res) => {
  const student = await Student.findById(req.user.id).select('-password');
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
};

exports.getGrades = async (req, res) => {
  const student = await Student.findById(req.user.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student.grades);
};

exports.getAttendance = async (req, res) => {
  const student = await Student.findById(req.user.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student.attendance);
}; 