const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
app.use(bodyParser.json());

const SECRET = process.env.AUTH_SECRET || 'dev-secret';

app.get('/auth/health', (req, res) => res.json({ status: 'ok' }));

app.post('/auth/login', (req, res) => {
  const { username } = req.body;
  // Placeholder: in production, validate credentials
  const token = jwt.sign({ username }, SECRET, { expiresIn: '8h' });
  res.json({ token });
});

app.listen(4003, '0.0.0.0', () => console.log('Auth service listening on http://0.0.0.0:4003'));
