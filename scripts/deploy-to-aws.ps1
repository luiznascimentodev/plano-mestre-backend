# Deploy completo para AWS
$ErrorActionPreference = "Stop"

$KEY_PATH = "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem"
$SERVER = "ubuntu@52.67.75.255"
$REMOTE_DIR = "/opt/plano-mestre-backend"

Write-Host "🚀 DEPLOY PLANO MESTRE BACKEND PARA AWS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se .env.production existe
if (-not (Test-Path .env.production)) {
    Write-Host "❌ Arquivo .env.production não encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "📦 1. Criando pacote para deploy..." -ForegroundColor Yellow
$deployFiles = @(
    "src",
    "prisma",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "tsconfig.build.json",
    "nest-cli.json",
    "Dockerfile",
    "docker-compose.yml"
)

Write-Host "✅ Arquivos preparados" -ForegroundColor Green
Write-Host ""

Write-Host "📤 2. Enviando arquivos para o servidor..." -ForegroundColor Yellow

# Criar estrutura no servidor
ssh -i $KEY_PATH $SERVER @"
sudo mkdir -p $REMOTE_DIR
sudo chown -R ubuntu:ubuntu $REMOTE_DIR
"@

# Enviar arquivos
foreach ($item in $deployFiles) {
    if (Test-Path $item) {
        Write-Host "  📄 Enviando $item..." -ForegroundColor Gray
        scp -i $KEY_PATH -r $item ${SERVER}:${REMOTE_DIR}/
    }
}

Write-Host "  📄 Enviando .env de produção..." -ForegroundColor Gray
scp -i $KEY_PATH .env.production ${SERVER}:${REMOTE_DIR}/.env

Write-Host "✅ Arquivos enviados" -ForegroundColor Green
Write-Host ""

Write-Host "🔧 3. Configurando e iniciando aplicação..." -ForegroundColor Yellow
ssh -i $KEY_PATH $SERVER @"
set -e
cd $REMOTE_DIR

echo '📦 Instalando dependências...'
npm ci --only=production

echo '🔧 Gerando Prisma Client...'
npx prisma generate

echo '🗄️ Executando migrations...'
npx prisma migrate deploy

echo '🛑 Parando containers antigos...'
docker-compose down 2>/dev/null || true

echo '🐳 Construindo imagem Docker...'
docker-compose build

echo '🚀 Iniciando containers...'
docker-compose up -d

echo '⏳ Aguardando aplicação inicializar...'
sleep 15

echo '📊 Status dos containers:'
docker-compose ps

echo ''
echo '📋 Logs da aplicação:'
docker-compose logs --tail=50 app
"@

Write-Host "✅ Aplicação iniciada" -ForegroundColor Green
Write-Host ""

Write-Host "🔒 4. Configurando SSL com Let's Encrypt..." -ForegroundColor Yellow
ssh -i $KEY_PATH $SERVER @"
set -e

echo '📝 Configurando Nginx...'
sudo tee /etc/nginx/sites-available/plano-mestre-api > /dev/null << 'EOF'
server {
    listen 80;
    server_name plano-mestre-api.duckdns.org;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \\\$scheme;
        proxy_cache_bypass \\\$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/plano-mestre-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

echo '✅ Testando configuração do Nginx...'
sudo nginx -t

echo '🔄 Reiniciando Nginx...'
sudo systemctl restart nginx

echo '🔒 Configurando certificado SSL...'
sudo certbot --nginx -d plano-mestre-api.duckdns.org --non-interactive --agree-tos --email luiznascimentodev@gmail.com --redirect || echo 'Certbot já configurado ou erro ocorreu'

echo '✅ Nginx e SSL configurados!'
"@

Write-Host "✅ SSL configurado" -ForegroundColor Green
Write-Host ""

Write-Host "🧪 5. Testando API..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

try {
    $response = Invoke-WebRequest -Uri "https://plano-mestre-api.duckdns.org" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ API respondendo! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  API pode estar iniciando ainda. Aguarde alguns segundos e teste manualmente." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ DEPLOY CONCLUÍDO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor Cyan
Write-Host "  API: https://plano-mestre-api.duckdns.org" -ForegroundColor White
Write-Host "  Frontend: https://plano-mestre-frontend.vercel.app" -ForegroundColor White
Write-Host ""
Write-Host "📊 Para ver logs em tempo real:" -ForegroundColor Cyan
Write-Host "  ssh -i `"$KEY_PATH`" $SERVER `"cd $REMOTE_DIR && docker-compose logs -f app`"" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 Para acessar o servidor:" -ForegroundColor Cyan
Write-Host "  ssh -i `"$KEY_PATH`" $SERVER" -ForegroundColor Gray
