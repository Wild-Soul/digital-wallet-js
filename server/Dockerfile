# Build stage
FROM node:20.15.1-slim AS builder

WORKDIR /app

COPY package*.json ./
# Use npm ci, so that pckage-lock.json will be used to install packages.
# Otherwise may run into "it runs on my machine" error ^_^
RUN npm ci

COPY . .
RUN npm run build

# Final image
FROM node:20.15.1-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/build ./dist

USER nobody

CMD ["node", "dist/server.js"]
