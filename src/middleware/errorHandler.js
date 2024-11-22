const logger = require('../utils/logger');
 
module.exports = (err, req, res, next) => {
    // Always log the error server-side
    logger.error(err.stack);

    const isDevelopment = process.env.NODE_ENV === 'development';
    const statusCode = err.status || 500;
    
    // Only show detailed message in development or for non-500 errors
    const message = statusCode === 500 && !isDevelopment 
        ? 'Internal server error'
        : err.message;

    // Response object
    const errorResponse = {
        status: 'error',
        message
    };

    // Only add stack trace in development
    if (isDevelopment) {
        errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
};