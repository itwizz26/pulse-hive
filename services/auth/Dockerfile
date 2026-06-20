FROM node:22-alpine

WORKDIR /app

# Enable corepack for reliable pnpm integration inside Node 22
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy your package.json (which now contains the secure pnpm whitelist) and lockfile
COPY package.json pnpm-lock.yaml ./

# This will now pass flawlessly because pnpm reads the rule directly out of package.json
RUN pnpm install

# Copy the rest of the application layers
COPY . .

# Initialize Prisma Client models
RUN pnpm prisma generate

EXPOSE 4001

CMD ["pnpm", "run", "start:dev"]