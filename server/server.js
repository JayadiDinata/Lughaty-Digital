const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_c92avTimgzkB@ep-winter-queen-aqukbdlw-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=verify-full',
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
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, password]
    );
    res.json({ data: result.rows[0], error: null });
  } catch (err) {
    if (err.code === '23505') {
      res.json({ data: null, error: { message: 'Email sudah terdaftar, silakan login' } });
    } else {
      res.status(500).json({ data: null, error: { message: err.message } });
    }
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT id, username, email FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length === 0) {
      res.json({ data: null, error: { message: 'Email atau password salah' } });
    } else {
      res.json({ data: result.rows[0], error: null });
    }
  } catch (err) {
    res.status(500).json({ data: null, error: { message: err.message } });
  }
});

app.get('/api/users/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM users');
    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    res.status(500).json({ count: 0 });
  }
});

// Auto-create table on cold start
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`).then(() => {
  console.log('Table "users" ready');
}).catch(err => {
  console.error('Failed to create table:', err);
});

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
