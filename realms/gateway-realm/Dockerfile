# ================================
# 🔍 Stage: Prune
# ================================
FROM node:24-alpine AS pruner
RUN npm install -g turbo@2
WORKDIR /app
COPY . .
RUN turbo prune gateway-realm --docker

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
COPY --from=pruner /app/out/full/realms/gateway-realm/tsconfig*.json ./realms/gateway-realm/
COPY --from=pruner /app/out/full/realms/gateway-realm/src ./realms/gateway-realm/src

WORKDIR /app/realms/gateway-realm
RUN npm run build

# ================================
# 🚀 Stage: Development
# Source is volume-mounted by docker-compose
# ================================
FROM node:24-alpine AS dev
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/realms/gateway-realm/node_modules ./realms/gateway-realm/node_modules
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=installer /app/realms/gateway-realm/package.json ./realms/gateway-realm/
COPY --from=pruner /app/out/full/realms/gateway-realm/tsconfig*.json ./realms/gateway-realm/

WORKDIR /app/realms/gateway-realm
CMD ["npm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:24-alpine AS prod
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/realms/gateway-realm/node_modules ./realms/gateway-realm/node_modules
COPY --from=builder /app/realms/gateway-realm/dist ./realms/gateway-realm/dist
COPY --from=builder /app/realms/gateway-realm/package.json ./realms/gateway-realm/

WORKDIR /app/realms/gateway-realm
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
