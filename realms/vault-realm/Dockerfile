# ================================
# 🔍 Stage: Prune
# ================================
FROM node:24-alpine AS pruner
RUN npm install -g turbo@2
WORKDIR /app
COPY . .
RUN turbo prune vault-realm --docker

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
COPY --from=pruner /app/out/full/realms/vault-realm/tsconfig*.json ./realms/vault-realm/
COPY --from=pruner /app/out/full/realms/vault-realm/src ./realms/vault-realm/src

WORKDIR /app/realms/vault-realm
RUN npm run build

# ================================
# 🚀 Stage: Development
# Source is volume-mounted by docker-compose
# ================================
FROM node:24-alpine AS dev
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/realms/vault-realm/node_modules ./realms/vault-realm/node_modules
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=installer /app/realms/vault-realm/package.json ./realms/vault-realm/
COPY --from=pruner /app/out/full/realms/vault-realm/tsconfig*.json ./realms/vault-realm/

WORKDIR /app/realms/vault-realm
CMD ["npm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:24-alpine AS prod
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/realms/vault-realm/node_modules ./realms/vault-realm/node_modules
COPY --from=builder /app/realms/vault-realm/dist ./realms/vault-realm/dist
COPY --from=builder /app/realms/vault-realm/package.json ./realms/vault-realm/

WORKDIR /app/realms/vault-realm
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3002
CMD ["npm", "run", "start:prod"]
