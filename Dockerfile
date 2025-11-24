# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar apenas package files primeiro
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

# Build
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm ci --omit=dev

# Gerar Prisma Client em produção
RUN npx prisma generate

# Copiar apenas o build (não node_modules do builder)
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main.js"]
