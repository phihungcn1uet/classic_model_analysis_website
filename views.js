/**
 * HTML Views/Templates
 */

const getIndexHTML = () => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Classic Models ERP Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js"></script>
    <style>
        .nav-item { transition: all 0.2s ease; }
        .nav-item:hover { background-color: #374151; color: white; }
        .nav-active { background-color: #1d4ed8; color: white; font-weight: 600; }
        .nav-active:hover { background-color: #1e40af; }
    </style>
</head>
<body class="bg-gray-50 flex h-screen overflow-hidden text-gray-800 font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-900 text-gray-300 flex flex-col hidden md:flex">
        <div class="h-16 flex items-center px-6 bg-gray-950 font-bold text-xl tracking-wider text-white border-b border-gray-800">
            CLASSIC MODELS
        </div>
        <nav class="flex-1 px-4 py-6 space-y-2">
            <p class="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Database Tables</p>
            <button onclick="showView('customers')" id="nav-customers" class="nav-item nav-active w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Customers
            </button>
            <button onclick="showView('products')" id="nav-products" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                Products
            </button>
            <button onclick="showView('orders')" id="nav-orders" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                Orders
            </button>
            <button onclick="showView('orderdetails')" id="nav-orderdetails" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Order Details
            </button>
            <button onclick="showView('payments')" id="nav-payments" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h4m4 0h4M7 19h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Payments
            </button>
            <button onclick="showView('employees')" id="nav-employees" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"></path></svg>
                Employees
            </button>
            <button onclick="showView('offices')" id="nav-offices" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path></svg>
                Offices
            </button>
            <button onclick="showView('productlines')" id="nav-productlines" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                Product Lines
            </button>

            <p class="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Reports</p>
            <button onclick="showView('report-overview')" id="nav-report-overview" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Overview
            </button>
            <button onclick="showView('report-customers')" id="nav-report-customers" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                Customers
            </button>
            <button onclick="showView('report-products')" id="nav-report-products" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                Products
            </button>
            <button onclick="showView('report-orders')" id="nav-report-orders" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                Orders
            </button>

            <p class="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Pivot Tables</p>
            <button onclick="showView('pivot-sales-line')" id="nav-pivot-sales-line" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Sales by Line
            </button>
            <button onclick="showView('pivot-sales-customer')" id="nav-pivot-sales-customer" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Top Customers
            </button>
            <button onclick="showView('pivot-order-status')" id="nav-pivot-order-status" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                Order Status
            </button>

            <p class="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-6">Lookups</p>
            <button onclick="showView('lookup-customers')" id="nav-lookup-customers" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                Customer Orders
            </button>
            <button onclick="showView('lookup-products')" id="nav-lookup-products" class="nav-item w-full text-left px-4 py-2.5 rounded-lg flex items-center">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                Product Orders
            </button>
        </nav>
        <div class="p-4 border-t border-gray-800 text-xs text-gray-500">
            Node.js ERP Dashboard
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header class="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
            <h1 id="page-title" class="text-xl font-semibold text-gray-800">Customers</h1>
            <div class="flex items-center text-sm text-gray-500">
                <span class="w-2 h-2 rounded-full bg-green-500 mr-2"></span> System Online
            </div>
        </header>

        <!-- Table View -->
        <div id="table-view" class="flex-1 overflow-auto p-6 bg-gray-50">
            <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div id="filters-section" class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                    <div id="filters-container" class="grid grid-cols-1 md:grid-cols-4 gap-4"></div>
                </div>
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                    <span id="record-count" class="text-sm font-medium text-gray-500">Loading records...</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse" id="data-table">
                        <thead class="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200" id="table-head"></thead>
                        <tbody class="divide-y divide-gray-200 text-sm" id="table-body"></tbody>
                    </table>
                </div>
                <div id="empty-state" class="hidden py-12 text-center text-gray-500">No data available for this table.</div>
            </div>
        </div>

        <!-- Report View -->
        <div id="report-view" class="hidden flex-1 overflow-auto p-6 bg-gray-50">
            <div id="report-content"></div>
        </div>

        <!-- Pivot & Lookup View -->
        <div id="pivot-view" class="hidden flex-1 overflow-auto p-6 bg-gray-50">
            <div id="pivot-content"></div>
        </div>
    </main>

    <script src="/static/app.js"></script>
</body>
</html>`;

module.exports = {
    getIndexHTML
};
