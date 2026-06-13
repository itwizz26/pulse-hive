const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');
const axios = require('axios');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
const EVENT_SUBSCRIBERS = process.env.EVENT_SUBSCRIBERS || '';
const PORT = parseInt(process.env.PORT, 10) || 5000;

const parseSubscribers = (value) => {
  return value.split(',').reduce((acc, pair) => {
    const [eventType, url] = pair.split('=').map((item) => item && item.trim());
    if (!eventType || !url) return acc;
    acc[eventType] = acc[eventType] || [];
    acc[eventType].push(url);
    return acc;
  }, {});
};

const subscribers = parseSubscribers(EVENT_SUBSCRIBERS);
const app = express();
app.use(bodyParser.json());

let channel;
const MAX_RETRY_ATTEMPTS = 12;
const RETRY_DELAY_MS = 2000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const safeLog = (...args) => console.log('[event-bus]', ...args);

const connectRabbit = async () => {
  let attempt = 0;
  while (attempt < MAX_RETRY_ATTEMPTS) {
    try {
      const connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertExchange('pulsehive.events', 'topic', { durable: true });
      
      for (const [eventType, urls] of Object.entries(subscribers)) {
        const routingKey = eventType;
        const queueBase = `pulsehive.queue.${eventType}`;

        for (const [index, url] of urls.entries()) {
          const queueName = `${queueBase}.${index}`;
          await channel.assertQueue(queueName, { durable: true });
          await channel.bindQueue(queueName, 'pulsehive.events', routingKey);
          await channel.consume(queueName, async (msg) => {
            if (!msg) return;
            const body = msg.content.toString();
            const payload = JSON.parse(body);

            try {
              await axios.post(url, payload, {
                timeout: 10000,
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              channel.ack(msg);
              safeLog(`delivered event ${routingKey} -> ${url}`);
            } catch (error) {
              safeLog(`failed delivery ${routingKey} -> ${url}:`, error.message || error);
              channel.nack(msg, false, false);
            }
          });
          safeLog(`subscribed ${url} to ${eventType} via ${queueName}`);
        }
      }

      connection.on('error', (err) => {
        safeLog('RabbitMQ connection error:', err.message);
        process.exit(1);
      });

      connection.on('close', () => {
        safeLog('RabbitMQ connection closed, exiting');
        process.exit(1);
      });

      return;
    } catch (error) {
      attempt += 1;
      safeLog(`RabbitMQ connection attempt ${attempt}/${MAX_RETRY_ATTEMPTS} failed:`, error.message || error);
      if (attempt >= MAX_RETRY_ATTEMPTS) {
        throw error;
      }
      await sleep(RETRY_DELAY_MS * attempt);
    }
  }
};

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/publish', async (req, res) => {
  const { type, payload } = req.body;
  if (!type || typeof payload === 'undefined') {
    return res.status(400).json({ error: 'Missing type or payload' });
  }

  const event = {
    type,
    payload,
    timestamp: new Date().toISOString()
  };

  try {
    await channel.publish(
      'pulsehive.events',
      type,
      Buffer.from(JSON.stringify(event)),
      { persistent: true }
    );
    safeLog(`published event ${type}`);
    return res.status(202).json({ status: 'published', event });
  } catch (error) {
    safeLog('publish failed:', error.message || error);
    return res.status(500).json({ error: 'Failed to publish event' });
  }
});

app.listen(PORT, async () => {
  safeLog(`event-bus listening on port ${PORT}`);
  try {
    await connectRabbit();
    safeLog('connected to RabbitMQ and initialized subscriptions');
  } catch (error) {
    safeLog('failed to connect RabbitMQ:', error.message || error);
    process.exit(1);
  }
});
