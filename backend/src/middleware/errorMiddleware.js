function notFoundHandler(req, res, next) {
  res.status(404).json({
    message: 'Route not found'
  });
}

// Centralized error handler to keep controllers simple
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    message
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};

