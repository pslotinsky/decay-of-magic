# ================================
# 🔍 Stage: Prune
# ================================
FROM node:24-alpine AS pruner
RUN npm install -g turbo@2
WORKDIR /app
COPY . .
RUN turbo prune citizen-realm --docker

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
COPY --from=pruner /app/out/full/realms/citizen-realm/tsconfig*.json ./realms/citizen-realm/
COPY --from=pruner /app/out/full/realms/citizen-realm/src ./realms/citizen-realm/src

WORKDIR /app/realms/citizen-realm
RUN npm run build

# ================================
# 🚀 Stage: Development
# Source is volume-mounted by docker-compose
# ================================
FROM node:24-alpine AS dev
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/realms/citizen-realm/node_modules ./realms/citizen-realm/node_modules
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=installer /app/realms/citizen-realm/package.json ./realms/citizen-realm/
COPY --from=pruner /app/out/full/realms/citizen-realm/tsconfig*.json ./realms/citizen-realm/

WORKDIR /app/realms/citizen-realm
CMD ["npm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:24-alpine AS prod
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/realms/citizen-realm/node_modules ./realms/citizen-realm/node_modules
COPY --from=builder /app/realms/citizen-realm/dist ./realms/citizen-realm/dist
COPY --from=builder /app/realms/citizen-realm/package.json ./realms/citizen-realm/

WORKDIR /app/realms/citizen-realm
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3003
CMD ["npm", "run", "start:prod"]
