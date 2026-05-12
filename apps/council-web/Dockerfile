# ================================
# 🔍 Stage: Prune
# ================================
FROM node:26-alpine AS pruner
RUN npm install -g turbo@2
WORKDIR /app
COPY . .
RUN turbo prune council-web --docker

# ================================
# 📦 Stage: Install
# ================================
FROM node:26-alpine AS installer
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN npm install -g pnpm@10.33.0
WORKDIR /app

# Fetch dependencies — keyed only on the lockfile, so this layer survives package.json edits
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm fetch --frozen-lockfile

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --offline

# Build @dod/api-contract (consumed by the web app)
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=pruner /app/out/full/packages/api-contract ./packages/api-contract
RUN pnpm --filter @dod/api-contract run build

# ================================
# 🚀 Stage: Development
# src is volume-mounted by docker-compose
# ================================
FROM node:26-alpine AS dev
RUN npm install -g pnpm@10.33.0
WORKDIR /app

COPY --from=installer /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/council-web/node_modules ./apps/council-web/node_modules
COPY --from=installer /app/packages/api-contract/dist ./packages/api-contract/dist
COPY --from=installer /app/packages/api-contract/node_modules ./packages/api-contract/node_modules
COPY --from=installer /app/packages/api-contract/package.json ./packages/api-contract/
COPY --from=pruner /app/packages/config ./packages/config
# Copy all app config files (vite.config.ts, tsconfig*, index.html, etc.)
COPY --from=pruner /app/out/full/apps/council-web ./apps/council-web

WORKDIR /app/apps/council-web
EXPOSE 5175
CMD ["pnpm", "run", "dev"]

# ================================
# 🔨 Stage: Static build
# ================================
FROM installer AS builder
WORKDIR /app
COPY --from=pruner /app/out/full/apps/council-web ./apps/council-web

WORKDIR /app/apps/council-web
RUN pnpm run build

# Expose dist for use by a web server
FROM node:26-alpine AS static
RUN npm install -g pnpm@10.33.0
WORKDIR /app/apps/council-web
COPY --from=builder /app/apps/council-web/dist ./dist
