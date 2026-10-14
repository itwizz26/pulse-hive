FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app

RUN npm install -g pnpm

# Install using the Orders service's own dependency files.
COPY services/orders/package.json services/orders/pnpm-lock.yaml* services/orders/pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# Copy Orders source code.
COPY services/orders/ ./

# Generate Prisma Client from the authoritative DB schema.
COPY services/db/prisma/schema.prisma ./prisma/schema.prisma

RUN pnpm prisma:generate

RUN pnpm run build

EXPOSE 4002

CMD ["pnpm", "run", "start:dev"]
