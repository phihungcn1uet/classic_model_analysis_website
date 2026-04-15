/**
 * API Route Handlers
 */

const db = require('./database');

/**
 * Table Data Queries
 */
async function getCustomers(filters = {}) {
    let sql = 'SELECT * FROM customers WHERE 1=1';
    const params = [];

    if (filters.name) {
        sql += ' AND customerName LIKE ?';
        params.push('%' + filters.name + '%');
    }
    if (filters.city) {
        sql += ' AND city LIKE ?';
        params.push('%' + filters.city + '%');
    }
    if (filters.country) {
        sql += ' AND country LIKE ?';
        params.push('%' + filters.country + '%');
    }

    sql += ' LIMIT 50';
    return await db.query(sql, params);
}

async function getProducts(filters = {}) {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (filters.line) {
        sql += ' AND productLine LIKE ?';
        params.push('%' + filters.line + '%');
    }

    if (filters.stock === 'out-of-stock') {
        sql += ' AND quantityInStock = 0';
    } else if (filters.stock === 'low-stock') {
        sql += ' AND quantityInStock > 0 AND quantityInStock < 100';
    } else if (filters.stock === 'in-stock') {
        sql += ' AND quantityInStock >= 100';
    }

    if (filters.price) {
        sql += ' AND buyPrice <= ?';
        params.push(parseFloat(filters.price));
    }

    sql += ' LIMIT 50';
    return await db.query(sql, params);
}

async function getOrders(filters = {}) {
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (filters.status) {
        sql += ' AND status = ?';
        params.push(filters.status);
    }

    if (filters.dateFrom) {
        sql += ' AND orderDate >= ?';
        params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
        sql += ' AND orderDate <= ?';
        params.push(filters.dateTo);
    }

    sql += ' LIMIT 50';
    return await db.query(sql, params);
}

/**
 * Report Queries
 */
async function getOverviewReport() {
    const analytics = await db.query(
        'SELECT COUNT(DISTINCT o.orderNumber) as totalOrders, COUNT(DISTINCT o.customerNumber) as totalCustomers, SUM(od.quantityOrdered * od.priceEach) as totalRevenue, AVG(od.quantityOrdered * od.priceEach) as avgOrderValue FROM orders o LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber'
    );

    const productLineSales = await db.query(
        'SELECT p.productLine, SUM(od.quantityOrdered * od.priceEach) as total FROM orders o LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber LEFT JOIN products p ON od.productCode = p.productCode GROUP BY p.productLine'
    );

    const inventory = await db.query(
        'SELECT SUM(CASE WHEN quantityInStock >= 100 THEN 1 ELSE 0 END) as inStock, SUM(CASE WHEN quantityInStock > 0 AND quantityInStock < 100 THEN 1 ELSE 0 END) as lowStock, SUM(CASE WHEN quantityInStock = 0 THEN 1 ELSE 0 END) as outOfStock FROM products'
    );

    const topCustomers = await db.query(
        'SELECT c.customerName, SUM(od.quantityOrdered * od.priceEach) as total FROM customers c LEFT JOIN orders o ON c.customerNumber = o.customerNumber LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber GROUP BY c.customerNumber, c.customerName ORDER BY total DESC LIMIT 10'
    );

    const topProducts = await db.query(
        'SELECT p.productName, SUM(od.quantityOrdered) as total FROM products p LEFT JOIN orderdetails od ON p.productCode = od.productCode GROUP BY p.productCode, p.productName ORDER BY total DESC LIMIT 10'
    );

    return {
        analytics: {
            totalOrders: parseInt(analytics[0]?.totalOrders || 0),
            totalCustomers: parseInt(analytics[0]?.totalCustomers || 0),
            totalRevenue: parseFloat(analytics[0]?.totalRevenue || 0),
            avgOrderValue: parseFloat(analytics[0]?.avgOrderValue || 0)
        },
        productLineSales: productLineSales || [],
        inventory: {
            inStock: parseInt(inventory[0]?.inStock || 0),
            lowStock: parseInt(inventory[0]?.lowStock || 0),
            outOfStock: parseInt(inventory[0]?.outOfStock || 0)
        },
        topCustomers: (topCustomers || []).map(c => ({
            customerName: c.customerName,
            total: parseFloat(c.total || 0)
        })),
        topProducts: (topProducts || []).map(p => ({
            productName: p.productName,
            total: parseInt(p.total || 0)
        }))
    };
}

async function getCustomersReport() {
    const totalCustomers = await db.query('SELECT COUNT(*) as count FROM customers');
    const totalSpent = await db.query('SELECT SUM(od.quantityOrdered * od.priceEach) as total FROM customers c LEFT JOIN orders o ON c.customerNumber = o.customerNumber LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber');
    const avgSpending = await db.query('SELECT AVG(total) as avg FROM (SELECT SUM(od.quantityOrdered * od.priceEach) as total FROM customers c LEFT JOIN orders o ON c.customerNumber = o.customerNumber LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber GROUP BY c.customerNumber) sub');
    const totalOrders = await db.query('SELECT COUNT(DISTINCT o.orderNumber) as count FROM orders o');
    const byCountry = await db.query('SELECT country, COUNT(*) as customer_count, COALESCE(SUM(od.quantityOrdered * od.priceEach), 0) as total_spent FROM customers c LEFT JOIN orders o ON c.customerNumber = o.customerNumber LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber GROUP BY country ORDER BY total_spent DESC');
    const topSpenders = await db.query('SELECT c.customerName, SUM(od.quantityOrdered * od.priceEach) as total FROM customers c LEFT JOIN orders o ON c.customerNumber = o.customerNumber LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber GROUP BY c.customerNumber, c.customerName ORDER BY total DESC LIMIT 10');

    return {
        totalCustomers: parseInt(totalCustomers[0]?.count || 0),
        totalSpent: parseFloat(totalSpent[0]?.total || 0),
        avgSpending: parseFloat(avgSpending[0]?.avg || 0),
        totalOrders: parseInt(totalOrders[0]?.count || 0),
        byCountry: (byCountry || []).map(c => ({
            country: c.country,
            customer_count: parseInt(c.customer_count || 0),
            total_spent: parseFloat(c.total_spent || 0)
        })),
        topSpenders: (topSpenders || []).map(c => ({
            customerName: c.customerName,
            total: parseFloat(c.total || 0)
        }))
    };
}

async function getProductsReport() {
    const totalProducts = await db.query('SELECT COUNT(*) as count FROM products');
    const inStock = await db.query('SELECT COUNT(*) as count FROM products WHERE quantityInStock >= 100');
    const lowStock = await db.query('SELECT COUNT(*) as count FROM products WHERE quantityInStock > 0 AND quantityInStock < 100');
    const outOfStock = await db.query('SELECT COUNT(*) as count FROM products WHERE quantityInStock = 0');
    const byLine = await db.query('SELECT productLine, COUNT(*) as count FROM products GROUP BY productLine');
    const bestSellers = await db.query('SELECT p.productName, SUM(od.quantityOrdered) as total FROM products p LEFT JOIN orderdetails od ON p.productCode = od.productCode GROUP BY p.productCode, p.productName ORDER BY total DESC LIMIT 10');
    const topRevenue = await db.query('SELECT p.productName, SUM(od.quantityOrdered * od.priceEach) as total FROM products p LEFT JOIN orderdetails od ON p.productCode = od.productCode GROUP BY p.productCode, p.productName ORDER BY total DESC LIMIT 10');

    return {
        totalProducts: parseInt(totalProducts[0]?.count || 0),
        inStock: parseInt(inStock[0]?.count || 0),
        lowStock: parseInt(lowStock[0]?.count || 0),
        outOfStock: parseInt(outOfStock[0]?.count || 0),
        byLine: (byLine || []).map(b => ({
            productLine: b.productLine,
            count: parseInt(b.count || 0)
        })),
        bestSellers: (bestSellers || []).map(b => ({
            productName: b.productName,
            total: parseInt(b.total || 0)
        })),
        topRevenue: (topRevenue || []).map(t => ({
            productName: t.productName,
            total: parseFloat(t.total || 0)
        }))
    };
}

async function getOrdersReport() {
    const totalOrders = await db.query('SELECT COUNT(*) as count FROM orders');
    const totalRevenue = await db.query('SELECT SUM(od.quantityOrdered * od.priceEach) as total FROM orders o LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber');
    const avgOrderValue = await db.query('SELECT AVG(od.quantityOrdered * od.priceEach) as avg FROM orders o LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber');
    const shipped = await db.query('SELECT COUNT(*) as count FROM orders WHERE status = "Shipped"');
    const inProcess = await db.query('SELECT COUNT(*) as count FROM orders WHERE status = "In Process"');
    const cancelled = await db.query('SELECT COUNT(*) as count FROM orders WHERE status = "Cancelled"');

    const totalOrdersCount = parseInt(totalOrders[0]?.count || 0);
    const shippedCount = parseInt(shipped[0]?.count || 0);
    const completionRate = totalOrdersCount > 0 ? (shippedCount / totalOrdersCount * 100) : 0;

    return {
        totalOrders: totalOrdersCount,
        totalRevenue: parseFloat(totalRevenue[0]?.total || 0),
        avgOrderValue: parseFloat(avgOrderValue[0]?.avg || 0),
        shipped: shippedCount,
        inProcess: parseInt(inProcess[0]?.count || 0),
        cancelled: parseInt(cancelled[0]?.count || 0),
        completionRate: completionRate
    };
}

async function getOrderDetails(filters = {}) {
    let sql = 'SELECT * FROM orderdetails WHERE 1=1';
    const params = [];

    if (filters.orderNumber) {
        sql += ' AND orderNumber = ?';
        params.push(filters.orderNumber);
    }

    sql += ' LIMIT 50';
    return await db.query(sql, params);
}

async function getPayments(filters = {}) {
    let sql = 'SELECT * FROM payments WHERE 1=1';
    const params = [];

    if (filters.customerNumber) {
        sql += ' AND customerNumber = ?';
        params.push(filters.customerNumber);
    }

    sql += ' LIMIT 50';
    return await db.query(sql, params);
}

async function getEmployees(filters = {}) {
    let sql = 'SELECT * FROM employees WHERE 1=1';
    const params = [];

    if (filters.firstName) {
        sql += ' AND firstName LIKE ?';
        params.push('%' + filters.firstName + '%');
    }

    if (filters.jobTitle) {
        sql += ' AND jobTitle LIKE ?';
        params.push('%' + filters.jobTitle + '%');
    }

    sql += ' LIMIT 50';
    return await db.query(sql, params);
}

async function getOffices(filters = {}) {
    let sql = 'SELECT * FROM offices WHERE 1=1';
    const params = [];

    if (filters.city) {
        sql += ' AND city LIKE ?';
        params.push('%' + filters.city + '%');
    }

    if (filters.country) {
        sql += ' AND country LIKE ?';
        params.push('%' + filters.country + '%');
    }

    sql += ' LIMIT 50';
    return await db.query(sql, params);
}

async function getProductLines(filters = {}) {
    let sql = 'SELECT * FROM productlines WHERE 1=1';
    const params = [];

    if (filters.productLine) {
        sql += ' AND productLine LIKE ?';
        params.push('%' + filters.productLine + '%');
    }

    sql += ' LIMIT 50';
    return await db.query(sql, params);
}

/**
 * Pivot Tables & Lookup Data
 */
async function getSalesByProductLine() {
    return await db.query(
        'SELECT p.productLine, COUNT(DISTINCT od.orderNumber) as orders, SUM(od.quantityOrdered) as totalQty, SUM(od.quantityOrdered * od.priceEach) as totalRevenue FROM products p LEFT JOIN orderdetails od ON p.productCode = od.productCode GROUP BY p.productLine ORDER BY totalRevenue DESC'
    );
}

async function getSalesByCustomer() {
    return await db.query(
        'SELECT c.customerName, COUNT(DISTINCT o.orderNumber) as orders, SUM(od.quantityOrdered * od.priceEach) as totalSpent FROM customers c LEFT JOIN orders o ON c.customerNumber = o.customerNumber LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber GROUP BY c.customerNumber, c.customerName ORDER BY totalSpent DESC LIMIT 20'
    );
}

async function getOrderStatusBreakdown() {
    return await db.query(
        'SELECT status, COUNT(*) as count, SUM(od.quantityOrdered * od.priceEach) as totalAmount FROM orders o LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber GROUP BY status'
    );
}

async function getInventoryByLine() {
    return await db.query(
        'SELECT p.productLine, COUNT(*) as totalProducts, SUM(CASE WHEN quantityInStock >= 100 THEN 1 ELSE 0 END) as inStock, SUM(CASE WHEN quantityInStock > 0 AND quantityInStock < 100 THEN 1 ELSE 0 END) as lowStock, SUM(CASE WHEN quantityInStock = 0 THEN 1 ELSE 0 END) as outOfStock FROM products p GROUP BY p.productLine'
    );
}

async function getLookupCustomerOrders() {
    return await db.query(
        'SELECT c.customerNumber, c.customerName, c.country, COUNT(DISTINCT o.orderNumber) as totalOrders, SUM(od.quantityOrdered * od.priceEach) as totalRevenue FROM customers c LEFT JOIN orders o ON c.customerNumber = o.customerNumber LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber GROUP BY c.customerNumber, c.customerName, c.country ORDER BY totalRevenue DESC LIMIT 50'
    );
}

async function getLookupProductOrders() {
    return await db.query(
        'SELECT p.productCode, p.productName, p.productLine, p.quantityInStock, COUNT(DISTINCT od.orderNumber) as totalOrders, SUM(od.quantityOrdered) as quantitySold, SUM(od.quantityOrdered * od.priceEach) as totalRevenue FROM products p LEFT JOIN orderdetails od ON p.productCode = od.productCode GROUP BY p.productCode, p.productName, p.productLine, p.quantityInStock ORDER BY totalRevenue DESC LIMIT 50'
    );
}

async function getRevenueByMonth() {
    return await db.query(
        'SELECT DATE_FORMAT(o.orderDate, "%Y-%m") as month, COUNT(DISTINCT o.orderNumber) as orders, SUM(od.quantityOrdered * od.priceEach) as revenue FROM orders o LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber GROUP BY DATE_FORMAT(o.orderDate, "%Y-%m") ORDER BY month ASC'
    );
}

async function getTopProductsByRevenue() {
    return await db.query(
        'SELECT p.productName, p.productLine, SUM(od.quantityOrdered) as quantitySold, SUM(od.quantityOrdered * od.priceEach) as totalRevenue, ROUND(SUM(od.quantityOrdered * od.priceEach) / SUM(od.quantityOrdered), 2) as avgPrice FROM products p LEFT JOIN orderdetails od ON p.productCode = od.productCode GROUP BY p.productCode, p.productName, p.productLine ORDER BY totalRevenue DESC LIMIT 15'
    );
}

module.exports = {
    getCustomers,
    getProducts,
    getOrders,
    getOrderDetails,
    getPayments,
    getEmployees,
    getOffices,
    getProductLines,
    getOverviewReport,
    getCustomersReport,
    getProductsReport,
    getOrdersReport,
    getSalesByProductLine,
    getSalesByCustomer,
    getOrderStatusBreakdown,
    getInventoryByLine,
    getLookupCustomerOrders,
    getLookupProductOrders,
    getRevenueByMonth,
    getTopProductsByRevenue
};
