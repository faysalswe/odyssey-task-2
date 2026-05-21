FROM node:22-slim AS builder
WORKDIR /app
# python3 + make + g++ satisfy mediasoup's build-from-source fallback;
# on Debian the prebuilt glibc binary usually runs without recompiling.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY src ./src

FROM node:22-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "src/index.js"]
