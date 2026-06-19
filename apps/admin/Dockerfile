FROM node:20-alpine
WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

# Clear cache and install all packages with high network resilience
RUN npm cache clean --force && \
    npm install \
    --fetch-retries=5 \
    --fetch-retry-factor=2 \
    --fetch-retry-mintimeout=5000 \
    --fetch-retry-maxtimeout=60000 \
    --loglevel=notice

# Copy source configuration files
COPY . .

EXPOSE 3000

# Execute next framework binary command inside dev runtime mode
CMD ["npm", "run", "dev"]