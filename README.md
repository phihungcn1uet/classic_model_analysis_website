# Classic Models ERP Dashboard

A Node.js-based ERP dashboard for viewing and analyzing the Classic Models database. This application provides a web interface to browse database tables and generate insightful reports.

## Features

- **Database Tables Browser**: View and filter data from 8 different tables:
  - Customers
  - Products
  - Orders
  - Order Details
  - Payments
  - Employees
  - Offices
  - Product Lines

- **Advanced Filtering**: Each table has specific filters for refined data queries:
  - Customers: Filter by name, city, or country
  - Products: Filter by line, stock status, or price
  - Orders: Filter by status or date range
  - And more...

- **Comprehensive Reports**: Generate analytics reports:
  - **Overview Report**: Total orders, revenue, customers, and inventory status
  - **Customers Report**: Total spending, top spenders by country
  - **Products Report**: Stock levels, best sellers, and top revenue products
  - **Orders Report**: Total orders, revenue, completion rate, and order status breakdown

- **Pivot Tables & Statistics**: Interactive pivot tables with visual analytics:
  - **Sales by Product Line**: Revenue and order analysis by product line with charts
  - **Top Customers**: Ranking and comparison of top-performing customers
  - **Order Status Breakdown**: Visual breakdown of orders and revenue by status

- **Lookup Tables**: Cross-reference tables for detailed data analysis:
  - **Customer Orders Lookup**: Complete customer and order history with revenue metrics
  - **Product Orders Lookup**: Product performance with stock levels and sales data

- **Interactive Charts**: Visualizations include:
  - Bar charts for comparisons
  - Doughnut and pie charts for distribution
  - Real-time data updates with Chart.js

- **Responsive UI**: Built with Tailwind CSS for a modern, mobile-friendly interface

## Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (with the `classicmodels` database)
- **npm** (Node Package Manager)

## Installation

1. **Clone or download the project** to your local machine

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure database connection** in `database.js`:
   ```javascript
   const pool = mysql.createPool({
       host: 'localhost',
       port: 3306,
       user: 'root',        // Update with your MySQL username
       password: 'password', // Update with your MySQL password
       database: 'classicmodels',
       ...
   });
   ```

4. **Ensure the `classicmodels` MySQL database exists** with all required tables

## Usage

### Start the server:
```bash
npm start
```

The application will be available at: `http://localhost:3001`

### Navigate the Dashboard:
- Use the sidebar menu to switch between tables and reports
- Apply filters to narrow down results
- View detailed analytics in the Reports section
- Access Pivot Tables for aggregated data with visual charts
- Use Lookup Tables for cross-referenced data analysis
- Tables show a maximum of 50 records per query

## Pivot Tables & Lookups

### Pivot Tables
Pivot tables provide aggregated views of your data with interactive charts:

- **Sales by Product Line**: See revenue distribution and order counts across product categories
  - Includes doughnut chart for revenue distribution
  - Bar chart showing order counts per line
  - Summary table with total quantities

- **Top Customers**: Identify your most valuable customers
  - Horizontal bar chart comparing customer revenues
  - Shows order counts and total spending
  - Up to 20 top customers displayed

- **Order Status**: Analyze order fulfillment
  - Doughnut chart for order count distribution
  - Pie chart for revenue by status
  - Summary metrics for each status type

### Lookup Tables
Lookup tables provide detailed reference data:

- **Customer Orders Lookup**: Cross-reference customer information with order metrics
  - Customer name and country
  - Total orders placed
  - Total revenue generated

- **Product Orders Lookup**: Comprehensive product information with sales data
  - Product code, name, and line
  - Current stock levels
  - Total orders and quantity sold
  - Total revenue per product

## Project Structure

```
├── app.js                 # Main server file with routing
├── database.js            # MySQL connection pool
├── handlers.js            # API route handlers and query functions
├── views.js               # HTML templates
├── package.json           # Project dependencies
├── README.md              # This file
└── static/
    └── app.js             # Client-side JavaScript for UI interactions
```

## API Endpoints

### Table Data Endpoints
- `GET /api/customers` - Fetch customers (supports: name, city, country filters)
- `GET /api/products` - Fetch products (supports: line, stock, price filters)
- `GET /api/orders` - Fetch orders (supports: status, dateFrom, dateTo filters)
- `GET /api/orderdetails` - Fetch order details (supports: orderNumber filter)
- `GET /api/payments` - Fetch payments (supports: customerNumber filter)
- `GET /api/employees` - Fetch employees (supports: firstName, jobTitle filters)
- `GET /api/offices` - Fetch offices (supports: city, country filters)
- `GET /api/productlines` - Fetch product lines (supports: productLine filter)

### Report Endpoints
- `GET /api/report/overview` - Dashboard overview with top customers and products
- `GET /api/report/customers` - Customer analysis and spending metrics
- `GET /api/report/products` - Product performance and inventory analysis
- `GET /api/report/orders` - Order and revenue analytics

### Pivot Table Endpoints
- `GET /api/pivot/sales-by-line` - Sales aggregated by product line with order counts and revenue
- `GET /api/pivot/sales-by-customer` - Top customers ranked by total spending
- `GET /api/pivot/order-status` - Orders and revenue broken down by status
- `GET /api/pivot/inventory-by-line` - Inventory levels aggregated by product line
- `GET /api/pivot/revenue-by-month` - Monthly revenue trend analysis
- `GET /api/pivot/top-products` - Top 15 products by revenue with sales metrics

### Lookup Table Endpoints
- `GET /api/lookup/customers` - Complete customer lookup with order and revenue metrics
- `GET /api/lookup/products` - Complete product lookup with stock and sales data

## Database Tables

The application uses the **ClassicModels** sample database which includes:

- **customers** - Customer information
- **products** - Product catalog
- **productlines** - Product categories
- **orders** - Order records
- **orderdetails** - Line items for each order
- **payments** - Payment records
- **employees** - Employee directory
- **offices** - Office locations

## Technology Stack

- **Backend**: Node.js (v14+), HTTP server
- **Database**: MySQL 8.0+
- **Frontend**: HTML5, CSS3, Tailwind CSS
- **Charting**: Chart.js
- **Package Manager**: npm

## Dependencies

- **mysql2** (^3.6.0) - MySQL database driver with promise support

## Performance Notes

- Results are limited to 50 records per query to maintain responsive UI
- Database queries include proper error handling
- Connection pooling is configured for optimal performance

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check credentials in `database.js`
- Ensure `classicmodels` database exists

### Empty Tables
- Verify the `classicmodels` database has data
- Check that all required tables exist

### Port Already in Use
- Change the `PORT` variable in `app.js` from 3001 to any available port

## License

MIT License

## Author

Classic Models ERP Dashboard - Course Project
