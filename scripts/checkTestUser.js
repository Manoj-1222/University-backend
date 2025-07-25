const mongoose = require('mongoose');
const Student = require('../models/Student');
require('dotenv').config();

const checkTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find the test user
    const testUser = await Student.findOne({ email: 'testuser@example.com' });
    
    if (testUser) {
      console.log('✅ Test user found:');
      console.log('Email:', testUser.email);
      console.log('Name:', testUser.name);
      console.log('Roll Number:', testUser.rollNumber);
      console.log('Department:', testUser.department);
      console.log('Password hash:', testUser.password ? 'Set' : 'Not set');
      console.log('\n📋 Full user data:');
      console.log(JSON.stringify(testUser, null, 2));
      
      // Since the password is hashed, let's check what the original password was
      // Based on common test patterns, it's likely "test123456" or "password123"
      const bcrypt = require('bcryptjs');
      
      // Test common passwords
      const commonPasswords = ['test123456', 'password123', 'testpass', '123456', 'password'];
      
      for (const pwd of commonPasswords) {
        const isMatch = await bcrypt.compare(pwd, testUser.password);
        if (isMatch) {
          console.log(`🎉 Password found: "${pwd}"`);
          break;
        }
      }
      
    } else {
      console.log('❌ Test user not found');
      
      // Let's see what users exist
      const allUsers = await Student.find({}).select('email name rollNumber');
      console.log('\n👥 Available users:');
      allUsers.forEach(user => {
        console.log(`- ${user.email} (${user.name})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

checkTestUser();
