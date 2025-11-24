#!/bin/bash
set -e

echo "🔍 Verificando Security Group da instância EC2..."

INSTANCE_ID="i-03a33aca1dd61e3a8"
REGION="sa-east-1"

# Obter o Security Group ID da instância
SG_ID=$(aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --region $REGION \
  --query 'Reservations[0].Instances[0].SecurityGroups[0].GroupId' \
  --output text)

echo "Security Group ID: $SG_ID"

# Verificar regras atuais
echo ""
echo "📋 Regras de entrada atuais:"
aws ec2 describe-security-groups \
  --group-ids $SG_ID \
  --region $REGION \
  --query 'SecurityGroups[0].IpPermissions[*].[IpProtocol,FromPort,ToPort,IpRanges[0].CidrIp]' \
  --output table

echo ""
echo "✅ Adicionando regras necessárias (se não existirem)..."

# SSH (22)
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --ip-permissions IpProtocol=tcp,FromPort=22,ToPort=22,IpRanges='[{CidrIp=0.0.0.0/0,Description="SSH access"}]' \
  --region $REGION 2>/dev/null && echo "✓ SSH (22) adicionado" || echo "SSH (22) já existe"

# HTTP (80)
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --ip-permissions IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges='[{CidrIp=0.0.0.0/0,Description="HTTP access"}]' \
  --region $REGION 2>/dev/null && echo "✓ HTTP (80) adicionado" || echo "HTTP (80) já existe"

# HTTPS (443)
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --ip-permissions IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges='[{CidrIp=0.0.0.0/0,Description="HTTPS access"}]' \
  --region $REGION 2>/dev/null && echo "✓ HTTPS (443) adicionado" || echo "HTTPS (443) já existe"

# Porta da aplicação (3001) - para acesso direto se necessário
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --ip-permissions IpProtocol=tcp,FromPort=3001,ToPort=3001,IpRanges='[{CidrIp=0.0.0.0/0,Description="Backend API"}]' \
  --region $REGION 2>/dev/null && echo "✓ Porta 3001 adicionada" || echo "Porta 3001 já existe"

echo ""
echo "📋 Regras de entrada atualizadas:"
aws ec2 describe-security-groups \
  --group-ids $SG_ID \
  --region $REGION \
  --query 'SecurityGroups[0].IpPermissions[*].[IpProtocol,FromPort,ToPort,IpRanges[0].CidrIp]' \
  --output table

echo ""
echo "✅ Security Group configurado com sucesso!"
