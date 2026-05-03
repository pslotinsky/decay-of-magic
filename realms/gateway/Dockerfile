# ================================
# 🔍 Stage: Prune
# ================================
FROM node:25-alpine AS pruner
RUN npm install -g turbo@2
WORKDIR /app
COPY . .
RUN turbo prune gateway --docker

# ================================
# 📦 Stage: Install
# ================================
FROM node:25-alpine AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci

# Build internal deps used at compile and runtime
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=pruner /app/out/full/packages/api-contract ./packages/api-contract
COPY --from=pruner /app/out/full/packages/core ./packages/core
RUN npm run build -w packages/api-contract -w packages/core

# ================================
# 🔨 Stage: Builder
# ================================
FROM installer AS builder
WORKDIR /app
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=pruner /app/out/full/realms/gateway/tsconfig*.json ./realms/gateway/
COPY --from=pruner /app/out/full/realms/gateway/src ./realms/gateway/src

WORKDIR /app/realms/gateway
RUN npm run build

# ================================
# 🚀 Stage: Development
# Source is volume-mounted by docker-compose
# ================================
FROM node:25-alpine AS dev
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/realms/gateway/node_modules ./realms/gateway/node_modules
COPY --from=installer /app/packages/api-contract/dist ./packages/api-contract/dist
COPY --from=installer /app/packages/api-contract/package.json ./packages/api-contract/
COPY --from=installer /app/packages/core/dist ./packages/core/dist
COPY --from=installer /app/packages/core/package.json ./packages/core/
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=installer /app/realms/gateway/package.json ./realms/gateway/
COPY --from=pruner /app/out/full/realms/gateway/tsconfig*.json ./realms/gateway/

WORKDIR /app/realms/gateway
CMD ["npm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:25-alpine AS prod
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/realms/gateway/node_modules ./realms/gateway/node_modules
COPY --from=builder /app/packages/api-contract/dist ./packages/api-contract/dist
COPY --from=builder /app/packages/api-contract/package.json ./packages/api-contract/
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/core/package.json ./packages/core/
COPY --from=builder /app/realms/gateway/dist ./realms/gateway/dist
COPY --from=builder /app/realms/gateway/package.json ./realms/gateway/

WORKDIR /app/realms/gateway
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
