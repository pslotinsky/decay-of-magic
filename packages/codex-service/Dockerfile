# ================================
# 👷 Stage: Build
# ================================
FROM node:22-alpine as build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

RUN npm ci

RUN npm run prisma:generate
RUN npm run build

# ================================
# 👷 Stage: Production build
# ================================
FROM node:22-alpine as prod_build

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/tsconfig*.json ./tsconfig.json
COPY --from=build /app/package*.json ./package.json
COPY --from=build /app/node_modules ./node_modules

RUN npm prune --production

# ================================
# 🚀 Stage: Development
# ================================
FROM node:22-alpine as dev

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/tsconfig.json ./tsconfig.json

CMD ["npm", "run", "start:debug"]

# ================================
# 🚀 Stage: Production
# ================================
FROM node:22-alpine as prod

WORKDIR /app

COPY --from=prod_build /app/dist ./dist
COPY --from=prod_build /app/tsconfig*.json ./tsconfig.json
COPY --from=prod_build /app/package*.json ./package.json
COPY --from=prod_build /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
