FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (cached layer)
COPY package*.json ./
RUN npm ci

# Prisma schema for generate step
COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate

# Copy source and build
COPY tsconfig*.json vite.config.ts ./
COPY src ./src
COPY ops ./ops
COPY server.ts ./
COPY index.html ./
RUN npm run build

# Production image
FROM node:20-alpine
WORKDIR /app

# Create data directory for SQLite volume mount
RUN mkdir -p /data

# Copy built frontend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/ops ./ops
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.server.json ./
COPY --from=builder /app/tsconfig.json ./

# Set database path to persist on volume
ENV DATABASE_URL="file:/data/prod.db"

EXPOSE 3001

# On startup: push schema (if DB doesn't exist it creates it), then run server
CMD npx prisma db push --skip-generate --accept-data-loss 2>/dev/null; npx prisma generate && tsx server.ts
