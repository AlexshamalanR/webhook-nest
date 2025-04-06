const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized: No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    console.log('Token decoded in authMiddleware:', decoded);
    const user = await User.findByPk(decoded.userId);

    if (!user) return res.status(401).json({ message: 'Unauthorized: User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error in authMiddleware:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
