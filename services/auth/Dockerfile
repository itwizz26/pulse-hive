# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

# Stage 2: Production
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy EVERYTHING from node_modules/ from the builder
COPY --from=builder /app/node_modules ./node_modules

# Copy only the compiled code
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]