const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL || 'mysql://lughaty:1D$NtIYBLmezZhoQ5l@9i74#@202.10.41.139:3306/lughaty',
  waitForConnections: true,
  connectionLimit: 5,
  ssl: { rejectUnauthorized: false },
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Lughaty API server', endpoints: ['POST /api/register', 'POST /api/login', 'GET /api/users/count'] });
});

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const [rows] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    res.json({ data: { id: rows.insertId, username, email }, error: null });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.json({ data: null, error: { message: 'Email sudah terdaftar, silakan login' } });
    } else {
      res.status(500).json({ data: null, error: { message: err.message } });
    }
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    if (rows.length === 0) {
      res.json({ data: null, error: { message: 'Email atau password salah' } });
    } else {
      res.json({ data: rows[0], error: null });
    }
  } catch (err) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
});

app.get('/api/users/count', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
    res.json({ count: parseInt(rows[0].count, 10) });
  } catch (err) {
    res.status(500).json({ count: 0 });
  }
});

// Auto-create table on cold start
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('Table "users" ready');
  } catch (err) {
    console.error('Failed to create table:', err);
  }
})();

// Local dev: listen on port
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Vercel: export handler
module.exports = app;
module.exports.handler = serverless(app);
