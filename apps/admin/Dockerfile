FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --config.allowBuilds='{"sharp":true,"unrs-resolver":true}'

COPY . .

EXPOSE 3001

CMD ["pnpm", "exec", "next", "dev", "-H", "0.0.0.0"]