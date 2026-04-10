# ================================
# 👷 Stage: Static
# ================================
FROM node:24-alpine AS static

WORKDIR /app

# Monorepo root
COPY package*.json ./

# Workspace package.json stubs (required for npm ci at root)
COPY packages/config/package.json ./packages/config/
COPY packages/core/package.json ./packages/core/
COPY packages/zok/package.json ./packages/zok/
COPY packages/poe/package.json ./packages/poe/
COPY services/codex-service/package.json ./services/codex-service/
COPY services/vault-service/package.json ./services/vault-service/
COPY services/gateway-service/package.json ./services/gateway-service/

# @dod/config tsconfig files needed for build
COPY packages/config/tsconfig ./packages/config/tsconfig

# council-web
COPY apps/council-web/package.json ./apps/council-web/
COPY apps/council-web/ ./apps/council-web/

RUN npm ci

WORKDIR /app/apps/council-web

RUN npm run build

# ================================
# 🚀 Stage: Development
# ================================
FROM node:24-alpine AS dev

WORKDIR /app

# Monorepo root
COPY package*.json ./

# Workspace package.json stubs (required for npm ci at root)
COPY packages/config/package.json ./packages/config/
COPY packages/core/package.json ./packages/core/
COPY packages/zok/package.json ./packages/zok/
COPY packages/poe/package.json ./packages/poe/
COPY services/codex-service/package.json ./services/codex-service/
COPY services/vault-service/package.json ./services/vault-service/
COPY services/gateway-service/package.json ./services/gateway-service/

# @dod/config tsconfig files needed for dev
COPY packages/config/tsconfig ./packages/config/tsconfig

# council-web
COPY apps/council-web/package.json ./apps/council-web/
COPY apps/council-web/ ./apps/council-web/

RUN npm ci

WORKDIR /app/apps/council-web

EXPOSE 5175
CMD ["npm", "run", "dev"]
