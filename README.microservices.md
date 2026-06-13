Microservices monorepo layout

This workspace now contains a lightweight microservices skeleton:

- services/api - API gateway (placeholder)
- services/orders - Orders service (Express)
- services/payments - Payments & matching service (Express)
- services/auth - Auth service (JWT/OAuth placeholders)
- mobile-app - Expo mobile app skeleton (init recommended)

Next steps:
1. Choose a database (Postgres recommended for production; SQLite for local dev).
2. Initialize each service with `npm install` and add real routes.
3. Implement Prisma models and migrations in `services/*` as needed.
4. Add Capitec integration in `services/payments` behind OAuth.
