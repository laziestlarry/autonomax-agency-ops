FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build frontend
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

# Production image
FROM node:20-alpine
WORKDIR /app

# Copy all needed files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.server.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/vite.config.ts ./

EXPOSE 3001

# Uses tsx for runtime transpilation — works with any Node version
CMD ["npm", "run", "start"]
