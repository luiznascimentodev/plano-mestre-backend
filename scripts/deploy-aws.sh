#!/bin/bash
set -e

echo "🚀 Iniciando deploy completo do Plano Mestre Backend..."
echo ""

# Variáveis
REMOTE_USER="ubuntu"
REMOTE_HOST="52.67.75.255"
REMOTE_DIR="/opt/plano-mestre-backend"
KEY_PATH="C:/Users/luife/Documents/aws-keys/plano-mestre-key.pem"

echo "📦 1. Preparando arquivos locais..."
npm run build

echo ""
echo "📤 2. Enviando arquivos para o servidor..."
rsync -avz --delete \
  -e "ssh -i $KEY_PATH -o StrictHostKeyChecking=no" \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'dist' \
  --exclude '.env' \
  ./ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/

echo ""
echo "📤 3. Enviando .env de produção..."
scp -i "$KEY_PATH" -o StrictHostKeyChecking=no \
  .env.production ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/.env

echo ""
echo "🔧 4. Instalando dependências e configurando no servidor..."
ssh -i "$KEY_PATH" -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'
cd /opt/plano-mestre-backend

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --only=production

# Gerar Prisma Client
echo "🔧 Gerando Prisma Client..."
npx prisma generate

# Executar migrations
echo "🗄️ Executando migrations do banco..."
npx prisma migrate deploy

# Parar containers antigos
echo "🛑 Parando containers antigos..."
docker-compose down 2>/dev/null || true

# Build e start dos containers
echo "🐳 Construindo e iniciando containers..."
docker-compose up -d --build

# Aguardar serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 10

# Verificar status
echo "📊 Status dos containers:"
docker-compose ps

# Verificar logs
echo ""
echo "📋 Últimos logs da aplicação:"
docker-compose logs --tail=50 app

ENDSSH

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🌐 Acessos:"
echo "  - API: https://plano-mestre-api.duckdns.org"
echo "  - Frontend: https://plano-mestre-frontend.vercel.app"
echo ""
echo "📊 Para ver logs em tempo real:"
echo "  ssh -i \"$KEY_PATH\" ${REMOTE_USER}@${REMOTE_HOST} \"cd ${REMOTE_DIR} && docker-compose logs -f\""
