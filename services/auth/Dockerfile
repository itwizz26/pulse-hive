FROM node:22-alpine

WORKDIR /app

# 💡 Use corepack to reliably activate pnpm on alpine
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy structural definitions
COPY package.json pnpm-lock.yaml ./

# Install dependencies including devDependencies
RUN pnpm install

# Copy application layers
COPY . .

# Generate Prisma types initially inside the node_modules core
RUN pnpm prisma generate

EXPOSE 4001

# Default fallback if command is not overwritten by compose
CMD ["pnpm", "run", "start:dev"]