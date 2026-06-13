const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

const ORDERS_SERVICE_URL = process.env.ORDERS_URL || 'http://orders:4001';
const PAYMENTS_SERVICE_URL = process.env.PAYMENTS_URL || 'http://payments:4002';
const AUTH_SERVICE_URL = process.env.AUTH_URL || 'http://auth:4003';

// Simple reverse proxy to internal services
app.use('/orders', createProxyMiddleware({ target: ORDERS_SERVICE_URL, changeOrigin: true }));
app.use('/payments', createProxyMiddleware({ target: PAYMENTS_SERVICE_URL, changeOrigin: true }));
app.use('/bank', createProxyMiddleware({ target: PAYMENTS_SERVICE_URL, changeOrigin: true }));
app.use('/capitec', createProxyMiddleware({ target: PAYMENTS_SERVICE_URL, changeOrigin: true }));
app.use('/auth', createProxyMiddleware({ target: AUTH_SERVICE_URL, changeOrigin: true }));

app.get('/health', (req, res) => res.json({ status: 'gateway ok' }));

app.listen(4000, () => console.log('API gateway listening on http://localhost:4000'));
