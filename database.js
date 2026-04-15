/**
 * Database Connection & Query Functions
 */

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Hung7a159753@',
    database: 'classicmodels',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Execute a database query
 */
async function query(sql, params = []) {
    try {
        const connection = await pool.getConnection();
        const [results] = await connection.execute(sql, params);
        connection.release();
        return results;
    } catch (error) {
        console.error('Database error:', error.message);
        throw error;
    }
}

module.exports = {
    query
};
