FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Dependências do sistema
RUN apt-get update -y && apt-get install -y --no-install-recommends \
  openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Instalar dependências (com dev) para build
COPY package*.json ./
RUN npm ci

# Prisma generate (precisa schema para client)
COPY prisma ./prisma
RUN npx prisma generate

# Copiar código e build do Nest
COPY tsconfig*.json ./
COPY src ./src
COPY nest-cli.json ./
RUN npm run build

# Remover dependências de dev mantendo node_modules atual
RUN npm prune --omit=dev

# --------------------------
# Runtime
FROM node:20-bullseye-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
  PORT=3001

RUN addgroup --system nodejs && adduser --system --ingroup nodejs nodeusr

# Copiar artefatos do build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

USER nodeusr

EXPOSE 3001

CMD ["node", "dist/main.js"]
