# ================================
# 🔍 Stage: Prune
# ================================
FROM node:24-alpine AS pruner
RUN npm install -g turbo@2
WORKDIR /app
COPY . .
RUN turbo prune council-web --docker

# ================================
# 📦 Stage: Install
# ================================
FROM node:24-alpine AS installer
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/package-lock.json ./package-lock.json
RUN npm ci

# ================================
# 🚀 Stage: Development
# src is volume-mounted by docker-compose
# ================================
FROM node:24-alpine AS dev
WORKDIR /app

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/council-web/node_modules ./apps/council-web/node_modules
COPY --from=pruner /app/packages/config ./packages/config
# Copy all app config files (vite.config.ts, tsconfig*, index.html, etc.)
COPY --from=pruner /app/out/full/apps/council-web ./apps/council-web

WORKDIR /app/apps/council-web
EXPOSE 5175
CMD ["npm", "run", "dev"]

# ================================
# 🔨 Stage: Static build
# ================================
FROM installer AS builder
WORKDIR /app
COPY --from=pruner /app/out/full/apps/council-web ./apps/council-web

WORKDIR /app/apps/council-web
RUN npm run build

# Expose dist for use by a web server
FROM node:24-alpine AS static
WORKDIR /app/apps/council-web
COPY --from=builder /app/apps/council-web/dist ./dist
