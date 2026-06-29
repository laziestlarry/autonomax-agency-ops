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

# Compile server TypeScript to CommonJS JavaScript for production runtime
# (package.json has "type":"module" so .cjs extension avoids ESM/CommonJS conflict)
RUN npx tsc -p tsconfig.server.json --outDir dist-server && mv dist-server/server.js dist-server/server.cjs

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
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist-server ./dist-server
COPY --from=builder /app/ops ./ops
COPY --from=builder /app/prisma ./prisma

# Set database path to persist on volume
ENV DATABASE_URL="file:/data/prod.db"
# Let Prisma skip OpenSSL version check in production
ENV PRISMA_ENGINES_CHECK_SKIP_OPENSSL=1

EXPOSE 3001

# On startup: push schema (if DB doesn't exist it creates it), then run compiled server
CMD npx prisma db push --skip-generate --accept-data-loss 2>/dev/null; node dist-server/server.cjs
