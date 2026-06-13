# Implementation Summary

## What has been implemented so far

### Microservices & Monorepo
- Created a lean microservices monorepo structure.
- Added an API gateway service (`services/api`).
- Added orders, payments, and auth backend services.
- Added a shared Prisma ORM package in `services/db` for a single Postgres database.
- Added Dockerfiles for each service and a `docker-compose.yml` for local orchestration.

### Database Schema
- Implemented a combined domain schema in `services/db/prisma/schema.prisma`.
- Models include `Tenant`, `Order`, and `Payment`, with `orderId` stored as a relational foreign key to `Order`.

### Backend Services
- `services/orders/index.js`: tenant-aware order retrieval and creation with duplicate prevention.
- `services/payments/index.js`: tenant-aware payment creation, listing, and matching endpoint.
- `services/auth/index.js`: placeholder JWT auth service.
- `services/api/index.js`: reverse proxy for service routing.

### Web Admin
- Created `web-admin/` Next.js app.
- Built basic pages for Dashboard, Orders, Payments, and Reconciliation.
- Added API client helper in `web-admin/lib/api.js`.

### Mobile App
- Created `mobile-app/` Expo skeleton with `App.js` placeholder.

## Notes
- Capitec Business OAuth and webhook integration are planned but not yet implemented.
- Auth currently uses a placeholder JWT service and must be extended for production.
- Web admin pages currently include placeholder data and require API integration.
