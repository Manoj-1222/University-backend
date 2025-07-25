# University Management System - Backend API

Node.js/Express backend for the University Management System with comprehensive API endpoints.

## 🚀 **Deployment**
- **Live API**: [https://university-backend-nu.vercel.app](https://university-backend-nu.vercel.app)
- **Database**: MongoDB Atlas

## 📋 **Features**
- ✅ JWT Authentication system
- ✅ Student profile management
- ✅ Academic performance tracking
- ✅ Attendance management
- ✅ Fee management system
- ✅ Placement tracking
- ✅ University information endpoints
- ✅ Admission application system
- ✅ Rate limiting and security
- ✅ Comprehensive error handling
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive data validation and sanitization

## Tech Stack

- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **Mongoose**: MongoDB object modeling
- **Multer**: File upload handling
- **Express Rate Limit**: API rate limiting
- **Joi**: Data validation
- **CORS**: Cross-origin resource sharing

## Project Structure

```
backend/
├── controllers/        # Request handlers
│   ├── admissionController.js
│   ├── authController.js
│   └── studentController.js
├── middleware/         # Custom middleware
│   ├── authMiddleware.js
│   ├── rateLimiter.js
│   └── validate.js
├── models/            # Database models
│   ├── Admission.js
│   └── Student.js
├── routes/            # API routes
│   ├── admissions.js
│   ├── auth.js
│   └── student.js
├── tests/             # Test files
│   └── api.test.js
├── uploads/           # File upload directory
├── .env              # Environment variables
├── .gitignore        # Git ignore rules
├── package.json      # Project dependencies
└── server.js         # Application entry point
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Manoj-1222/University-backend.git
cd University-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/university
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student profile
- `DELETE /api/students/:id` - Delete student

### Admissions
- `POST /api/admissions` - Submit admission application
- `GET /api/admissions` - Get all admission applications
- `GET /api/admissions/:id` - Get admission by ID
- `PUT /api/admissions/:id` - Update admission status

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/university
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For any queries or support, please contact the development team.
