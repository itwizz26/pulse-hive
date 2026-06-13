# Architecture Overview

## Project Structure

The project is organized as a microservices monorepo with separate services for each responsibility:

- `services/api/` — API gateway and reverse proxy to backend services.
- `services/orders/` — Orders service responsible for order creation, retrieval, and duplicate prevention.
- `services/payments/` — Payments service responsible for payment logging, matching, and Capitec webhook support.
- `services/auth/` — Authentication service issuing JWTs.
- `services/db/` — Shared persistence boundary with a single PostgreSQL database and tenant-aware Prisma schema.
- `web-admin/` — Next.js admin dashboard for managers.
- `mobile-app/` — Expo mobile app skeleton for field use.

## Database

- Uses PostgreSQL for persistence.
- Prisma ORM handles database models and migrations.
- Multi-tenant design with `Tenant` as the root entity.
- All orders and payments are linked to a `tenantId`.

## Service Ports

- API gateway: `http://localhost:4000`
- Orders service: `http://localhost:4001`
- Payments service: `http://localhost:4002`
- Auth service: `http://localhost:4003`

## Local Orchestration

- `docker-compose.yml` defines Redis, Postgres, and service containers.
- Dockerfiles exist for each Express service and for the web admin frontend.
- Services are bootstrapped via Docker Compose rather than relying on a root npm workspace.
- Orders and payments communicate asynchronously through Redis pub/sub events.
