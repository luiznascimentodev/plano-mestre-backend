#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/plano-mestre-backend"
BRANCH="master"

echo "[deploy] Iniciando deploy em ${APP_DIR} (branch ${BRANCH})"

if [ ! -d "$APP_DIR/.git" ]; then
  echo "[deploy] Repositório não encontrado em $APP_DIR" >&2
  exit 1
fi

cd "$APP_DIR"

echo "[deploy] Atualizando código"
git fetch --all --quiet
git reset --hard origin/${BRANCH}

if [ ! -f .env ]; then
  echo "[deploy] .env inexistente. Copie de .env.sample e adicione segredos. Abortando." >&2
  exit 1
fi

echo "[deploy] Instalando dependências de produção"
npm ci --omit=dev

echo "[deploy] Gerando Prisma Client"
npx prisma generate

echo "[deploy] Build NestJS"
npm run build

echo "[deploy] Reiniciando serviço (systemd)"
if systemctl list-units --type=service | grep -q "plano-mestre-backend.service"; then
  sudo systemctl restart plano-mestre-backend.service
  echo "[deploy] Serviço reiniciado"
else
  echo "[deploy] Serviço ainda não criado"
fi

echo "[deploy] Deploy finalizado com sucesso. Commit atual: $(git rev-parse --short HEAD)"