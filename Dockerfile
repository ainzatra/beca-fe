# Builder stage: install deps and build
FROM node:22-alpine AS builder
WORKDIR /app

# copy package manifests first to leverage layer caching
COPY package.json package-lock.json ./
RUN npm ci

# copy source and build
COPY . .
RUN npm run build-only

FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/dist ./dist

RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npx", "serve", "-s", "/app/dist"]