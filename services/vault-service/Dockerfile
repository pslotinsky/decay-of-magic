# ================================
# 👷 Stage: Build
# ================================
FROM node:22-alpine AS build

WORKDIR /app

# Monorepo root
COPY package*.json ./
COPY tsconfig.base.json ./

# Workspace package.json stubs (required for npm ci at root)
COPY packages/core/package.json ./packages/core/
COPY packages/zok/package.json ./packages/zok/
COPY apps/council-web/package.json ./apps/council-web/
COPY services/codex-service/package.json ./services/codex-service/
COPY services/gateway-service/package.json ./services/gateway-service/

# vault-service
COPY services/vault-service/package.json ./services/vault-service/
COPY services/vault-service/tsconfig*.json ./services/vault-service/
COPY services/vault-service/src ./services/vault-service/src

RUN npm ci

WORKDIR /app/services/vault-service

RUN npm run build

# ================================
# 👷 Stage: Production build
# ================================
FROM node:22-alpine AS prod_build

WORKDIR /app

COPY --from=build /app/tsconfig.base.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/vault-service/dist ./services/vault-service/dist
COPY --from=build /app/services/vault-service/package*.json ./services/vault-service/
COPY --from=build /app/services/vault-service/tsconfig*.json ./services/vault-service/

WORKDIR /app/services/vault-service

RUN npm prune --production

# ================================
# 🚀 Stage: Development
# ================================
FROM node:22-alpine AS dev

WORKDIR /app

COPY --from=build /app/tsconfig.base.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/vault-service/dist ./services/vault-service/dist
COPY --from=build /app/services/vault-service/package.json ./services/vault-service/
COPY --from=build /app/services/vault-service/tsconfig*.json ./services/vault-service/

WORKDIR /app/services/vault-service

CMD ["npm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:22-alpine AS prod

WORKDIR /app

COPY --from=prod_build /app/tsconfig.base.json ./
COPY --from=prod_build /app/node_modules ./node_modules
COPY --from=prod_build /app/services/vault-service/dist ./services/vault-service/dist
COPY --from=prod_build /app/services/vault-service/package*.json ./services/vault-service/

WORKDIR /app/services/vault-service

ENV NODE_ENV=production
EXPOSE 3002
CMD ["npm", "run", "start:prod"]
