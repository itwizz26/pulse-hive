FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy both manifests before installing dependencies
COPY package.json pnpm-lock.yaml ./

# Install exactly the versions recorded in the lockfile
RUN pnpm install --frozen-lockfile --config.allowBuilds='{"@prisma/engines":true,"bcrypt":true,"prisma":true}'

# Copy the application source and Prisma schema
COPY . .

# Generate Prisma Client and compile the application
RUN pnpm run build

EXPOSE 4001

CMD ["pnpm", "run", "start:prod"]
