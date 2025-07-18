require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();

app.use(express.json());

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://university-frontend-nu.vercel.app',
        'https://university-frontend-manoj-1222.vercel.app',
        'https://university-frontend.vercel.app',
        // Add your actual frontend domain here when deployed
      ]
    : ['http://localhost:3000', 'http://localhost:5173'], // Development origins
  credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/student', require('./routes/student'));
app.use('/api/admissions', require('./routes/admissions'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 