# ================================
# 👷 Stage: Build
# ================================
FROM node:24-alpine AS build

WORKDIR /app

# Monorepo root
COPY package*.json ./

# All workspace package.json files (needed for correct npm hoisting)
COPY packages/zok/package.json ./packages/zok/
COPY packages/poe/package.json ./packages/poe/
COPY apps/council-web/package.json ./apps/council-web/
COPY services/vault-service/package.json ./services/vault-service/
COPY services/gateway-service/package.json ./services/gateway-service/
COPY services/codex-service/package*.json ./services/codex-service/

# @dod/config (full source needed at build time)
COPY packages/config ./packages/config

# @dod/core
COPY packages/core ./packages/core
COPY services/codex-service/tsconfig*.json ./services/codex-service/
COPY services/codex-service/prisma.config.ts ./services/codex-service/
COPY services/codex-service/src ./services/codex-service/src

RUN npm ci

RUN cd packages/core && npm run build

WORKDIR /app/services/codex-service

RUN npm run prisma:generate
RUN npm run build

# ================================
# 👷 Stage: Production build
# ================================
FROM node:24-alpine AS prod_build

WORKDIR /app

COPY --from=build /app/packages/config ./packages/config
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/core/dist ./packages/core/dist
COPY --from=build /app/packages/core/package.json ./packages/core/
COPY --from=build /app/services/codex-service/dist ./services/codex-service/dist
COPY --from=build /app/services/codex-service/package*.json ./services/codex-service/
COPY --from=build /app/services/codex-service/tsconfig*.json ./services/codex-service/

WORKDIR /app/services/codex-service

RUN npm prune --production

# ================================
# 🚀 Stage: Development
# ================================
FROM node:24-alpine AS dev

WORKDIR /app

COPY --from=build /app/packages/config ./packages/config
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/services/codex-service/node_modules ./services/codex-service/node_modules
COPY --from=build /app/packages/core/dist ./packages/core/dist
COPY --from=build /app/packages/core/package.json ./packages/core/
COPY --from=build /app/services/codex-service/dist ./services/codex-service/dist
COPY --from=build /app/services/codex-service/package.json ./services/codex-service/
COPY --from=build /app/services/codex-service/tsconfig*.json ./services/codex-service/

WORKDIR /app/services/codex-service

CMD ["npm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:24-alpine AS prod

WORKDIR /app

COPY --from=prod_build /app/node_modules ./node_modules
COPY --from=prod_build /app/packages/core/dist ./packages/core/dist
COPY --from=prod_build /app/packages/core/package.json ./packages/core/
COPY --from=prod_build /app/services/codex-service/dist ./services/codex-service/dist
COPY --from=prod_build /app/services/codex-service/package*.json ./services/codex-service/

WORKDIR /app/services/codex-service

ENV NODE_ENV=production
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
