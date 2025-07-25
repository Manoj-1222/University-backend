const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
require('dotenv').config();

const setTestUserPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Hash the password
    const password = 'test123456';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update the test user with the password
    const result = await Student.updateOne(
      { email: 'testuser@example.com' },
      { 
        password: hashedPassword,
        rollNumber: 'FE001' // Also fix the rollNumber field
      }
    );
    
    if (result.matchedCount > 0) {
      console.log('✅ Test user password updated successfully!');
      console.log('📧 Email: testuser@example.com');
      console.log('🔐 Password: test123456');
      
      // Verify the user
      const testUser = await Student.findOne({ email: 'testuser@example.com' }).select('+password');
      console.log('✅ Password hash set:', testUser.password ? 'Yes' : 'No');
      
      // Test login
      const isMatch = await bcrypt.compare('test123456', testUser.password);
      console.log('✅ Password verification:', isMatch ? 'Success' : 'Failed');
      
    } else {
      console.log('❌ Test user not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

setTestUserPassword();
