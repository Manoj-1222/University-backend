const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', auth, async (req, res) => {
  try {
    const Student = require('../models/Student');
    const Admission = require('../models/Admission');
    
    const totalStudents = await Student.countDocuments();
    const totalApplications = await Admission.countDocuments();
    const pendingApplications = await Admission.countDocuments({ status: 'Pending' });
    const approvedApplications = await Admission.countDocuments({ status: 'Approved' });
    const rejectedApplications = await Admission.countDocuments({ status: 'Rejected' });
    
    // Placement statistics
    const placedStudents = await Student.countDocuments({ placementStatus: 'Placed' });
    const notPlacedStudents = await Student.countDocuments({ placementStatus: 'Not Placed' });
    
    // Department-wise student count
    const departmentStats = await Student.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          avgCGPA: { $avg: '$currentCGPA' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        totalStudents: totalStudents,
        totalApplications: totalApplications,
        students: {
          total: totalStudents,
          placed: placedStudents,
          notPlaced: notPlacedStudents,
          placementRate: totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(2) : 0
        },
        admissions: {
          total: totalApplications,
          pending: pendingApplications,
          approved: approvedApplications,
          rejected: rejectedApplications
        },
        departments: departmentStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/students/analytics
// @desc    Get student analytics
// @access  Private (Admin only)
router.get('/students/analytics', auth, async (req, res) => {
  try {
    const Student = require('../models/Student');
    
    // CGPA distribution
    const cgpaStats = await Student.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $gte: ['$currentCGPA', 9] }, then: 'Excellent (9.0+)' },
                { case: { $gte: ['$currentCGPA', 8] }, then: 'Very Good (8.0-8.9)' },
                { case: { $gte: ['$currentCGPA', 7] }, then: 'Good (7.0-7.9)' },
                { case: { $gte: ['$currentCGPA', 6] }, then: 'Average (6.0-6.9)' }
              ],
              default: 'Below Average (<6.0)'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Attendance analysis
    const attendanceStats = await Student.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $gte: ['$attendance.percentage', 90] }, then: 'Excellent (90%+)' },
                { case: { $gte: ['$attendance.percentage', 80] }, then: 'Good (80-89%)' },
                { case: { $gte: ['$attendance.percentage', 70] }, then: 'Average (70-79%)' }
              ],
              default: 'Poor (<70%)'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        cgpaDistribution: cgpaStats,
        attendanceDistribution: attendanceStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
