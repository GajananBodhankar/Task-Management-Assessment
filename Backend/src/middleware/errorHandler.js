const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  if (error.code === 11000) {
    return res.status(409).json({ message: 'A user with this email already exists' });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource id' });
  }

  return res.status(statusCode).json({
    message: error.message || 'Something went wrong',
  });
};

module.exports = { notFound, errorHandler };
