# ================================
# 🔍 Stage: Prune
# ================================
FROM node:24-alpine AS pruner
RUN npm install -g turbo@2
WORKDIR /app
COPY . .
RUN turbo prune gateway-service --docker

# ================================
# 📦 Stage: Install
# ================================
FROM node:24-alpine AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci

# ================================
# 🔨 Stage: Builder
# ================================
FROM installer AS builder
WORKDIR /app
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=pruner /app/out/full/services/gateway-service/tsconfig*.json ./services/gateway-service/
COPY --from=pruner /app/out/full/services/gateway-service/src ./services/gateway-service/src

WORKDIR /app/services/gateway-service
RUN npm run build

# ================================
# 🚀 Stage: Development
# Source is volume-mounted by docker-compose
# ================================
FROM node:24-alpine AS dev
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/services/gateway-service/node_modules ./services/gateway-service/node_modules
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=installer /app/services/gateway-service/package.json ./services/gateway-service/
COPY --from=pruner /app/out/full/services/gateway-service/tsconfig*.json ./services/gateway-service/

WORKDIR /app/services/gateway-service
CMD ["npm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:24-alpine AS prod
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/gateway-service/node_modules ./services/gateway-service/node_modules
COPY --from=builder /app/services/gateway-service/dist ./services/gateway-service/dist
COPY --from=builder /app/services/gateway-service/package.json ./services/gateway-service/

WORKDIR /app/services/gateway-service
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
