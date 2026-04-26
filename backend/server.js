// ============================================================
<<<<<<< HEAD
// FighTea — Express Server  (server.js)
=======
// FighTea — Express Server Entry Point
// File: /backend/server.js
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
// ============================================================
'use strict';

require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

<<<<<<< HEAD
// ── CORS ─────────────────────────────────────────────────────
// Allow: localhost (dev), file:// (local file open), and the
// configured FRONTEND_URL (production Vercel / custom domain).
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5500',   // VS Code Live Server
  'http://localhost:5500',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no Origin header (file://, curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS: ' + origin));
=======
// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];
    
    // Allow any vercel.app domain
    if (!origin || 
        allowedOrigins.includes(origin) || 
        (origin && origin.includes('vercel.app'))) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow for now, log issues
    }
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control'],
  exposedHeaders: ['Content-Type'],
}));

<<<<<<< HEAD
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ───────────────────────────────────────────────────
=======
app.use(express.json({ limit: '10mb' }));      // allows base64 image uploads
app.use(express.urlencoded({ extended: true }));

// ── Static assets (uploaded product images) ───────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────────
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/menu',          require('./routes/menu'));
app.use('/api/orders',        require('./routes/orders'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/analytics',     require('./routes/analytics'));
app.use('/api/notifications', require('./routes/notifications'));

<<<<<<< HEAD
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// 404
app.use((req, res) =>
  res.status(404).json({ error: `${req.method} ${req.path} not found.` })
);

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🧋 FighTea API  →  http://localhost:${PORT}`);
  console.log(`   Mode        :  ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Allowed origins: ${allowedOrigins.join(', ')}\n`);
});

module.exports = app;
=======
// ── Health check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// ── Global error handler ──────────────────────────────────
app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start ─────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🧋 FighTea API running → http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
});

module.exports = app;   // exported for testing
>>>>>>> fef27f4cc1a0ba80081bbc1801bfdbf01ba6e728
