require('dotenv').config({ path: '../expenseapppassword/.env' });
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Charity = require("../models/charity");

exports.authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token is missing' });
    }

    console.log('Received Token:', token); // Log token for debugging
    
    // Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Payload:', payload); // Log decoded payload for debugging

    // Check if the user exists in the database
    const user = await User.findByPk(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Attach user to the request object
    req.user = { id: user.id, name: user.name };

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.log('Error:', error); // Log error for debugging

    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }

    // Handle invalid token error
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // General error response
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.charityAuthMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token is missing' });
    }

    // Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the charity exists
    const charity = await Charity.findByPk(payload.charityId);
    if (!charity) {
      return res.status(401).json({ error: 'Charity not found' });
    }

    // Attach charity to the request object
    req.charity = { id: charity.id, name: charity.name };

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.log('Error:', error); // Log error for debugging

    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }

    // Handle invalid token error
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // General error response
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.adminMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token is missing' });
    }

    // Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists in the database
    const user = await User.findByPk(payload.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res.status(403).json({ error: 'User is not an admin' });
    }

    // Attach user to the request object
    req.user = { id: user.id, name: user.name };

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.log('Error:', error); // Log error for debugging

    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }

    // Handle invalid token error
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // General error response
    return res.status(500).json({ error: 'Server error' });
  }
};
