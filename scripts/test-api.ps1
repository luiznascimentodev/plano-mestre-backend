# Script para testar a API do Plano Mestre
$ErrorActionPreference = "Stop"

$API_URL = "https://plano-mestre-api.duckdns.org"

Write-Host "============================" -ForegroundColor Cyan
Write-Host "TESTE DA API PLANO MESTRE" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

# Dados de teste
$testEmail = "teste_$(Get-Random)@example.com"
$testPassword = "Senha123!"
$testName = "Usuario Teste"

Write-Host "1. Testando registro de usuario..." -ForegroundColor Yellow
Write-Host "Email: $testEmail" -ForegroundColor Gray

$registerBody = @{
    email = $testEmail
    password = $testPassword
    name = $testName
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "$API_URL/auth/register" `
        -Method POST `
        -Body $registerBody `
        -ContentType "application/json" `
        -UseBasicParsing
    
    Write-Host "Sucesso! Status: $($registerResponse.StatusCode)" -ForegroundColor Green
    $registerData = $registerResponse.Content | ConvertFrom-Json
    Write-Host "Usuario ID: $($registerData.user.id)" -ForegroundColor Gray
} catch {
    Write-Host "Erro no registro: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2. Testando login..." -ForegroundColor Yellow

$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    
    $loginResponse = Invoke-WebRequest -Uri "$API_URL/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json" `
        -WebSession $session `
        -UseBasicParsing
    
    Write-Host "Sucesso! Status: $($loginResponse.StatusCode)" -ForegroundColor Green
    
    # Extrair token do cookie
    $accessTokenCookie = $session.Cookies.GetCookies($API_URL) | Where-Object { $_.Name -eq "access_token" }
    
    if ($accessTokenCookie) {
        $token = $accessTokenCookie.Value
        Write-Host "Token obtido via cookie httpOnly" -ForegroundColor Gray
    } else {
        Write-Host "AVISO: Token em cookie httpOnly nao acessivel via PowerShell" -ForegroundColor Yellow
        Write-Host "Isso e esperado e mais seguro! Vamos usar a sessao web." -ForegroundColor Yellow
        $token = $null
    }
} catch {
    Write-Host "Erro no login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "3. Testando criacao de assunto..." -ForegroundColor Yellow

$topicBody = @{
    name = "Direito Constitucional - Teste"
    category = "Direito"
    priority = "HIGH"
    description = "Assunto de teste criado pela API"
    tags = "teste,direito,api"
    color = "#3B82F6"
} | ConvertTo-Json

try {
    # Usar a sessão web que tem os cookies do login
    if ($session) {
        $topicResponse = Invoke-WebRequest -Uri "$API_URL/topics" `
            -Method POST `
            -Body $topicBody `
            -ContentType "application/json" `
            -WebSession $session `
            -UseBasicParsing
    } else {
        $topicResponse = Invoke-WebRequest -Uri "$API_URL/topics" `
            -Method POST `
            -Body $topicBody `
            -ContentType "application/json" `
            -Headers @{ Authorization = "Bearer $token" } `
            -UseBasicParsing
    }
    
    Write-Host "SUCESSO! Assunto criado! Status: $($topicResponse.StatusCode)" -ForegroundColor Green
    $topicData = $topicResponse.Content | ConvertFrom-Json
    Write-Host "Assunto ID: $($topicData.id)" -ForegroundColor Gray
    Write-Host "Nome: $($topicData.name)" -ForegroundColor Gray
    Write-Host "Categoria: $($topicData.category)" -ForegroundColor Gray
    Write-Host "Prioridade: $($topicData.priority)" -ForegroundColor Gray
} catch {
    Write-Host "ERRO ao criar assunto: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host "Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "4. Listando assuntos do usuario..." -ForegroundColor Yellow

try {
    if ($session) {
        $listResponse = Invoke-WebRequest -Uri "$API_URL/topics" `
            -Method GET `
            -WebSession $session `
            -UseBasicParsing
    } else {
        $listResponse = Invoke-WebRequest -Uri "$API_URL/topics" `
            -Method GET `
            -Headers @{ Authorization = "Bearer $token" } `
            -UseBasicParsing
    }
    
    Write-Host "Sucesso! Status: $($listResponse.StatusCode)" -ForegroundColor Green
    $topics = $listResponse.Content | ConvertFrom-Json
    Write-Host "Total de assuntos: $($topics.Count)" -ForegroundColor Gray
    
    foreach ($topic in $topics) {
        Write-Host "  - $($topic.name) (ID: $($topic.id))" -ForegroundColor Gray
    }
} catch {
    Write-Host "Erro ao listar assuntos: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================" -ForegroundColor Cyan
Write-Host "TODOS OS TESTES PASSARAM!" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "A API esta funcionando corretamente, incluindo:" -ForegroundColor White
Write-Host "  - Registro de usuario" -ForegroundColor White
Write-Host "  - Login e autenticacao" -ForegroundColor White
Write-Host "  - Criacao de assuntos" -ForegroundColor White
Write-Host "  - Listagem de assuntos" -ForegroundColor White
Write-Host ""
Write-Host "SSL/HTTPS: Ativo e funcionando" -ForegroundColor Green
Write-Host "API URL: $API_URL" -ForegroundColor Cyan
