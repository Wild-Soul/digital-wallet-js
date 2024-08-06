FROM node:18.20.4-bullseye-slim as builder
WORKDIR /app

# Build part
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# Start serving using nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
