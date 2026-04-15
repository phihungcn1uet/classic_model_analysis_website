/**
 * Classic Models ERP Dashboard - Server
 * Main entry point with clean separation of concerns
 */

const http = require('http');
const url = require('url');
const config = require('./config');
const middleware = require('./middleware');
const Router = require('./routes');

// Initialize router
const router = new Router();

// Create HTTP server
const server = http.createServer(async (req, res) => {
    // Apply middleware
    middleware.corsMiddleware(res);

    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    try {
        // Route request
        await router.handle(req, res, pathname, query);
    } catch (error) {
        console.error('Server error:', error);
        res.writeHead(config.HTTP_CODES.SERVER_ERROR, { 'Content-Type': config.CONTENT_TYPES.JSON });
        res.end(JSON.stringify({ error: error.message }));
    }
});

server.listen(config.PORT, () => {
    console.log('\n=========================================');
    console.log('🚀 Classic Models ERP Dashboard');
    console.log('=========================================');
    console.log(`👉 Open: http://localhost:${config.PORT}\n`);
    console.log('✅ Database: classicmodels (MySQL)');
    console.log('✅ Tables: Customers, Products, Orders');
    console.log('✅ Reports: Overview, Customers, Products, Orders\n');
});
