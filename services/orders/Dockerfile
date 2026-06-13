FROM node:18-bullseye-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY services/db/ ../db/
RUN cd ../db && npm install --fetch-retries=5 --fetch-retry-factor=2 --fetch-retry-mintimeout=1000 --fetch-retry-maxtimeout=60000
RUN cd ../db && npx prisma generate --schema=./prisma/schema.prisma

COPY services/orders/package.json ./package.json
COPY services/orders/index.js ./index.js
RUN npm install --fetch-retries=5 --fetch-retry-factor=2 --fetch-retry-mintimeout=1000 --fetch-retry-maxtimeout=60000

EXPOSE 4001

CMD ["sh", "-c", "cd ../db && npx prisma migrate deploy --schema=./prisma/schema.prisma && cd /app && npm start"]
