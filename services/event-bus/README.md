# PulseHive Event Bus

A lightweight RabbitMQ-backed HTTP event bus for durable event delivery and service decoupling.

Endpoints:
- `POST /publish` accepts `{ type, payload }`
- `GET /health`

Environment:
- `RABBITMQ_URL`
- `EVENT_SUBSCRIBERS`
