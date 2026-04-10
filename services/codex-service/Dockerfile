# ================================
# 🔍 Stage: Prune
# ================================
FROM node:24-alpine AS pruner
RUN npm install -g turbo@2
WORKDIR /app
COPY . .
RUN turbo prune codex-service --docker

# ================================
# 📦 Stage: Install
# ================================
FROM node:24-alpine AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci

# Build @dod/core (internal dep used at compile and runtime)
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=pruner /app/out/full/packages/core ./packages/core
RUN npm run build -w packages/core

# Generate Prisma client (schema + config needed, not full src)
COPY --from=pruner /app/out/full/services/codex-service/src/infrastructure/prisma ./services/codex-service/src/infrastructure/prisma
COPY --from=pruner /app/out/full/services/codex-service/prisma.config.ts ./services/codex-service/prisma.config.ts
COPY --from=pruner /app/out/full/services/codex-service/tsconfig*.json ./services/codex-service/

WORKDIR /app/services/codex-service
RUN npm run prisma:generate

# ================================
# 🔨 Stage: Builder
# Used for production build and as migration runner
# ================================
FROM installer AS builder
WORKDIR /app
COPY --from=pruner /app/out/full/services/codex-service/src ./services/codex-service/src

WORKDIR /app/services/codex-service
RUN npm run build

# ================================
# 🚀 Stage: Development
# Source is volume-mounted by docker-compose
# ================================
FROM node:24-alpine AS dev
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/services/codex-service/node_modules ./services/codex-service/node_modules
COPY --from=installer /app/packages/core/dist ./packages/core/dist
COPY --from=installer /app/packages/core/package.json ./packages/core/
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=installer /app/services/codex-service/package.json ./services/codex-service/
COPY --from=installer /app/services/codex-service/tsconfig*.json ./services/codex-service/

WORKDIR /app/services/codex-service
CMD ["npm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:24-alpine AS prod
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/codex-service/node_modules ./services/codex-service/node_modules
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/core/package.json ./packages/core/
COPY --from=builder /app/services/codex-service/dist ./services/codex-service/dist
COPY --from=builder /app/services/codex-service/package.json ./services/codex-service/

WORKDIR /app/services/codex-service
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
