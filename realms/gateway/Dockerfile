# ================================
# 🔍 Stage: Prune
# ================================
FROM node:26-alpine AS pruner
RUN npm install -g turbo@2
WORKDIR /app
COPY . .
RUN turbo prune gateway --docker

# ================================
# 📦 Stage: Install
# ================================
FROM node:26-alpine AS installer
RUN corepack enable
WORKDIR /app

# Fetch dependencies — keyed only on the lockfile, so this layer survives package.json edits
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm fetch --frozen-lockfile

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile --offline

# Build internal deps used at compile and runtime
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=pruner /app/out/full/packages/api-contract ./packages/api-contract
COPY --from=pruner /app/out/full/packages/core ./packages/core
RUN pnpm --filter @dod/api-contract --filter @dod/core run build

# ================================
# 🔨 Stage: Builder
# ================================
FROM installer AS builder
WORKDIR /app
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=pruner /app/out/full/realms/gateway/tsconfig*.json ./realms/gateway/
COPY --from=pruner /app/out/full/realms/gateway/src ./realms/gateway/src

WORKDIR /app/realms/gateway
RUN pnpm run build

# ================================
# 🚀 Stage: Development
# Source is volume-mounted by docker-compose
# ================================
FROM node:26-alpine AS dev
RUN corepack enable
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
CMD ["pnpm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:26-alpine AS prod
RUN corepack enable
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
RUN pnpm prune --prod

ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "run", "start:prod"]
