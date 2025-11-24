# Script para corrigir o servidor após SSH funcionar
$ErrorActionPreference = "Stop"

$KEY_PATH = "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem"
$SERVER = "ubuntu@52.67.75.255"

Write-Host "🔍 Testando conexão SSH..." -ForegroundColor Cyan
$connected = $false
$maxAttempts = 10
$attempt = 1

while (-not $connected -and $attempt -le $maxAttempts) {
    Write-Host "Tentativa $attempt de $maxAttempts..." -ForegroundColor Yellow
    try {
        $result = ssh -i $KEY_PATH -o ConnectTimeout=10 -o StrictHostKeyChecking=no $SERVER "echo 'ok'" 2>&1
        if ($result -match "ok") {
            $connected = $true
            Write-Host "✅ Conectado com sucesso!" -ForegroundColor Green
        }
    } catch {
        Write-Host "Falhou, aguardando 10 segundos..." -ForegroundColor Red
        Start-Sleep -Seconds 10
    }
    $attempt++
}

if (-not $connected) {
    Write-Host "❌ Não foi possível conectar ao servidor. Verifique:" -ForegroundColor Red
    Write-Host "1. Se a instância está rodando no Console AWS" -ForegroundColor Yellow
    Write-Host "2. Se o Security Group permite SSH do seu IP" -ForegroundColor Yellow
    Write-Host "3. Se a chave SSH está correta" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📋 Executando diagnóstico..." -ForegroundColor Cyan
ssh -i $KEY_PATH $SERVER @"
echo '=== DIAGNÓSTICO DO SERVIDOR ==='
echo ''
echo 'Sistema:'
uname -a
echo ''
echo 'Uptime:'
uptime
echo ''
echo 'Memória:'
free -h
echo ''
echo 'Disco:'
df -h /
echo ''
echo 'Docker:'
docker --version
docker ps -a
echo ''
echo 'Diretório da aplicação:'
ls -lah /opt/plano-mestre-backend/ 2>/dev/null || echo 'Diretório não existe'
"@

Write-Host ""
Write-Host "📤 Enviando arquivo .env de produção..." -ForegroundColor Cyan
scp -i $KEY_PATH .env.production ${SERVER}:/tmp/.env.new

Write-Host ""
Write-Host "📤 Enviando script de diagnóstico..." -ForegroundColor Cyan
scp -i $KEY_PATH scripts/diagnostic.sh ${SERVER}:/tmp/diagnostic.sh

Write-Host ""
Write-Host "🔧 Configurando servidor..." -ForegroundColor Cyan
ssh -i $KEY_PATH $SERVER @"
set -e

echo '📁 Criando diretório se não existir...'
sudo mkdir -p /opt/plano-mestre-backend
sudo chown ubuntu:ubuntu /opt/plano-mestre-backend

echo '📋 Instalando dependências do sistema...'
sudo apt-get update -qq
sudo apt-get install -y docker.io docker-compose nginx certbot python3-certbot-nginx

echo '🐳 Habilitando Docker...'
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu

echo '📄 Copiando .env...'
sudo cp /tmp/.env.new /opt/plano-mestre-backend/.env
sudo chown ubuntu:ubuntu /opt/plano-mestre-backend/.env

echo '✅ Configuração inicial concluída!'
"@

Write-Host ""
Write-Host "✅ Servidor configurado! Agora vamos fazer o deploy completo." -ForegroundColor Green
Write-Host ""
Write-Host "Execute o próximo comando para fazer o deploy:" -ForegroundColor Yellow
Write-Host ".\scripts\deploy-to-aws.ps1" -ForegroundColor Cyan
