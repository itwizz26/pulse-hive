FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./

RUN pnpm install --config.allowBuilds='{"@prisma/engines":true,"bcrypt":true,"prisma":true}'

COPY . .

RUN pnpm run build

EXPOSE 4001

CMD ["pnpm", "run", "start:prod"]