FROM node:20-alpine
WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

# Clear cache and install all packages
RUN npm install

# Copy source configuration files
COPY . .

EXPOSE 3000

# Execute next framework binary command inside dev runtime mode
CMD ["npm", "run", "dev"]