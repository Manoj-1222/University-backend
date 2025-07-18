const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Make sure server.js exports the app

// Test user data
const testStudent = {
  rollNo: 'TST123',
  email: 'teststudent@example.com',
  password: 'TestPass123',
  name: 'Test Student',
  department: 'CS',
  semester: 1,
  contact: '1234567890',
  parentsDetails: { fatherName: 'Father', motherName: 'Mother' }
};

let token = '';

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Create a test student directly in the DB (hashed password)
  const Student = require('../models/Student');
  const bcrypt = require('bcryptjs');
  await Student.deleteMany({ email: testStudent.email }); // Clean up
  const hashedPassword = await bcrypt.hash(testStudent.password, 10);
  await Student.create({ ...testStudent, password: hashedPassword });
});

afterAll(async () => {
  // Clean up test student and close DB
  const Student = require('../models/Student');
  await Student.deleteMany({ email: testStudent.email });
  await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
  it('should login and return a JWT token', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/auth/login')
      .send({ email: testStudent.email, password: testStudent.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should logout', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/auth/logout');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Logged out');
  });
});

describe('Student Endpoints', () => {
  it('should get student profile', async () => {
    const res = await request('http://localhost:5000')
      .get('/api/student/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(testStudent.email);
  });

  it('should get student grades', async () => {
    const res = await request('http://localhost:5000')
      .get('/api/student/grades')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get student attendance', async () => {
    const res = await request('http://localhost:5000')
      .get('/api/student/attendance')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('Admissions Endpoint', () => {
  it('should submit an admission form', async () => {
    const res = await request('http://localhost:5000')
      .post('/api/admissions/apply')
      .field('name', 'Applicant')
      .field('email', 'applicant@example.com')
      .field('contact', '9876543210')
      .field('course', 'CS')
      // .attach('documents', 'path/to/file.pdf') // Uncomment and provide a real file path if you want to test file upload
    expect(res.statusCode).toBe(201);
    expect(res.body.admission).toBeDefined();
    expect(res.body.admission.email).toBe('applicant@example.com');
  });
}); 