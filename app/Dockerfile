FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json before the source code
COPY package*.json ./

# Install dependencies (base image only)
RUN npm install

# Expose port
EXPOSE 3000

# Default command
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/app.ts"]