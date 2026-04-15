/**
 * Route Handler
 * Manages all HTTP routes and API endpoints
 */

const fs = require('fs');
const path = require('path');
const handlers = require('./handlers');
const chatbot = require('./chatbot');
const views = require('./views');
const { CONTENT_TYPES, HTTP_CODES } = require('./config');

class Router {
    constructor() {
        this.routes = [];
    }

    /**
     * Handle incoming HTTP request
     */
    async handle(req, res, pathname, query) {
        const method = req.method;

        // Static files
        if (pathname.startsWith('/static/')) {
            return this.serveStaticFile(res, pathname);
        }

        // Home page
        if (pathname === '/' || pathname === '/index.html') {
            return this.serveHomePage(res);
        }

        // Route to appropriate handler
        if (pathname.startsWith('/api/')) {
            // Get request body for POST requests
            let body = '';
            if (method === 'POST') {
                body = await this.getRequestBody(req);
            }
            return await this.handleAPI(res, pathname, query, method, body);
        }

        // 404 - Not found
        return this.sendNotFound(res);
    }

    /**
     * Get request body from stream
     */
    getRequestBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                resolve(body);
            });
            req.on('error', reject);
        });
    }

    /**
     * Serve static files
     */
    serveStaticFile(res, pathname) {
        try {
            const filePath = path.join(__dirname, pathname);
            const content = fs.readFileSync(filePath, 'utf8');
            res.writeHead(HTTP_CODES.OK, { 'Content-Type': CONTENT_TYPES.JS });
            res.end(content);
        } catch (error) {
            this.sendNotFound(res);
        }
    }

    /**
     * Serve home page
     */
    serveHomePage(res) {
        res.writeHead(HTTP_CODES.OK, { 'Content-Type': CONTENT_TYPES.HTML });
        res.end(views.getIndexHTML());
    }

    /**
     * Handle API requests
     */
    async handleAPI(res, pathname, query, method, body = '') {
        if (method === 'POST') {
            // Chatbot endpoint
            if (pathname === '/api/chatbot') {
                try {
                    const data = JSON.parse(body);
                    const response = await chatbot.handleChatMessage(data.message);
                    return this.sendJSON(res, response);
                } catch (error) {
                    return this.sendError(res, 'Invalid request format');
                }
            }
            return this.sendNotFound(res);
        }

        if (method !== 'GET') {
            return this.sendNotFound(res);
        }

        try {
            // Table APIs
            if (pathname === '/api/customers') {
                const data = await handlers.getCustomers(query);
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/products') {
                const data = await handlers.getProducts(query);
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/orders') {
                const data = await handlers.getOrders(query);
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/orderdetails') {
                const data = await handlers.getOrderDetails(query);
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/payments') {
                const data = await handlers.getPayments(query);
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/employees') {
                const data = await handlers.getEmployees(query);
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/offices') {
                const data = await handlers.getOffices(query);
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/productlines') {
                const data = await handlers.getProductLines(query);
                return this.sendJSON(res, data);
            }

            // Report APIs
            if (pathname === '/api/report/overview') {
                const data = await handlers.getOverviewReport();
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/report/customers') {
                const data = await handlers.getCustomersReport();
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/report/products') {
                const data = await handlers.getProductsReport();
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/report/orders') {
                const data = await handlers.getOrdersReport();
                return this.sendJSON(res, data);
            }

            // Pivot APIs
            if (pathname === '/api/pivot/sales-by-line') {
                const data = await handlers.getSalesByProductLine();
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/pivot/sales-by-customer') {
                const data = await handlers.getSalesByCustomer();
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/pivot/order-status') {
                const data = await handlers.getOrderStatusBreakdown();
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/pivot/inventory-by-line') {
                const data = await handlers.getInventoryByLine();
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/pivot/revenue-by-month') {
                const data = await handlers.getRevenueByMonth();
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/pivot/top-products') {
                const data = await handlers.getTopProductsByRevenue();
                return this.sendJSON(res, data);
            }

            // Lookup APIs
            if (pathname === '/api/lookup/customers') {
                const data = await handlers.getLookupCustomerOrders();
                return this.sendJSON(res, data);
            }
            if (pathname === '/api/lookup/products') {
                const data = await handlers.getLookupProductOrders();
                return this.sendJSON(res, data);
            }

            // Route not found
            return this.sendNotFound(res);
        } catch (error) {
            console.error('API error:', error);
            this.sendError(res, error.message);
        }
    }

    /**
     * Send JSON response
     */
    sendJSON(res, data) {
        res.writeHead(HTTP_CODES.OK, { 'Content-Type': CONTENT_TYPES.JSON });
        res.end(JSON.stringify(data));
    }

    /**
     * Send 404 Not Found response
     */
    sendNotFound(res) {
        res.writeHead(HTTP_CODES.NOT_FOUND, { 'Content-Type': CONTENT_TYPES.JSON });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }

    /**
     * Send 500 Server Error response
     */
    sendError(res, message) {
        res.writeHead(HTTP_CODES.SERVER_ERROR, { 'Content-Type': CONTENT_TYPES.JSON });
        res.end(JSON.stringify({ error: message }));
    }
}

module.exports = Router;
