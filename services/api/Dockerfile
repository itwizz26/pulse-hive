# --- Stage 1: Build Image ---
FROM node:22-alpine AS builder
WORKDIR /app

# Install pnpm natively
RUN npm install -g pnpm

# 💡 CRITICAL: Tell pnpm and Nest CLI explicitly that this is a headless CI container
ENV CI=true

# Copy package configurations
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy source configurations
COPY . .

# Run the NestJS build compilation smoothly
RUN pnpm run build

# --- Stage 2: Minimal Runtime Execution Engine ---
FROM node:22-alpine AS runner
WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 4000
CMD ["pnpm", "run", "start:prod"]