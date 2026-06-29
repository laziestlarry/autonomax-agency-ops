FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Install OpenSSL dev for Prisma native engine detection
RUN apt-get update -qq && \
    apt-get install -y -qq openssl libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*

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
FROM node:20-bookworm-slim
WORKDIR /app

# Install OpenSSL for Prisma native engine
RUN apt-get update -qq && \
    apt-get install -y -qq openssl libssl-dev ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Create data directory for SQLite volume mount
RUN mkdir -p /data

# Copy built frontend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Copy all node_modules (includes tsx in devDeps for runtime)
COPY --from=builder /app/node_modules ./node_modules

# Symlink tsx so `tsx server.ts` works directly (no npx needed)
RUN ln -sf /app/node_modules/.bin/tsx /usr/local/bin/tsx

# Copy server source — tsx compiles TypeScript at runtime
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/ops ./ops
COPY --from=builder /app/prisma ./prisma

# Set database path to persist on volume
ENV DATABASE_URL="file:/data/prod.db"
# Let Prisma skip OpenSSL version check in production
ENV PRISMA_ENGINES_CHECK_SKIP_OPENSSL=1

EXPOSE 3001

# On startup: push schema (if DB doesn't exist it creates it), then run server via tsx
CMD npx prisma db push --skip-generate --accept-data-loss 2>/dev/null && tsx server.ts
