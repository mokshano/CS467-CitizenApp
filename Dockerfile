# Production Dockerfile for Azure deployment
FROM node:18-alpine AS build
WORKDIR /app
# Copy root and server and client package manifests
COPY package.json ./
COPY server/package.json ./server/package.json
COPY client/package.json ./client/package.json
# Install dependencies for server and client
RUN npm install && npm install --prefix server && npm install --prefix client
# Build client
RUN npm run build --prefix client
# Copy source code
COPY server ./server
COPY client ./client
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["node","server/index.js"]
