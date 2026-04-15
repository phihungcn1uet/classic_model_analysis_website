/**
 * Client-Side JavaScript
 * Handles UI interactions and API calls
 */

let currentView = 'customers';
let currentFilters = {};

// Show specific view (table or report)
function showView(view) {
    currentView = view;
    document.querySelectorAll('[id^="nav-"]').forEach(el => el.classList.remove('nav-active'));
    document.getElementById('nav-' + view)?.classList.add('nav-active');

    if (view.startsWith('report-')) {
        document.getElementById('table-view').classList.add('hidden');
        document.getElementById('report-view').classList.remove('hidden');
        document.getElementById('pivot-view').classList.add('hidden');
        loadReport(view.split('-')[1]);
    } else if (view.startsWith('pivot-') || view.startsWith('lookup-')) {
        document.getElementById('table-view').classList.add('hidden');
        document.getElementById('report-view').classList.add('hidden');
        document.getElementById('pivot-view').classList.remove('hidden');
        loadPivotView(view);
    } else {
        document.getElementById('table-view').classList.remove('hidden');
        document.getElementById('report-view').classList.add('hidden');
        document.getElementById('pivot-view').classList.add('hidden');
        loadTableData(view);
    }
}

// Load table data with filters
async function loadTableData(table) {
    document.getElementById('page-title').innerText = table.charAt(0).toUpperCase() + table.slice(1);
    currentFilters = {};

    buildFilters(table);
    await fetchAndRenderTable(table);
}

// Build filter inputs
function buildFilters(table) {
    const container = document.getElementById('filters-container');
    container.innerHTML = '';

    if (table === 'customers') {
        container.innerHTML = `
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">Customer Name</label><input type="text" id="filter-name" placeholder="Search..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">City</label><input type="text" id="filter-city" placeholder="Filter by city..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">Country</label><input type="text" id="filter-country" placeholder="Filter by country..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><button onclick="applyFilters('customers')" class="w-full mt-6 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Apply Filters</button></div>
        `;
    } else if (table === 'products') {
        container.innerHTML = `
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">Product Line</label><input type="text" id="filter-line" placeholder="Filter by line..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">Stock Status</label><select id="filter-stock" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"><option value="">All</option><option value="in-stock">In Stock</option><option value="low-stock">Low Stock</option><option value="out-of-stock">Out of Stock</option></select></div>
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">Max Price</label><input type="number" id="filter-price" placeholder="Max price..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><button onclick="applyFilters('products')" class="w-full mt-6 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Apply Filters</button></div>
        `;
    } else if (table === 'orders') {
        container.innerHTML = `
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">Status</label><select id="filter-status" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"><option value="">All</option><option value="Shipped">Shipped</option><option value="In Process">In Process</option><option value="Cancelled">Cancelled</option></select></div>
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">From Date</label><input type="date" id="filter-date-from" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">To Date</label><input type="date" id="filter-date-to" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><button onclick="applyFilters('orders')" class="w-full mt-6 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Apply Filters</button></div>
        `;
    } else if (table === 'orderdetails') {
        container.innerHTML = `
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">Order Number</label><input type="number" id="filter-orderNumber" placeholder="Filter by order number..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><button onclick="applyFilters('orderdetails')" class="w-full mt-6 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Apply Filters</button></div>
        `;
    } else if (table === 'payments') {
        container.innerHTML = `
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">Customer Number</label><input type="number" id="filter-customerNumber" placeholder="Filter by customer number..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><button onclick="applyFilters('payments')" class="w-full mt-6 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Apply Filters</button></div>
        `;
    } else if (table === 'employees') {
        container.innerHTML = `
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">First Name</label><input type="text" id="filter-firstName" placeholder="Search by first name..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">Job Title</label><input type="text" id="filter-jobTitle" placeholder="Filter by job title..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><button onclick="applyFilters('employees')" class="w-full mt-6 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Apply Filters</button></div>
        `;
    } else if (table === 'offices') {
        container.innerHTML = `
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">City</label><input type="text" id="filter-city" placeholder="Filter by city..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">Country</label><input type="text" id="filter-country" placeholder="Filter by country..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><button onclick="applyFilters('offices')" class="w-full mt-6 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Apply Filters</button></div>
        `;
    } else if (table === 'productlines') {
        container.innerHTML = `
            <div><label class="block text-xs font-semibold text-gray-600 mb-1">Product Line</label><input type="text" id="filter-productLine" placeholder="Filter by product line..." class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"></div>
            <div><button onclick="applyFilters('productlines')" class="w-full mt-6 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Apply Filters</button></div>
        `;
    }
}

// Apply filters and fetch data
async function applyFilters(table) {
    currentFilters = {};

    if (table === 'customers') {
        currentFilters.name = document.getElementById('filter-name')?.value;
        currentFilters.city = document.getElementById('filter-city')?.value;
        currentFilters.country = document.getElementById('filter-country')?.value;
    } else if (table === 'products') {
        currentFilters.line = document.getElementById('filter-line')?.value;
        currentFilters.stock = document.getElementById('filter-stock')?.value;
        currentFilters.price = document.getElementById('filter-price')?.value;
    } else if (table === 'orders') {
        currentFilters.status = document.getElementById('filter-status')?.value;
        currentFilters.dateFrom = document.getElementById('filter-date-from')?.value;
        currentFilters.dateTo = document.getElementById('filter-date-to')?.value;
    } else if (table === 'orderdetails') {
        currentFilters.orderNumber = document.getElementById('filter-orderNumber')?.value;
    } else if (table === 'payments') {
        currentFilters.customerNumber = document.getElementById('filter-customerNumber')?.value;
    } else if (table === 'employees') {
        currentFilters.firstName = document.getElementById('filter-firstName')?.value;
        currentFilters.jobTitle = document.getElementById('filter-jobTitle')?.value;
    } else if (table === 'offices') {
        currentFilters.city = document.getElementById('filter-city')?.value;
        currentFilters.country = document.getElementById('filter-country')?.value;
    } else if (table === 'productlines') {
        currentFilters.productLine = document.getElementById('filter-productLine')?.value;
    }

    await fetchAndRenderTable(table);
}

// Fetch and render table data
async function fetchAndRenderTable(table) {
    const params = new URLSearchParams(Object.entries(currentFilters).filter(([_, v]) => v));
    const url = '/api/' + table + (params.toString()?  '?' + params : '');

    document.getElementById('table-head').innerHTML = '';
    document.getElementById('table-body').innerHTML = '';
    document.getElementById('record-count').innerText = 'Loading...';

    try {
        const response = await fetch(url);
        const data = await response.json();
        renderTable(data);
        document.getElementById('record-count').innerText = `Showing ${data.length} records`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('record-count').innerText = 'Error loading data';
    }
}

// Render table with data
function renderTable(data) {
    if (!data || data.length === 0) {
        document.getElementById('empty-state').classList.remove('hidden');
        return;
    }

    const columns = Object.keys(data[0]);
    const thead = document.getElementById('table-head');
    const tbody = document.getElementById('table-body');

    // Create headers
    const headerRow = document.createElement('tr');
    columns.forEach(col => {
        const th = document.createElement('th');
        th.className = 'px-6 py-3 font-medium text-gray-500';
        th.innerText = col.replace(/([A-Z])/g, ' $1').trim();
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Create rows
    data.forEach(record => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-blue-50/50 transition-colors';
        columns.forEach(col => {
            const td = document.createElement('td');
            td.className = 'px-6 py-4 whitespace-nowrap text-gray-700';

            if (col === 'status') {
                const color = record[col] === 'Shipped' ? 'bg-green-100 text-green-800' : record[col] === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
                td.innerHTML = `<span class="px-2.5 py-1 rounded-full text-xs font-medium ${color}">${record[col]}</span>`;
            } else if (['buyPrice', 'priceEach'].includes(col)) {
                td.innerText = '$' + parseFloat(record[col]).toFixed(2);
            } else {
                td.innerText = record[col];
            }
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
}

// Load reports
async function loadReport(reportType) {
    document.getElementById('page-title').innerText = 'Report - ' + reportType.charAt(0).toUpperCase() + reportType.slice(1);
    document.getElementById('report-content').innerHTML = '<p class="text-center text-gray-500">Loading report...</p>';

    try {
        let url = `/api/report/${reportType === 'overview' ? 'overview' : reportType}`;
        const response = await fetch(url);
        const data = await response.json();
        renderReport(reportType, data);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('report-content').innerHTML = '<p class="text-center text-red-500">Error loading report</p>';
    }
}

// Render report content
function renderReport(type, data) {
    let html = '';

    if (type === 'overview') {
        html = `
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Total Orders</p>
                    <p class="text-3xl font-bold text-blue-600">${data.analytics?.totalOrders || 0}</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Revenue</p>
                    <p class="text-3xl font-bold text-green-600">$${(data.analytics?.totalRevenue || 0).toFixed(2)}</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Avg Order</p>
                    <p class="text-3xl font-bold text-purple-600">$${(data.analytics?.avgOrderValue || 0).toFixed(2)}</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Total Customers</p>
                    <p class="text-3xl font-bold text-orange-600">${data.analytics?.totalCustomers || 0}</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Low Stock</p>
                    <p class="text-3xl font-bold text-red-600">${data.inventory?.lowStock || 0}</p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold mb-4">Top 10 Customers</h3>
                <table class="w-full text-sm">
                    <thead class="bg-gray-50"><tr><th class="px-4 py-2 text-left">Customer Name</th><th class="px-4 py-2 text-right">Total Sales</th></tr></thead>
                    <tbody class="divide-y">
                        ${(data.topCustomers || []).slice(0, 10).map(c => `<tr><td class="px-4 py-2">${c.customerName}</td><td class="px-4 py-2 text-right">$${c.total.toFixed(2)}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else if (type === 'customers') {
        html = `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Total Customers</p>
                    <p class="text-3xl font-bold text-blue-600">${data.totalCustomers || 0}</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Total Spent</p>
                    <p class="text-3xl font-bold text-green-600">$${(data.totalSpent || 0).toFixed(2)}</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Avg Spending</p>
                    <p class="text-3xl font-bold text-purple-600">$${(data.avgSpending || 0).toFixed(2)}</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Total Orders</p>
                    <p class="text-3xl font-bold text-orange-600">${data.totalOrders || 0}</p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold mb-4">Customers by Country</h3>
                <table class="w-full text-sm">
                    <thead class="bg-gray-50"><tr><th class="px-4 py-2 text-left">Country</th><th class="px-4 py-2 text-right">Count</th><th class="px-4 py-2 text-right">Total Spent</th></tr></thead>
                    <tbody class="divide-y">
                        ${(data.byCountry || []).map(c => `<tr><td class="px-4 py-2">${c.country}</td><td class="px-4 py-2 text-right">${c.customer_count}</td><td class="px-4 py-2 text-right">$${(c.total_spent || 0).toFixed(2)}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else if (type === 'products') {
        html = `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Total Products</p>
                    <p class="text-3xl font-bold text-blue-600">${data.totalProducts || 0}</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">In Stock</p>
                    <p class="text-3xl font-bold text-green-600">${data.inStock || 0}</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Low Stock</p>
                    <p class="text-3xl font-bold text-yellow-600">${data.lowStock || 0}</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Out of Stock</p>
                    <p class="text-3xl font-bold text-red-600">${data.outOfStock || 0}</p>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold mb-4">Best Sellers (Top 10)</h3>
                <table class="w-full text-sm">
                    <thead class="bg-gray-50"><tr><th class="px-4 py-2 text-left">Product Name</th><th class="px-4 py-2 text-right">Units Sold</th></tr></thead>
                    <tbody class="divide-y">
                        ${(data.bestSellers || []).slice(0, 10).map(p => `<tr><td class="px-4 py-2">${p.productName}</td><td class="px-4 py-2 text-right">${p.total}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else if (type === 'orders') {
        html = `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Total Orders</p>
                    <p class="text-3xl font-bold text-blue-600">${data.totalOrders || 0}</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Revenue</p>
                    <p class="text-3xl font-bold text-green-600">$${(data.totalRevenue || 0).toFixed(2)}</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Avg Value</p>
                    <p class="text-3xl font-bold text-purple-600">$${(data.avgOrderValue || 0).toFixed(2)}</p>
                </div>
                <div class="bg-white p-6 rounded-lg border border-gray-200">
                    <p class="text-sm text-gray-600">Completion Rate</p>
                    <p class="text-3xl font-bold text-orange-600">${data.completionRate.toFixed(1)}%</p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <p class="text-gray-700 font-medium">Shipped</p>
                    <p class="text-3xl font-bold text-blue-600">${data.shipped || 0}</p>
                </div>
                <div class="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <p class="text-gray-700 font-medium">In Process</p>
                    <p class="text-3xl font-bold text-yellow-600">${data.inProcess || 0}</p>
                </div>
                <div class="bg-red-50 p-6 rounded-lg border border-red-200">
                    <p class="text-gray-700 font-medium">Cancelled</p>
                    <p class="text-3xl font-bold text-red-600">${data.cancelled || 0}</p>
                </div>
            </div>
        `;
    }

    document.getElementById('report-content').innerHTML = html;
}

// Load Pivot & Lookup Views
async function loadPivotView(view) {
    const pageTitle = document.getElementById('page-title');
    const pivotContent = document.getElementById('pivot-content');
    pivotContent.innerHTML = '<p class="text-center text-gray-500">Loading...</p>';

    try {
        let url, render;
        
        if (view === 'pivot-sales-line') {
            pageTitle.innerText = 'Sales by Product Line';
            url = '/api/pivot/sales-by-line';
            render = renderSalesByLine;
        } else if (view === 'pivot-sales-customer') {
            pageTitle.innerText = 'Top Customers';
            url = '/api/pivot/sales-by-customer';
            render = renderSalesByCustomer;
        } else if (view === 'pivot-order-status') {
            pageTitle.innerText = 'Order Status';
            url = '/api/pivot/order-status';
            render = renderOrderStatus;
        } else if (view === 'lookup-customers') {
            pageTitle.innerText = 'Customer Orders Lookup';
            url = '/api/lookup/customers';
            render = renderLookupTable;
        } else if (view === 'lookup-products') {
            pageTitle.innerText = 'Product Orders Lookup';
            url = '/api/lookup/products';
            render = renderLookupTable;
        }

        const response = await fetch(url);
        const data = await response.json();
        render(data, pivotContent);
    } catch (error) {
        console.error('Error:', error);
        pivotContent.innerHTML = '<p class="text-center text-red-500">Error loading data</p>';
    }
}

// Render Sales by Product Line with Chart
function renderSalesByLine(data, container) {
    const labels = data.map(d => d.productLine);
    const revenues = data.map(d => parseFloat(d.totalRevenue || 0));
    const orders = data.map(d => parseInt(d.orders || 0));

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold mb-4">Revenue by Product Line</h3>
                <canvas id="chartRevenue" style="max-height: 300px;"></canvas>
            </div>
            <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold mb-4">Orders by Product Line</h3>
                <canvas id="chartOrders" style="max-height: 300px;"></canvas>
            </div>
        </div>
        <div class="bg-white p-6 rounded-lg border border-gray-200 mt-6">
            <h3 class="text-lg font-semibold mb-4">Product Line Sales Details</h3>
            <table class="w-full text-sm">
                <thead class="bg-gray-50"><tr><th class="px-4 py-2 text-left">Product Line</th><th class="px-4 py-2 text-right">Orders</th><th class="px-4 py-2 text-right">Total Qty</th><th class="px-4 py-2 text-right">Revenue</th></tr></thead>
                <tbody class="divide-y">
                    ${data.map(d => `<tr><td class="px-4 py-2">${d.productLine}</td><td class="px-4 py-2 text-right">${d.orders}</td><td class="px-4 py-2 text-right">${d.totalQty}</td><td class="px-4 py-2 text-right font-semibold">$${parseFloat(d.totalRevenue || 0).toFixed(2)}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>
    `;

    setTimeout(() => {
        new Chart(document.getElementById('chartRevenue'), {
            type: 'doughnut',
            data: { labels, datasets: [{ data: revenues, backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'] }] },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
        new Chart(document.getElementById('chartOrders'), {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Orders', data: orders, backgroundColor: '#3b82f6' }] },
            options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } } }
        });
    }, 0);
}

// Render Top Customers
function renderSalesByCustomer(data, container) {
    const labels = data.map(d => d.customerName.substring(0, 20));
    const revenues = data.map(d => parseFloat(d.totalSpent || 0));

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold mb-4">Top Customers by Revenue</h3>
                <canvas id="chartTopCustomers" style="max-height: 400px;"></canvas>
            </div>
            <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold mb-4">Top 10 Customers Details</h3>
                <table class="w-full text-sm max-h-96 overflow-y-auto block">
                    <thead class="bg-gray-50 block w-full"><tr><th class="px-4 py-2 text-left w-1/2">Name</th><th class="px-4 py-2 text-right w-1/2">Revenue</th></tr></thead>
                    <tbody class="divide-y block w-full">
                        ${data.map(d => `<tr class="flex"><td class="px-4 py-2 w-1/2">${d.customerName}</td><td class="px-4 py-2 text-right w-1/2 font-semibold">$${parseFloat(d.totalSpent || 0).toFixed(2)}</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    setTimeout(() => {
        new Chart(document.getElementById('chartTopCustomers'), {
            type: 'bar',
            data: { labels, datasets: [{ label: 'Revenue ($)', data: revenues, backgroundColor: '#10b981' }] },
            options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } } }
        });
    }, 0);
}

// Render Order Status Breakdown
function renderOrderStatus(data, container) {
    const labels = data.map(d => d.status || 'Unknown');
    const counts = data.map(d => parseInt(d.count || 0));
    const amounts = data.map(d => parseFloat(d.totalAmount || 0));

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold mb-4">Order Count by Status</h3>
                <canvas id="chartStatusCount" style="max-height: 300px;"></canvas>
            </div>
            <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-lg font-semibold mb-4">Revenue by Status</h3>
                <canvas id="chartStatusRevenue" style="max-height: 300px;"></canvas>
            </div>
        </div>
        <div class="bg-white p-6 rounded-lg border border-gray-200 mt-6">
            <h3 class="text-lg font-semibold mb-4">Order Status Summary</h3>
            <table class="w-full text-sm">
                <thead class="bg-gray-50"><tr><th class="px-4 py-2 text-left">Status</th><th class="px-4 py-2 text-right">Count</th><th class="px-4 py-2 text-right">Total Amount</th></tr></thead>
                <tbody class="divide-y">
                    ${data.map(d => `<tr><td class="px-4 py-2 font-medium">${d.status || 'Unknown'}</td><td class="px-4 py-2 text-right">${d.count}</td><td class="px-4 py-2 text-right">$${parseFloat(d.totalAmount || 0).toFixed(2)}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>
    `;

    setTimeout(() => {
        new Chart(document.getElementById('chartStatusCount'), {
            type: 'doughnut',
            data: { labels, datasets: [{ data: counts, backgroundColor: ['#10b981', '#3b82f6', '#ef4444'] }] },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
        new Chart(document.getElementById('chartStatusRevenue'), {
            type: 'pie',
            data: { labels, datasets: [{ data: amounts, backgroundColor: ['#10b981', '#3b82f6', '#ef4444'] }] },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
    }, 0);
}

// Render Lookup Tables (Generic)
function renderLookupTable(data, container) {
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 py-8">No data available</p>';
        return;
    }

    const columns = Object.keys(data[0]);
    const colHeaders = columns.map(c => c.replace(/([A-Z])/g, ' $1').trim());

    let html = `
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>${columns.map((c, i) => `<th class="px-4 py-3 text-left font-medium text-gray-600">${colHeaders[i]}</th>`).join('')}</tr>
                    </thead>
                    <tbody class="divide-y">
    `;

    data.forEach(row => {
        html += '<tr class="hover:bg-gray-50">';
        columns.forEach(col => {
            let value = row[col];
            if (typeof value === 'number') {
                if (col.toLowerCase().includes('revenue') || col.toLowerCase().includes('spent') || col.toLowerCase().includes('price')) {
                    value = '$' + parseFloat(value).toFixed(2);
                } else if (col.toLowerCase().includes('total') && !col.toLowerCase().includes('count')) {
                    value = parseFloat(value).toFixed(2);
                }
            }
            html += `<td class="px-4 py-2">${value || '-'}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table></div></div>';
    container.innerHTML = html;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    showView('customers');
});
