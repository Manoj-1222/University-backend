const Student = require('../models/Student');
const mongoose = require('mongoose');

// @desc    Get all students (Admin only)
exports.getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const department = req.query.department;
    const year = req.query.year;
    
    const query = {};
    if (department) query.department = department;
    if (year) query.year = parseInt(year);
    
    const students = await Student.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rollNo: 1 });
    
    const total = await Student.countDocuments(query);
    
    res.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student by ID (Admin only)
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get current student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update student profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['phone', 'bloodGroup', 'dateOfBirth', 'currentCGPA', 'totalFee', 'paidAmount', 'attendance', 'totalCredits'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student attendance
exports.getAttendance = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const student = await Student.findById(req.user.id).select('attendance name rollNo');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.json({
      success: true,
      attendance: student.attendance || { percentage: 0 },
      data: {
        name: student.name,
        rollNo: student.rollNo,
        attendance: student.attendance || { percentage: 0 }
      }
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student fee details
exports.getFees = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const student = await Student.findById(req.user.id).select('totalFee paidAmount name rollNo');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    const pendingAmount = (student.totalFee || 0) - (student.paidAmount || 0);
    
    res.json({
      success: true,
      fees: {
        totalFee: student.totalFee || 0,
        paidAmount: student.paidAmount || 0,
        pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
        status: pendingAmount <= 0 ? 'Paid' : 'Pending'
      },
      data: {
        name: student.name,
        rollNo: student.rollNo,
        totalFee: student.totalFee || 0,
        paidAmount: student.paidAmount || 0,
        pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
        status: pendingAmount <= 0 ? 'Paid' : 'Pending'
      }
    });
  } catch (error) {
    console.error('Get fees error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update fee payment
exports.updateFees = async (req, res) => {
  try {
    const { paymentAmount } = req.body;
    
    if (!paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount'
      });
    }
    
    const student = await Student.findById(req.user.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    student.paidAmount = (student.paidAmount || 0) + paymentAmount;
    await student.save();
    
    const pendingAmount = (student.totalFee || 0) - student.paidAmount;
    
    res.json({
      success: true,
      message: 'Payment recorded successfully',
      data: {
        totalFee: student.totalFee || 0,
        paidAmount: student.paidAmount,
        pendingAmount: pendingAmount > 0 ? pendingAmount : 0,
        status: pendingAmount <= 0 ? 'Paid' : 'Pending'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get placement status
exports.getPlacementStatus = async (req, res) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const student = await Student.findById(req.user.id).select('placementStatus company package name rollNo');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.json({
      success: true,
      placement: {
        status: student.placementStatus || 'Not Placed',
        company: student.company || null,
        package: student.package || null
      },
      data: {
        name: student.name,
        rollNo: student.rollNo,
        placementStatus: student.placementStatus || 'Not Placed',
        company: student.company || null,
        package: student.package || null
      }
    });
  } catch (error) {
    console.error('Get placement status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update placement status
exports.updatePlacementStatus = async (req, res) => {
  try {
    const { placementStatus, company, package: packageAmount } = req.body;
    
    const validStatuses = ['Not Placed', 'Placed', 'Higher Studies'];
    if (!validStatuses.includes(placementStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid placement status'
      });
    }
    
    const updateData = { placementStatus };
    if (placementStatus === 'Placed') {
      updateData.company = company;
      updateData.package = packageAmount;
    }
    
    const student = await Student.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('placementStatus company package name rollNo');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Placement status updated successfully',
      data: {
        name: student.name,
        rollNo: student.rollNo,
        placementStatus: student.placementStatus,
        company: student.company,
        package: student.package
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
