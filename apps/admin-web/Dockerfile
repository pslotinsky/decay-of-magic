# ================================
# 👷 Stage: Static
# ================================
FROM node:22-alpine as static

WORKDIR /app

COPY ./ .

RUN npm ci
RUN npm run build

# ================================
# 🚀 Stage: Development
# ================================
FROM node:22-alpine as dev

WORKDIR /app

COPY ./ .

RUN npm ci

EXPOSE 4001
CMD ["npm", "run", "dev"]
