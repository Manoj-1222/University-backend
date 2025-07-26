const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

// Load production environment variables
require('../config/production-env');

const addTestStudent = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Check if test student already exists
    const existingStudent = await Student.findOne({ email: 'testuser@example.com' });
    
    if (existingStudent) {
      console.log('⚠️ Test student already exists, updating...');
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('test123456', salt);
      
      // Update the existing student
      await Student.findByIdAndUpdate(existingStudent._id, {
        password: hashedPassword,
        currentCGPA: 8.5,
        totalCredits: 85,
        attendance: { percentage: 88 },
        totalFee: 50000,
        paidAmount: 35000,
        placementStatus: 'Not Placed'
      });
      
      console.log('✅ Test student updated successfully');
    } else {
      console.log('🔄 Creating new test student...');
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('test123456', salt);
      
      // Create test student
      const testStudent = new Student({
        name: 'Test Student',
        rollNo: 'CS21001',
        email: 'testuser@example.com',
        password: hashedPassword,
        department: 'Computer Science',
        year: 3,
        semester: 6,
        phone: '+91-9876543210',
        dateOfBirth: new Date('2002-01-15'),
        bloodGroup: 'B+',
        currentCGPA: 8.5,
        totalCredits: 85,
        attendance: {
          percentage: 88
        },
        totalFee: 50000,
        paidAmount: 35000,
        placementStatus: 'Not Placed',
        company: null,
        package: null
      });
      
      await testStudent.save();
      console.log('✅ Test student created successfully');
    }
    
    // Verify the student can be found and authenticated
    const student = await Student.findOne({ email: 'testuser@example.com' }).select('+password');
    
    if (student) {
      const isMatch = await bcrypt.compare('test123456', student.password);
      console.log('🔍 Password verification test:', isMatch ? '✅ PASSED' : '❌ FAILED');
      
      console.log('📋 Test Student Details:');
      console.log('- Name:', student.name);
      console.log('- Email:', student.email);
      console.log('- Roll No:', student.rollNo);
      console.log('- Department:', student.department);
      console.log('- CGPA:', student.currentCGPA);
      console.log('- Attendance:', student.attendance.percentage + '%');
      console.log('- Fee Status:', `₹${student.paidAmount}/${student.totalFee}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('🔄 Closing database connection...');
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  }
};

// Run the script
addTestStudent();
