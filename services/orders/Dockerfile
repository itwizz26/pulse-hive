FROM node:22-alpine

RUN apk add --no-cache openssl

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma:generate

RUN pnpm run build

EXPOSE 4002

CMD ["pnpm", "run", "start:dev"]