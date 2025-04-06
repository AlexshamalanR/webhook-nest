const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      console.log('No token provided in request');
      return res.status(401).json({ message: 'Authentication token is required' });
    }

    console.log('Verifying token...');
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Token decoded:', decoded);
    
    // Find the user
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      console.log('User not found for token');
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('User authenticated:', { id: user.id, email: user.email });
    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  authenticateToken
}; 