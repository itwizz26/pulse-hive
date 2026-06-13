const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const prisma = require('@pulsehive/db');
const bankAdapters = require('./bankAdapters');
const app = express();
app.use(bodyParser.json());

const eventBusUrl = process.env.EVENT_BUS_URL || 'http://event-bus:5000';

const safeAsync = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const handleBankWebhook = async (req, res, provider) => {
  const adapter = bankAdapters[provider.toLowerCase()];
  if (!adapter) return res.status(400).json({ error: 'unsupported_provider', provider });

  const transaction = await adapter.parseWebhook(req.body, req.headers);
  if (!transaction || !transaction.tenantId) {
    return res.status(400).json({ error: 'invalid_webhook_payload' });
  }

  const created = await prisma.payment.create({ data: transaction });
  res.status(201).json(created);
};

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// List payments for tenant
app.get('/payments', safeAsync(async (req, res) => {
  const tenantId = req.query.tenantId;
  if (!tenantId) return res.status(400).json({ error: 'tenantId required' });
  const data = await prisma.payment.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  res.json(data);
}));

app.post('/payments', safeAsync(async (req, res) => {
  const payload = req.body;
  if (!payload.tenantId) return res.status(400).json({ error: 'tenantId required' });
  const created = await prisma.payment.create({ data: payload });
  res.status(201).json(created);
}));

app.post('/events', safeAsync(async (req, res) => {
  const event = req.body;
  if (!event || event.type !== 'order.created' || !event.payload?.orderId) {
    return res.status(400).json({ error: 'invalid_event' });
  }

  const { orderId, tenantId, amount, customerName } = event.payload;
  if (!tenantId || !orderId || typeof amount !== 'number') {
    return res.status(400).json({ error: 'invalid_order_payload' });
  }

  const created = await prisma.payment.create({
    data: {
      tenantId,
      orderId,
      amount,
      customerName: customerName || 'Unknown',
      reference: `ORDER-${orderId}`
    }
  });

  console.log('Processed order.created event for order:', orderId);
  res.status(201).json({ ok: true, payment: created });
}));

// Match payment to order endpoint
app.post('/payments/:paymentId/match/:orderId', safeAsync(async (req, res) => {
  const { paymentId, orderId } = req.params;
  const payment = await prisma.payment.update({
    where: { id: paymentId },
    data: { matched: true, orderId }
  });

  try {
    await axios.post(`${eventBusUrl}/publish`, {
      type: 'payment.matched',
      payload: {
        orderId,
        paymentId,
        tenantId: payment.tenantId,
        amount: payment.amount
      }
    });
  } catch (error) {
    console.error('Failed to publish payment.matched event:', error.message || error);
    return res.status(502).json({ error: 'event_bus_publish_failed', message: error.message || 'Publish failed' });
  }

  res.status(200).json({ ok: true, event: 'payment.matched' });
}));

app.post('/bank/webhook', safeAsync(async (req, res) => {
  const provider = (req.query.provider || req.headers['x-bank-provider'] || 'capitec').toLowerCase();
  await handleBankWebhook(req, res, provider);
}));

app.post('/capitec/webhook', safeAsync(async (req, res) => {
  await handleBankWebhook(req, res, 'capitec');
}));

app.use((err, req, res, next) => {
  console.error('Payments service error:', err);
  res.status(500).json({ error: 'internal_error', message: err.message || 'Unexpected error' });
});

app.listen(4002, '0.0.0.0', () => console.log('Payments service listening on http://0.0.0.0:4002'));
