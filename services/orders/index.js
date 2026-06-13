const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const prisma = require('@pulsehive/db');
const app = express();
app.use(bodyParser.json());

const eventBusUrl = process.env.EVENT_BUS_URL || 'http://event-bus:5000';

app.post('/events', async (req, res) => {
  const event = req.body;
  if (!event || event.type !== 'payment.matched' || !event.payload?.orderId) {
    return res.status(400).json({ error: 'invalid_event' });
  }

  try {
    await prisma.order.update({
      where: { id: event.payload.orderId },
      data: { isPaid: true, status: 'Ready to Ship' }
    });
    console.log('Processed payment.matched event for order:', event.payload.orderId);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Failed to process payment.matched event:', error);
    return res.status(500).json({ error: 'event_processing_failed', message: error.message });
  }
});

const safeAsync = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// List orders (filter by tenant via query ?tenantId=...)
app.get('/orders', safeAsync(async (req, res) => {
  const tenantId = req.query.tenantId;
  if (!tenantId) return res.status(400).json({ error: 'tenantId required' });
  const data = await prisma.order.findMany({ where: { tenantId }, orderBy: { date: 'desc' } });
  res.json(data);
}));

app.post('/orders', safeAsync(async (req, res) => {
  const payload = req.body;
  if (!payload.tenantId) return res.status(400).json({ error: 'tenantId required' });
  // basic duplicate prevention: same customer pending order
  const existing = await prisma.order.findFirst({
    where: {
      tenantId: payload.tenantId,
      customerName: { equals: payload.customerName, mode: 'insensitive' },
      NOT: { status: 'Shipped' }
    }
  });
  if (existing) return res.status(409).json({ error: 'Customer already has an active order', order: existing });

  const created = await prisma.order.create({
    data: { ...payload, reference: payload.reference || `BRIGHT-${Date.now().toString().slice(-4)}` }
  });

  try {
    await axios.post(`${eventBusUrl}/publish`, {
      type: 'order.created',
      payload: {
        orderId: created.id,
        tenantId: created.tenantId,
        amount: created.amount,
        customerName: created.customerName,
        status: created.status
      }
    });
  } catch (error) {
    console.error('Failed to publish order.created event:', error.message || error);
  }

  res.status(201).json(created);
}));

app.use((err, req, res, next) => {
  console.error('Orders service error:', err);
  res.status(500).json({ error: 'internal_error', message: err.message || 'Unexpected error' });
});

app.listen(4001, '0.0.0.0', () => console.log('Orders service listening on http://0.0.0.0:4001'));
