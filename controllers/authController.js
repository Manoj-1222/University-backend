const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

// Login controller
const login = async (req, res) => {
  try {
    console.log('Login attempt for:', req.body.email);
    
    const { email, password } = req.body;
    
    console.log('🔵 Login attempt:', { email, passwordLength: password?.length });

    // Validate input
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Check if user exists
    console.log('🔍 Looking for student with email:', email);
    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
      console.log('❌ Student not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Student found:', student.name, '- ID:', student._id);
    console.log('🔍 Password hash length:', student.password?.length);

    // Check password
    console.log('🔍 Comparing password...');
    const isMatch = await bcrypt.compare(password, student.password);
    console.log('🔍 Password match result:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Password match successful for:', email);

    // Create JWT payload
    const payload = {
      user: {
        id: student._id.toString(),
        email: student.email,
        name: student.name,
        rollNo: student.rollNo,
        department: student.department
      }
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: '7d',
      issuer: 'university-system',
      audience: 'university-students'
    });

    console.log('JWT token created for:', student.name);

    // Send response
    res.json({
      success: true,
      token,
      user: {
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        rollNo: student.rollNo,
        department: student.department,
        semester: student.semester
      },
      message: 'Login successful'
    });

  } catch (err) {
    console.error('Login error:', err);
    
    if (err.name === 'MongoNetworkError') {
      return res.status(503).json({ message: 'Database connection error' });
    }
    
    res.status(500).json({ 
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Register controller
const register = async (req, res) => {
  try {
    const { name, email, password, rollNo, department, year, contact, semester } = req.body;

    // Validate input
    if (!name || !email || !password || !rollNo || !department || !year || !contact || !semester) {
      return res.status(400).json({ message: 'All fields are required (name, email, password, rollNo, department, year, contact, semester)' });
    }

    // Check if user already exists
    let student = await Student.findOne({ $or: [{ email }, { rollNo }] });
    if (student) {
      if (student.email === email) {
        return res.status(400).json({ message: 'Student with this email already exists' });
      }
      if (student.rollNo === rollNo) {
        return res.status(400).json({ message: 'Student with this roll number already exists' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new student
    student = new Student({
      name,
      email,
      password: hashedPassword,
      rollNo,
      department,
      year,
      contact,
      semester
    });

    await student.save();

    // Create JWT payload
    const payload = {
      user: {
        id: student._id.toString(),
        email: student.email,
        name: student.name,
        rollNo: student.rollNo,
        department: student.department
      }
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { 
      expiresIn: '7d',
      issuer: 'university-system',
      audience: 'university-students'
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: student._id.toString(),
        name: student.name,
        email: student.email,
        rollNo: student.rollNo,
        department: student.department
      },
      message: 'Registration successful'
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// Get current logged in user
const getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  register,
  getMe
};