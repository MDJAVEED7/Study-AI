# Use a small Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose your backend port
EXPOSE 3000

# Run the app
CMD ["node", "server.js"]