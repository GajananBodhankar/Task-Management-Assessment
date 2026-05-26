const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      const error = new Error('Authentication token is required');
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error('User no longer exists');
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    return next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    error.message = error.message || 'Invalid or expired token';
    return next(error);
  }
};

const requireRole = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    const error = new Error('You do not have permission to access this resource');
    error.statusCode = 403;
    return next(error);
  }

  return next();
};

module.exports = { protect, requireRole };
