# Script para testar conexao SSH com retry
$ErrorActionPreference = "Continue"

$KEY_PATH = "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem"
$SERVER = "ubuntu@52.67.75.255"
$MAX_ATTEMPTS = 15
$WAIT_SECONDS = 10

Write-Host "Testando conexao SSH com o servidor AWS..." -ForegroundColor Cyan
Write-Host "Servidor: $SERVER" -ForegroundColor Gray
Write-Host "Tentativas maximas: $MAX_ATTEMPTS" -ForegroundColor Gray
Write-Host ""

for ($i = 1; $i -le $MAX_ATTEMPTS; $i++) {
    Write-Host "[$i/$MAX_ATTEMPTS] Tentando conectar..." -ForegroundColor Yellow
    
    $output = ssh -i $KEY_PATH -o ConnectTimeout=15 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $SERVER "echo 'SSH_OK'; whoami; uptime" 2>&1
    
    if ($output -match "SSH_OK") {
        Write-Host "Conexao estabelecida com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Informacoes do servidor:" -ForegroundColor Cyan
        Write-Host $output
        Write-Host ""
        Write-Host "Servidor esta acessivel! Pode prosseguir com o deploy." -ForegroundColor Green
        exit 0
    } else {
        Write-Host "Falhou. Erro:" -ForegroundColor Red
        Write-Host $output -ForegroundColor Gray
        
        if ($i -lt $MAX_ATTEMPTS) {
            Write-Host "Aguardando $WAIT_SECONDS segundos antes da proxima tentativa..." -ForegroundColor Yellow
            Start-Sleep -Seconds $WAIT_SECONDS
        }
    }
}

Write-Host ""
Write-Host "Nao foi possivel conectar ao servidor apos $MAX_ATTEMPTS tentativas." -ForegroundColor Red
Write-Host ""
Write-Host "Possiveis causas:" -ForegroundColor Yellow
Write-Host "1. Instancia EC2 ainda esta inicializando (aguarde mais 2-3 minutos)" -ForegroundColor White
Write-Host "2. Instancia EC2 esta parada/terminada (verifique no Console AWS)" -ForegroundColor White
Write-Host "3. Security Group bloqueando seu IP (verifique se seu IP mudou)" -ForegroundColor White
Write-Host "4. Chave SSH incorreta ou sem permissoes corretas" -ForegroundColor White
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "Verifique o status da instancia no Console AWS" -ForegroundColor White
Write-Host "Seu IP atual e: " -NoNewline -ForegroundColor White
$currentIp = (Invoke-WebRequest -Uri "https://api.ipify.org" -UseBasicParsing).Content
Write-Host $currentIp -ForegroundColor Yellow
Write-Host "Tente conectar via Session Manager no Console AWS" -ForegroundColor White
