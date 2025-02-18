const mysql = require('mysql2');

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  host: 'mysql',
  user: 'root',
  password: 'pass123',
  database: 'node_auth',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Promisify for easier async/await usage
const promisePool = pool.promise();

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  }
  
  if (connection) {
    console.log('Successfully connected to the database.');
    connection.release();
  }
});

module.exports = promisePool;
