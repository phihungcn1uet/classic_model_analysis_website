/**
 * Middleware Functions
 * Common middleware for request/response handling
 */

const { CORS_ORIGIN } = require('./config');

/**
 * Apply CORS headers to response
 */
function corsMiddleware(res) {
    res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Error handler wrapper
 */
function errorHandler(fn) {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };
}

module.exports = {
    corsMiddleware,
    errorHandler
};
