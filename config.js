/**
 * Configuration Constants
 */

module.exports = {
    PORT: 3001,
    CORS_ORIGIN: '*',
    CONTENT_TYPES: {
        JSON: 'application/json',
        HTML: 'text/html',
        JS: 'application/javascript'
    },
    HTTP_CODES: {
        OK: 200,
        NOT_FOUND: 404,
        SERVER_ERROR: 500
    }
};
