require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Student = require('./models/Student');

async function testLogin() {
  try {
    console.log('🔧 Environment Check:');
    console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Test credentials
    const email = 'testuser@example.com';
    const password = 'test123456';
    
    console.log('\n🔍 Testing login for:', email);
    
    // Find user
    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
      console.log('❌ Student not found');
      return;
    }
    
    console.log('✅ Student found:', student.name);
    console.log('Password hash exists:', !!student.password);
    console.log('Password hash length:', student.password?.length);
    
    // Test password comparison
    if (!student.password) {
      console.log('❌ No password hash stored for user');
      return;
    }
    
    const isMatch = await bcrypt.compare(password, student.password);
    console.log('Password match result:', isMatch);
    
    if (isMatch) {
      // Test JWT creation
      const payload = {
        user: {
          id: student._id,
          email: student.email,
          name: student.name
        }
      };
      
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log('✅ JWT token created successfully');
      console.log('Token length:', token.length);
      
      // Test JWT verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ JWT verification successful');
      console.log('Decoded user:', decoded.user.email);
    } else {
      console.log('❌ Password does not match');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

testLogin();
