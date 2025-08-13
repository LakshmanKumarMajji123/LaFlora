const mysql = require('mysql');
require('dotenv').config();

const MySQLConPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'notes_db',
  connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT) || 20000,
  connectionLimit: parseInt(process.env.DB_MAX_POOL_SIZE) || 100,
  debug: false,
  multipleStatements: true,
});

// Test connection on startup
MySQLConPool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database:', process.env.DB_NAME);
  connection.release();
});

module.exports = {
  MySQLConPool
};
