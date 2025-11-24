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

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_URL="postgresql://plano_admin:senhaplanomestre2025@plano-mestre-db.clsckuw6gvkn.sa-east-1.rds.amazonaws.com:5432/plano_mestre_db?schema=public"
ENV JWT_SECRET=seu_jwt_secret_super_seguro_aqui_2025
ENV CORS_ORIGIN=https://plano-mestre-frontend.vercel.app
ENV API_URL=https://plano-mestre-api.duckdns.org

EXPOSE 3001

CMD ["node", "dist/main.js"]
