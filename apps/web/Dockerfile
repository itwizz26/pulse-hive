# Step 1: Base Environment
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Step 2: Dependency Resolver
FROM base AS dependencies
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

# Step 3: Compilation Layer
FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN pnpm build

# Step 4: Ultra-Lightweight Production Runtime
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
# Tell Next.js to broadcast outside the container boundary so Railway can find it
ENV HOSTNAME="0.0.0.0"

# Copy essential static assets and standalone build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
# Run directly with raw node to eliminate pnpm lifecycle crashes at runtime
CMD ["node", "server.js"]
