# syntax=docker/dockerfile:1.7
#
# Unified realm image. Build args:
#   REALM         — realm name (citizen, codex, universe, gateway, vault)
#   WITH_PRISMA   — "true" for realms with Prisma (citizen, codex, universe)
#   PORT          — realm port (for EXPOSE; compose still publishes explicitly)

ARG REALM
ARG WITH_PRISMA=false
ARG PORT

# ================================
# 🔍 Stage: Prune
# ================================
FROM node:26-alpine AS pruner
ARG REALM
RUN npm install -g turbo@2
WORKDIR /app
COPY . .
RUN turbo prune ${REALM} --docker

# ================================
# 📦 Stage: Installer base
# Workspace skeleton + lockfile fetch; realm install is deferred so the
# prisma/no-prisma branches can each control whether the schema is present.
# ================================
FROM node:26-alpine AS installer-base
ARG REALM
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN npm install -g pnpm@10.33.0
WORKDIR /app

COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm fetch --frozen-lockfile

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/full/realms/${REALM}/tsconfig*.json ./realms/${REALM}/

# ================================
# 📦 Stage: Install (prisma realms)
# Schema must be present before pnpm install so the postinstall
# `prisma generate` hook can run.
# ================================
FROM installer-base AS installer-prisma-true
ARG REALM
COPY --from=pruner /app/out/full/realms/${REALM}/prisma ./realms/${REALM}/prisma
COPY --from=pruner /app/out/full/realms/${REALM}/prisma.config.ts ./realms/${REALM}/prisma.config.ts
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --offline

# ================================
# 📦 Stage: Install (non-prisma realms)
# ================================
FROM installer-base AS installer-prisma-false
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --offline

# ================================
# 📦 Stage: Installer
# Pick the prisma/no-prisma branch by WITH_PRISMA, then build internal
# packages used at compile and runtime.
# ================================
ARG WITH_PRISMA
FROM installer-prisma-${WITH_PRISMA} AS installer
COPY --from=pruner /app/packages/config ./packages/config
COPY --from=pruner /app/out/full/packages/api-contract ./packages/api-contract
COPY --from=pruner /app/out/full/packages/core ./packages/core
RUN pnpm --filter @dod/api-contract --filter @dod/core run build

# ================================
# 🔨 Stage: Builder
# Used for production build and as migration runner.
# ================================
FROM installer AS builder
ARG REALM
COPY --from=pruner /app/out/full/realms/${REALM}/src ./realms/${REALM}/src
WORKDIR /app/realms/${REALM}
RUN pnpm run build

# ================================
# 🚀 Stage: Development
# Source is volume-mounted by docker-compose.
# ================================
FROM node:26-alpine AS dev
ARG REALM
ARG PORT
RUN npm install -g pnpm@10.33.0
WORKDIR /app

COPY --from=installer /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/realms/${REALM}/ ./realms/${REALM}/
COPY --from=installer /app/packages/api-contract/dist ./packages/api-contract/dist
COPY --from=installer /app/packages/api-contract/node_modules ./packages/api-contract/node_modules
COPY --from=installer /app/packages/api-contract/package.json ./packages/api-contract/
COPY --from=installer /app/packages/core/dist ./packages/core/dist
COPY --from=installer /app/packages/core/node_modules ./packages/core/node_modules
COPY --from=installer /app/packages/core/package.json ./packages/core/
COPY --from=pruner /app/packages/config ./packages/config

WORKDIR /app/realms/${REALM}
EXPOSE ${PORT}
CMD ["pnpm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:26-alpine AS prod
ARG REALM
ARG PORT
RUN npm install -g pnpm@10.33.0
WORKDIR /app

COPY --from=builder --chown=node:node /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/realms/${REALM}/node_modules ./realms/${REALM}/node_modules
COPY --from=builder --chown=node:node /app/realms/${REALM}/dist ./realms/${REALM}/dist
COPY --from=builder --chown=node:node /app/realms/${REALM}/package.json ./realms/${REALM}/
COPY --from=builder --chown=node:node /app/packages/api-contract/dist ./packages/api-contract/dist
COPY --from=builder --chown=node:node /app/packages/api-contract/node_modules ./packages/api-contract/node_modules
COPY --from=builder --chown=node:node /app/packages/api-contract/package.json ./packages/api-contract/
COPY --from=builder --chown=node:node /app/packages/core/dist ./packages/core/dist
COPY --from=builder --chown=node:node /app/packages/core/node_modules ./packages/core/node_modules
COPY --from=builder --chown=node:node /app/packages/core/package.json ./packages/core/

WORKDIR /app/realms/${REALM}

USER node
ENV NODE_ENV=production
EXPOSE ${PORT}
CMD ["pnpm", "run", "start:prod"]
