# --- Stage 1: Build Application Layer ---
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# --- Stage 2: Clean Runtime Execution ---
FROM node:22-alpine

WORKDIR /app

# Pull execution layers from Stage 1
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/tsconfig.json /app/nest-cli.json ./
COPY --from=builder /app/src ./src

EXPOSE 4001

CMD ["sh", "-c", "npx prisma generate && npm run start:dev"]