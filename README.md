# PulseHive - SaaS Payment & Order Management Platform

A lean microservices SaaS platform for small business owners to streamline order fulfillment and payment reconciliation with **Capitec Business** bank integration.

## 🏗️ Architecture

**Microservices** monorepo:
- **Backend Services**: API Gateway + Orders, Payments, Auth (Express.js)
- **Database**: Postgres + Prisma ORM, with a shared persistence boundary for orders and payments
- **Web Admin**: Next.js dashboard for business managers
- **Mobile App**: Expo React Native app for field/warehouse staff

```
├── services/
│   ├── api/           → API Gateway (reverse proxy)
│   ├── orders/        → Orders service
│   ├── db/            → Shared persistence boundary (Prisma schema + client)
│   ├── payments/      → Payments & matching service
│   ├── auth/          → Auth service (JWT)
├── web-admin/         → Next.js admin dashboard
├── mobile-app/        → Expo mobile app
└── docker-compose.yml → Local orchestration
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ only if you want to run individual services locally
- Expo CLI for local mobile app development (optional)

### 1. Bootstrap with Docker Compose

```bash
docker-compose up --build
```

This starts the full backend stack and web admin service:
- `web-admin` on http://localhost:3000
- `api` gateway on http://localhost:4000
- `orders` service on http://localhost:4001
- `payments` service on http://localhost:4002
- `auth` service on http://localhost:4003

### 2. Initialize Prisma Locally (optional)

If you need to work locally outside Docker:

```bash
cd services/db
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Run Individual Services Locally (optional)

```bash
cd services/api && npm install && npm start
cd services/orders && npm install && npm start
cd services/payments && npm install && npm start
cd services/auth && npm install && npm start
```

### 4. Run Web Admin Dashboard Locally (optional)

```bash
cd web-admin && npm install && npm run dev
```

### 5. Run Mobile App Locally (optional)

```bash
cd mobile-app && npm install && npm start
```
# or
cd mobile-app && npx expo start
```

## 📋 Features (Roadmap)

- [x] Multi-tenant architecture with Postgres
- [ ] Order capture and customer management
- [ ] Payment proof logging & Capitec webhook integration
- [ ] Smart payment-to-order matching (reduce manual errors)
- [ ] Payment reconciliation dashboard
- [ ] Mobile app for field staff
- [ ] Web admin dashboard for managers
- [ ] Offline sync & conflict resolution
- [ ] Push notifications
- [ ] Multi-currency support
- [ ] Billing & subscription management

## 🔐 Authentication

Currently placeholders; will implement:
- JWT-based auth (short-lived access tokens)
- OAuth 2.0 for Capitec Business API
- Multi-tenant session isolation

## 💳 Capitec Integration

Planned features:
- OAuth 2.0 flow to connect Capitec Business account
- Webhook ingestion of real-time transaction data
- Auto-matching payments to orders by reference
- Real-time balance & transaction sync

## 🛠️ Development

### Environment Variables

This repository is Docker-first. The root `docker-compose.yml` provides sane defaults, so a root `.env` file is not required to run the stack.

If you want to override `AUTH_SECRET` or other Compose variables, you can still create a root `.env` or pass environment values from your shell.

### Database Migrations

```bash
cd services/db
npx prisma migrate dev --name <migration_name>
```

### API Endpoints

- **Gateway**: http://localhost:4000
- **Orders**: http://localhost:4001/orders
- **Payments**: http://localhost:4002/payments
- **Auth**: http://localhost:4003/auth

## 📱 Mobile App

Expo-based React Native app for:
- Capture orders in field
- Log payment proofs (photos/PDFs)
- Real-time order status tracking
- Offline mode with sync

## 🌐 Web Admin

Next.js dashboard for:
- View all orders & payments
- Real-time reconciliation
- Multi-tenant management (admin)
- Analytics & reporting
- Export to CSV/PDF

## 📦 Deployment

(TODO)
- Docker & Kubernetes setup
- AWS/GCP/Azure deployment guides
- CI/CD pipeline (GitHub Actions)
- App Store & Google Play builds

## 📄 License

MIT

## 🤝 Contributing

See CONTRIBUTING.md (TODO)

