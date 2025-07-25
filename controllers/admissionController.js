const Admission = require('../models/Admission');

// @desc    Submit admission application
exports.apply = async (req, res) => {
  try {
    const { name, email, contact, course, category, previousEducation } = req.body;
    const documents = req.files ? req.files.map(file => file.path) : [];
    
    const admission = new Admission({ 
      name, 
      email, 
      contact, 
      course,
      category: category || 'General',
      previousEducation: previousEducation || '',
      documents 
    });
    
    await admission.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Application submitted successfully', 
      admission: admission,
      data: admission 
    });
  } catch (err) {
    console.error('Admission application error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// @desc    Get all admission applications
exports.getAllApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    
    const query = status ? { status } : {};
    
    const applications = await Admission.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Admission.countDocuments(query);
    
    res.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// @desc    Get single admission application
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Admission.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      data: application
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// @desc    Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Pending, Approved, or Rejected'
      });
    }
    
    const application = await Admission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// @desc    Delete admission application
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Admission.findByIdAndDelete(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
}; 