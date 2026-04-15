/**
 * Chatbot Handler
 * Simple rule-based chatbot for dashboard assistance
 */

const db = require('./database');

/**
 * Process user message and generate response
 */
async function handleChatMessage(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Help and navigation queries
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
        return {
            message: '📋 I can help you with:\n• Dashboard navigation\n• Data queries\n• Report information\n• Table descriptions\n\nTry asking: "What tables are available?" or "How do I use reports?"'
        };
    }

    if (lowerMessage.includes('table') && lowerMessage.includes('available')) {
        return {
            message: '📊 Available Tables:\n• Customers - Customer information\n• Products - Product catalog\n• Orders - Order records\n• Order Details - Line items\n• Payments - Payment records\n• Employees - Team members\n• Offices - Locations\n• Product Lines - Categories'
        };
    }

    if (lowerMessage.includes('report')) {
        return {
            message: '📈 Available Reports:\n• Overview - Orders, revenue, inventory at a glance\n• Customers - Spending analysis and top spenders\n• Products - Performance and stock levels\n• Orders - Status breakdown and metrics'
        };
    }

    if (lowerMessage.includes('pivot') || lowerMessage.includes('analysis')) {
        return {
            message: '📊 Pivot Tables & Analysis:\n• Sales by Product Line - Revenue distribution\n• Top Customers - Best performers\n• Order Status - Fulfillment breakdown\n• Lookup Tables - Detailed cross-references'
        };
    }

    // Data queries
    if (lowerMessage.includes('how many customer') || lowerMessage.includes('total customer')) {
        const result = await db.query('SELECT COUNT(*) as count FROM customers');
        return {
            message: `👥 Total Customers: ${result[0]?.count || 0}`
        };
    }

    if (lowerMessage.includes('how many product') || lowerMessage.includes('total product')) {
        const result = await db.query('SELECT COUNT(*) as count FROM products');
        return {
            message: `📦 Total Products: ${result[0]?.count || 0}`
        };
    }

    if (lowerMessage.includes('how many order') || lowerMessage.includes('total order')) {
        const result = await db.query('SELECT COUNT(*) as count FROM orders');
        return {
            message: `📦 Total Orders: ${result[0]?.count || 0}`
        };
    }

    if (lowerMessage.includes('revenue') || lowerMessage.includes('total revenue')) {
        const result = await db.query(
            'SELECT SUM(od.quantityOrdered * od.priceEach) as total FROM orders o LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber'
        );
        const revenue = parseFloat(result[0]?.total || 0).toFixed(2);
        return {
            message: `💰 Total Revenue: $${revenue}`
        };
    }

    if (lowerMessage.includes('top customer')) {
        const result = await db.query(
            'SELECT c.customerName, SUM(od.quantityOrdered * od.priceEach) as total FROM customers c LEFT JOIN orders o ON c.customerNumber = o.customerNumber LEFT JOIN orderdetails od ON o.orderNumber = od.orderNumber GROUP BY c.customerNumber, c.customerName ORDER BY total DESC LIMIT 1'
        );
        if (result[0]) {
            return {
                message: `⭐ Top Customer: ${result[0].customerName} with $${parseFloat(result[0].total || 0).toFixed(2)} in sales`
            };
        }
    }

    if (lowerMessage.includes('low stock') || lowerMessage.includes('out of stock')) {
        const result = await db.query('SELECT COUNT(*) as count FROM products WHERE quantityInStock <= 0');
        return {
            message: `⚠️ Out of Stock Items: ${result[0]?.count || 0} products`
        };
    }

    if (lowerMessage.includes('inventory')) {
        const result = await db.query(
            'SELECT SUM(CASE WHEN quantityInStock >= 100 THEN 1 ELSE 0 END) as inStock, SUM(CASE WHEN quantityInStock > 0 AND quantityInStock < 100 THEN 1 ELSE 0 END) as lowStock, SUM(CASE WHEN quantityInStock = 0 THEN 1 ELSE 0 END) as outOfStock FROM products'
        );
        return {
            message: `📦 Inventory Status:\n✅ In Stock: ${result[0]?.inStock || 0}\n⚠️ Low Stock: ${result[0]?.lowStock || 0}\n❌ Out of Stock: ${result[0]?.outOfStock || 0}`
        };
    }

    // Default response
    return {
        message: '😊 I can help with:\n• Dashboard features\n• Data queries\n• Table information\n• Reports and analytics\n\nTry: "What tables are available?" or "Show me top customer"'
    };
}

module.exports = {
    handleChatMessage
};
