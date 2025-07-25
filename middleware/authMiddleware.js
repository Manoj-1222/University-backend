const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization');

    console.log('Auth middleware - Token received:', !!token);

    // Check if no token
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Check if token starts with Bearer
    if (!token.startsWith('Bearer ')) {
      console.log('Invalid token format - missing Bearer prefix');
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Extract token (remove 'Bearer ' prefix)
    const actualToken = token.replace('Bearer ', '').trim();
    
    if (!actualToken) {
      console.log('Empty token after Bearer extraction');
      return res.status(401).json({ message: 'Empty token provided' });
    }

    console.log('Extracted token length:', actualToken.length);

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not found in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Verify token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    console.log('Token decoded successfully for user:', decoded.user?.email || 'unknown');

    // Validate decoded token structure
    if (!decoded.user || !decoded.user.id) {
      console.log('Invalid token structure - missing user data');
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    // Add user to request
    req.user = decoded.user;
    next();

  } catch (err) {
    console.error('Auth middleware error:', err);

    if (err.name === 'TokenExpiredError') {
      console.log('Token expired');
      return res.status(401).json({ message: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      console.log('Invalid token:', err.message);
      return res.status(401).json({ message: 'Invalid token' });
    } else if (err.name === 'NotBeforeError') {
      console.log('Token not active yet');
      return res.status(401).json({ message: 'Token not active' });
    } else {
      console.log('Token verification error:', err.message);
      return res.status(500).json({ message: 'Authentication service error' });
    }
  }
};