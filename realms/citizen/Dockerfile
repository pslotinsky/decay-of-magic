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
RUN npm ci

# ================================
# 🔨 Stage: Builder
# ================================
FROM installer AS builder
WORKDIR /app
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=pruner /app/out/full/realms/citizen/tsconfig*.json ./realms/citizen/
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
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=installer /app/realms/citizen/package.json ./realms/citizen/
COPY --from=pruner /app/out/full/realms/citizen/tsconfig*.json ./realms/citizen/

WORKDIR /app/realms/citizen
CMD ["npm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:24-alpine AS prod
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/realms/citizen/node_modules ./realms/citizen/node_modules
COPY --from=builder /app/realms/citizen/dist ./realms/citizen/dist
COPY --from=builder /app/realms/citizen/package.json ./realms/citizen/

WORKDIR /app/realms/citizen
RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3003
CMD ["npm", "run", "start:prod"]
