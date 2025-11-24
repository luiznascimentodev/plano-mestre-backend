#!/bin/bash
# Script completo para configurar o servidor Plano Mestre Backend
# Execute este script no servidor via Session Manager ou SSH

set -e

echo "=================================="
echo "PLANO MESTRE - CONFIGURAÇÃO COMPLETA"
echo "=================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variáveis
APP_DIR="/opt/plano-mestre-backend"
DB_HOST="plano-mestre-db.clsckuw6gvkn.sa-east-1.rds.amazonaws.com"
DB_PORT="5432"
DB_NAME="plano_mestre_db"
DB_USER="plano_admin"
DB_PASS="senhaplanomestre2025"

echo -e "${YELLOW}1. Atualizando sistema e instalando dependências...${NC}"
sudo apt-get update -qq
sudo apt-get install -y \
    docker.io \
    docker-compose \
    nginx \
    certbot \
    python3-certbot-nginx \
    postgresql-client \
    curl \
    git

echo -e "${GREEN}✓ Dependências instaladas${NC}"
echo ""

echo -e "${YELLOW}2. Configurando Docker...${NC}"
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu
echo -e "${GREEN}✓ Docker configurado${NC}"
echo ""

echo -e "${YELLOW}3. Criando diretório da aplicação...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R ubuntu:ubuntu $APP_DIR
cd $APP_DIR
echo -e "${GREEN}✓ Diretório criado: $APP_DIR${NC}"
echo ""

echo -e "${YELLOW}4. Testando conexão com RDS...${NC}"
if timeout 5 bash -c "cat < /dev/null > /dev/tcp/$DB_HOST/$DB_PORT"; then
    echo -e "${GREEN}✓ Conexão com RDS OK${NC}"
else
    echo -e "${RED}✗ Não foi possível conectar ao RDS${NC}"
    echo "Verifique:"
    echo "- Security Group do RDS permite conexão da instância EC2"
    echo "- Endpoint do RDS está correto"
fi
echo ""

echo -e "${YELLOW}5. Criando arquivo .env...${NC}"
cat > $APP_DIR/.env << 'EOF'
# Produção - AWS RDS
DATABASE_URL="postgresql://plano_admin:senhaplanomestre2025@plano-mestre-db.clsckuw6gvkn.sa-east-1.rds.amazonaws.com:5432/plano_mestre_db"

# JWT
JWT_SECRET="Segredoforte123"
JWT_REFRESH_SECRET="RefreshSegredoforte456"

# Ambiente
NODE_ENV="production"
PORT=3001
HOST="0.0.0.0"

# CORS - Frontend na Vercel
ALLOWED_ORIGINS="https://plano-mestre-frontend.vercel.app"

# Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CALLBACK_URL="https://plano-mestre-api.duckdns.org/auth/google/callback"
EOF
echo -e "${GREEN}✓ Arquivo .env criado${NC}"
echo ""

echo -e "${YELLOW}6. Instalando Node.js 20...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
node --version
npm --version
echo -e "${GREEN}✓ Node.js instalado${NC}"
echo ""

echo -e "${YELLOW}7. Criando docker-compose.yml...${NC}"
cat > $APP_DIR/docker-compose.yml << 'EOF'
version: "3.9"
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    image: plano-mestre-backend:latest
    container_name: plano-mestre-backend
    env_file:
      - .env
    ports:
      - "3001:3001"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').request({host:'127.0.0.1',port:process.env.PORT||3001,path:'/'},r=>process.exit(0)).on('error',()=>process.exit(1)).end()"]
      interval: 30s
      timeout: 5s
      retries: 5
      start_period: 20s
EOF
echo -e "${GREEN}✓ docker-compose.yml criado${NC}"
echo ""

echo -e "${YELLOW}8. Configurando Nginx...${NC}"
sudo tee /etc/nginx/sites-available/plano-mestre-api > /dev/null << 'EOF'
server {
    listen 80;
    server_name plano-mestre-api.duckdns.org;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/plano-mestre-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
echo -e "${GREEN}✓ Nginx configurado${NC}"
echo ""

echo -e "${YELLOW}9. Configurando SSL com Let's Encrypt...${NC}"
sudo certbot --nginx \
    -d plano-mestre-api.duckdns.org \
    --non-interactive \
    --agree-tos \
    --email luiznascimentodev@gmail.com \
    --redirect \
    || echo "Certbot: certificado já existe ou erro ocorreu"
echo -e "${GREEN}✓ SSL configurado${NC}"
echo ""

echo ""
echo -e "${GREEN}=================================="
echo "CONFIGURAÇÃO CONCLUÍDA!"
echo "==================================${NC}"
echo ""
echo "Próximos passos:"
echo "1. Faça upload dos arquivos do projeto para: $APP_DIR"
echo "2. Execute: cd $APP_DIR && npm ci"
echo "3. Execute: npx prisma generate"
echo "4. Execute: npx prisma migrate deploy"
echo "5. Execute: docker-compose up -d --build"
echo ""
echo "Para testar:"
echo "- Local: curl http://localhost:3001"
echo "- Remoto: curl https://plano-mestre-api.duckdns.org"
