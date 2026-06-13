# PulseHive Admin Dashboard

Next.js-based web admin dashboard for business managers to view orders, payments, and reconciliation reports.

## Features

- **Dashboard**: Overview of KPIs (total orders, revenue, pending payments, ready to ship)
- **Orders**: View all orders for a tenant
- **Payments**: Log and view payment records
- **Reconciliation**: Real-time payment-to-order matching and discrepancy reporting
- **Settings**: Tenant configuration and user management (TODO)

## Getting Started

1. Install dependencies:
```bash
cd web-admin
npm install
```

2. Create `.env.local` with API endpoint:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

- Uses Next.js 14+ App Router
- API client in `lib/api.js` handles JWT auth tokens
- Pages organized by feature (orders, payments, reconciliation)
- Styling via global CSS (can replace with Tailwind/Styled Components)

## TODO

- Integrate with API gateway endpoints
- Add auth flow (login screen, JWT token handling)
- Implement live data fetching
- Add export to CSV functionality
- Multi-tenant tenant selector
