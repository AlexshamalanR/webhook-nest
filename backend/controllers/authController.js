const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
  try {
    console.log('Registration request received:', { email: req.body.email });
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const api_key = `key_${Math.random().toString(36).substring(2, 15)}`;

    console.log('Creating new user with email:', email);
    
    // Create new user
    const user = await User.create({
      name: email.split('@')[0], // Use part of email as name if not provided
      email,
      password: hashedPassword,
      api_key,
    });

    console.log('User created successfully:', { id: user.id, email: user.email });
    
    // Generate token
    const token = generateToken(user.id);

    // Send response
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        api_key: user.api_key
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('User logged in successfully:', { id: user.id, email: user.email });
    
    // Generate token
    const token = generateToken(user.id);

    // Send response
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        api_key: user.api_key
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'api_key']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json(user);
  } catch (error) {
    console.error('Error in getMe:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getMe
};
