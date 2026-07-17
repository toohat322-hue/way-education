# Dockerfile for Way Education
# Builds both frontend (static) and backend (NestJS)

# 1. Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Build Backend
FROM node:22-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma/
RUN npm ci
COPY backend/ .
RUN npm run build

# 3. Production runtime
FROM node:22-alpine
WORKDIR /app

# Copy backend dependencies
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/package*.json ./
COPY --from=backend-builder /app/backend/prisma ./prisma

# Copy frontend build output (can be served by NestJS or another server like Nginx)
COPY --from=frontend-builder /app/dist ./frontend-dist

ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

# Start the NestJS application
CMD ["npm", "run", "start:prod"]
