# ================================
# 👷 Stage: Build
# ================================
FROM node:24-alpine AS build

WORKDIR /app

# Monorepo root
COPY package*.json ./

# Workspace package.json stubs (required for npm ci at root)
COPY packages/config/package.json ./packages/config/
COPY packages/core/package.json ./packages/core/
COPY packages/zok/package.json ./packages/zok/
COPY packages/poe/package.json ./packages/poe/
COPY apps/council-web/package.json ./apps/council-web/
COPY services/codex-service/package.json ./services/codex-service/
COPY services/vault-service/package.json ./services/vault-service/

# @dod/config tsconfig files needed for build
COPY packages/config/tsconfig ./packages/config/tsconfig

# gateway-service
COPY services/gateway-service/package.json ./services/gateway-service/
COPY services/gateway-service/tsconfig*.json ./services/gateway-service/
COPY services/gateway-service/src ./services/gateway-service/src

RUN npm ci

WORKDIR /app/services/gateway-service

RUN npm run build

# ================================
# 👷 Stage: Production build
# ================================
FROM node:24-alpine AS prod_build

WORKDIR /app

COPY --from=build /app/packages/config/tsconfig ./packages/config/tsconfig
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/gateway-service/dist ./services/gateway-service/dist
COPY --from=build /app/services/gateway-service/package*.json ./services/gateway-service/
COPY --from=build /app/services/gateway-service/tsconfig*.json ./services/gateway-service/

WORKDIR /app/services/gateway-service

RUN npm prune --production

# ================================
# 🚀 Stage: Development
# ================================
FROM node:24-alpine AS dev

WORKDIR /app

COPY --from=build /app/packages/config/tsconfig ./packages/config/tsconfig
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/gateway-service/node_modules ./services/gateway-service/node_modules
COPY --from=build /app/services/gateway-service/dist ./services/gateway-service/dist
COPY --from=build /app/services/gateway-service/package.json ./services/gateway-service/
COPY --from=build /app/services/gateway-service/tsconfig*.json ./services/gateway-service/

WORKDIR /app/services/gateway-service

CMD ["npm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:24-alpine AS prod

WORKDIR /app

COPY --from=prod_build /app/node_modules ./node_modules
COPY --from=prod_build /app/services/gateway-service/dist ./services/gateway-service/dist
COPY --from=prod_build /app/services/gateway-service/package*.json ./services/gateway-service/

WORKDIR /app/services/gateway-service

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
