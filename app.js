/**
 * Classic Models ERP Dashboard - Server
 * Main entry point with routing
 */

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const handlers = require('./handlers');
const views = require('./views');

const PORT = 3001;

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    try {
        // Static files
        if (pathname.startsWith('/static/')) {
            const filePath = path.join(__dirname, pathname);
            const content = fs.readFileSync(filePath, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(content);
        }
        // Home page
        else if (pathname === '/' || pathname === '/index.html') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(views.getIndexHTML());
        }
        // Table APIs
        else if (pathname === '/api/customers' && req.method === 'GET') {
            const data = await handlers.getCustomers(query);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/products' && req.method === 'GET') {
            const data = await handlers.getProducts(query);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/orders' && req.method === 'GET') {
            const data = await handlers.getOrders(query);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/orderdetails' && req.method === 'GET') {
            const data = await handlers.getOrderDetails(query);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/payments' && req.method === 'GET') {
            const data = await handlers.getPayments(query);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/employees' && req.method === 'GET') {
            const data = await handlers.getEmployees(query);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/offices' && req.method === 'GET') {
            const data = await handlers.getOffices(query);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/productlines' && req.method === 'GET') {
            const data = await handlers.getProductLines(query);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        // Report APIs
        else if (pathname === '/api/report/overview' && req.method === 'GET') {
            const data = await handlers.getOverviewReport();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/report/customers' && req.method === 'GET') {
            const data = await handlers.getCustomersReport();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/report/products' && req.method === 'GET') {
            const data = await handlers.getProductsReport();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/report/orders' && req.method === 'GET') {
            const data = await handlers.getOrdersReport();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        // Pivot & Lookup APIs
        else if (pathname === '/api/pivot/sales-by-line' && req.method === 'GET') {
            const data = await handlers.getSalesByProductLine();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/pivot/sales-by-customer' && req.method === 'GET') {
            const data = await handlers.getSalesByCustomer();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/pivot/order-status' && req.method === 'GET') {
            const data = await handlers.getOrderStatusBreakdown();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/pivot/inventory-by-line' && req.method === 'GET') {
            const data = await handlers.getInventoryByLine();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/lookup/customers' && req.method === 'GET') {
            const data = await handlers.getLookupCustomerOrders();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/lookup/products' && req.method === 'GET') {
            const data = await handlers.getLookupProductOrders();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/pivot/revenue-by-month' && req.method === 'GET') {
            const data = await handlers.getRevenueByMonth();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        else if (pathname === '/api/pivot/top-products' && req.method === 'GET') {
            const data = await handlers.getTopProductsByRevenue();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        }
        // 404
        else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
        }
    } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
});

server.listen(PORT, () => {
    console.log('\n=========================================');
    console.log('🚀 Classic Models ERP Dashboard');
    console.log('=========================================');
    console.log(`👉 Open: http://localhost:${PORT}\n`);
    console.log('✅ Database: classicmodels (MySQL)');
    console.log('✅ Tables: Customers, Products, Orders');
    console.log('✅ Reports: Overview, Customers, Products, Orders\n');
});
