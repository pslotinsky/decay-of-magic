# ================================
# 🔍 Stage: Prune
# ================================
FROM node:24-alpine AS pruner
RUN npm install -g turbo@2
WORKDIR /app
COPY . .
RUN turbo prune citizen --docker

# ================================
# 📦 Stage: Install
# ================================
FROM node:24-alpine AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json

# Copy Prisma schema before npm ci so postinstall (prisma generate) can run
COPY --from=pruner /app/out/full/realms/citizen/prisma ./realms/citizen/prisma
COPY --from=pruner /app/out/full/realms/citizen/prisma.config.ts ./realms/citizen/prisma.config.ts
COPY --from=pruner /app/out/full/realms/citizen/tsconfig*.json ./realms/citizen/

RUN npm ci

# Build internal deps used at compile and runtime
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=pruner /app/out/full/packages/api-contract ./packages/api-contract
COPY --from=pruner /app/out/full/packages/core ./packages/core
RUN npm run build -w packages/api-contract -w packages/core

# ================================
# 🔨 Stage: Builder
# Used for production build and as migration runner
# ================================
FROM installer AS builder
WORKDIR /app
COPY --from=pruner /app/out/full/realms/citizen/src ./realms/citizen/src

WORKDIR /app/realms/citizen
RUN npm run build

# ================================
# 🚀 Stage: Development
# Source is volume-mounted by docker-compose
# ================================
FROM node:24-alpine AS dev
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/realms/citizen/node_modules ./realms/citizen/node_modules
COPY --from=installer /app/packages/api-contract/dist ./packages/api-contract/dist
COPY --from=installer /app/packages/api-contract/package.json ./packages/api-contract/
COPY --from=installer /app/packages/core/dist ./packages/core/dist
COPY --from=installer /app/packages/core/package.json ./packages/core/
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=installer /app/realms/citizen/package.json ./realms/citizen/
COPY --from=installer /app/realms/citizen/tsconfig*.json ./realms/citizen/
COPY --from=installer /app/realms/citizen/prisma/generated ./realms/citizen/prisma/generated

WORKDIR /app/realms/citizen
CMD ["npm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:24-alpine AS prod
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/realms/citizen/node_modules ./realms/citizen/node_modules
COPY --from=builder /app/packages/api-contract/dist ./packages/api-contract/dist
COPY --from=builder /app/packages/api-contract/package.json ./packages/api-contract/
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/core/package.json ./packages/core/
COPY --from=builder /app/realms/citizen/dist ./realms/citizen/dist
COPY --from=builder /app/realms/citizen/package.json ./realms/citizen/

WORKDIR /app/realms/citizen
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3003
CMD ["npm", "run", "start:prod"]
