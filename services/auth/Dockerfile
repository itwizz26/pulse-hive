# Stage 1: Build
FROM node:22-alpine AS builder

# Install dependencies required for building (including native build tools)
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npx prisma generate
RUN npm run build 

# Stage 2: Production
FROM node:22-alpine AS runner

WORKDIR /app

# Copy package files to install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the built output from builder
COPY --from=builder /app/dist ./dist

# CRITICAL: Copy the entire node_modules from builder.
# This ensures that dynamic adapters (like @prisma/adapter-pg) 
# and the generated prisma client are exactly where the runtime expects them.
COPY --from=builder /app/node_modules ./node_modules

# Ensure Prisma binaries are executable (if needed for your specific architecture)
RUN chmod -R 755 ./node_modules/.prisma

# Set production environment
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]