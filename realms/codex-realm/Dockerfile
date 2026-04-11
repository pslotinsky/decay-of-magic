# ================================
# 🔍 Stage: Prune
# ================================
FROM node:24-alpine AS pruner
RUN npm install -g turbo@2
WORKDIR /app
COPY . .
RUN turbo prune codex-realm --docker

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
COPY --from=pruner /app/out/full/realms/codex-realm/src/ground/prisma ./realms/codex-realm/src/ground/prisma
COPY --from=pruner /app/out/full/realms/codex-realm/prisma.config.ts ./realms/codex-realm/prisma.config.ts
COPY --from=pruner /app/out/full/realms/codex-realm/tsconfig*.json ./realms/codex-realm/

WORKDIR /app/realms/codex-realm
RUN npm run prisma:generate

# ================================
# 🔨 Stage: Builder
# Used for production build and as migration runner
# ================================
FROM installer AS builder
WORKDIR /app
COPY --from=pruner /app/out/full/realms/codex-realm/src ./realms/codex-realm/src

WORKDIR /app/realms/codex-realm
RUN npm run build

# ================================
# 🚀 Stage: Development
# Source is volume-mounted by docker-compose
# ================================
FROM node:24-alpine AS dev
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/realms/codex-realm/node_modules ./realms/codex-realm/node_modules
COPY --from=installer /app/packages/core/dist ./packages/core/dist
COPY --from=installer /app/packages/core/package.json ./packages/core/
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=installer /app/realms/codex-realm/package.json ./realms/codex-realm/
COPY --from=installer /app/realms/codex-realm/tsconfig*.json ./realms/codex-realm/

WORKDIR /app/realms/codex-realm
CMD ["npm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:24-alpine AS prod
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/realms/codex-realm/node_modules ./realms/codex-realm/node_modules
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/core/package.json ./packages/core/
COPY --from=builder /app/realms/codex-realm/dist ./realms/codex-realm/dist
COPY --from=builder /app/realms/codex-realm/package.json ./realms/codex-realm/

WORKDIR /app/realms/codex-realm
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
