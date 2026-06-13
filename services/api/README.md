API Gateway (reverse-proxy). For development it proxies to internal services:
- /orders -> http://localhost:4001
- /payments -> http://localhost:4002
- /auth -> http://localhost:4003

Run locally:

```bash
cd services/api
npm install
npm start
```
