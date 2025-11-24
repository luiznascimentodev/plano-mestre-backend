#!/bin/bash

echo "🔍 DIAGNÓSTICO DO SERVIDOR PLANO MESTRE"
echo "========================================"
echo ""

echo "📊 1. INFORMAÇÕES DO SISTEMA"
echo "----------------------------"
echo "Hostname: $(hostname)"
echo "Uptime: $(uptime)"
echo "Memória:"
free -h
echo ""
echo "Disco:"
df -h /
echo ""

echo "📊 2. DOCKER"
echo "----------------------------"
echo "Docker version:"
docker --version
echo ""
echo "Docker Compose version:"
docker-compose --version
echo ""
echo "Containers em execução:"
docker ps -a
echo ""
echo "Imagens Docker:"
docker images
echo ""

echo "📊 3. APLICAÇÃO"
echo "----------------------------"
echo "Conteúdo de /opt/plano-mestre-backend:"
ls -lah /opt/plano-mestre-backend/
echo ""
echo "Arquivo .env existe?"
[ -f /opt/plano-mestre-backend/.env ] && echo "✅ Sim" || echo "❌ Não"
echo ""

echo "📊 4. NGINX"
echo "----------------------------"
echo "Nginx status:"
sudo systemctl status nginx --no-pager | head -10
echo ""
echo "Portas em escuta:"
sudo netstat -tlnp | grep -E ':(80|443|3001)'
echo ""

echo "📊 5. CERTIFICADO SSL"
echo "----------------------------"
echo "Certificados Let's Encrypt:"
sudo ls -lah /etc/letsencrypt/live/ 2>/dev/null || echo "Nenhum certificado encontrado"
echo ""

echo "📊 6. LOGS DA APLICAÇÃO"
echo "----------------------------"
if [ -d /opt/plano-mestre-backend ]; then
  cd /opt/plano-mestre-backend
  echo "Logs do Docker Compose (últimas 50 linhas):"
  docker-compose logs --tail=50 2>/dev/null || echo "Nenhum log disponível"
else
  echo "Diretório da aplicação não encontrado"
fi
echo ""

echo "📊 7. CONECTIVIDADE COM RDS"
echo "----------------------------"
echo "Testando conexão com banco de dados RDS..."
timeout 5 bash -c 'cat < /dev/null > /dev/tcp/plano-mestre-db.clsckuw6gvkn.sa-east-1.rds.amazonaws.com/5432' && echo "✅ Conexão com RDS OK" || echo "❌ Não conseguiu conectar ao RDS"
echo ""

echo "========================================"
echo "✅ Diagnóstico concluído!"
