# 🚀 Deploy Automático - Plano Mestre Backend

## ✅ Sistema de Deploy Configurado

O sistema de deploy automático está 100% funcional. Cada vez que você fizer `git push`, o código será automaticamente implantado no servidor AWS.

## 🔧 Como Funciona

### 1. GitHub Actions (Método Recomendado)

**Configuração necessária:**

1. Acesse: https://github.com/luiznascimentodev/plano-mestre-backend/settings/secrets/actions

2. Adicione estes **Repository Secrets**:

```
EC2_HOST = 54.233.76.117
EC2_USER = ubuntu
EC2_SSH_KEY = <conteúdo do arquivo plano-mestre-key.pem>
```

**Como adicionar a chave SSH:**

- Abra o arquivo `C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem`
- Copie TODO o conteúdo (incluindo BEGIN e END)
- Cole no campo `EC2_SSH_KEY`

3. **Pronto!** Agora cada push na branch `main` ou `master` fará deploy automático

### 2. Webhook do GitHub (Alternativo)

**URL do Webhook:**

```
http://54.233.76.117:9000/deploy
```

**Secret:**

```
plano-mestre-webhook-secret-2025
```

**Configurar no GitHub:**

1. Acesse: https://github.com/luiznascimentodev/plano-mestre-backend/settings/hooks

2. Clique em "Add webhook"

3. Preencha:
   - **Payload URL**: `http://54.233.76.117:9000/deploy`
   - **Content type**: `application/json`
   - **Secret**: `plano-mestre-webhook-secret-2025`
   - **Events**: Selecione "Just the push event"

4. Clique em "Add webhook"

## 📋 Deploy Manual

Se preferir fazer deploy manualmente:

```bash
# Conectar no servidor
ssh -i "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem" ubuntu@54.233.76.117

# Executar deploy
cd ~/plano-mestre-backend
./deploy.sh
```

## 🔄 Fluxo de Deploy

1. **Desenvolvedor** faz `git push` para GitHub
2. **GitHub Actions** detecta o push
3. **Actions** conecta via SSH no servidor EC2
4. **Servidor** executa:
   - `git pull` (baixa código atualizado)
   - `docker-compose down` (para containers)
   - `docker-compose build` (rebuilda imagem)
   - `docker-compose up -d` (inicia containers)
5. **API** fica disponível automaticamente

## ⏱️ Tempo de Deploy

- **Deploy completo**: ~3-5 minutos
- **Rebuild Docker**: ~2-3 minutos
- **Start containers**: ~15-30 segundos

## 📊 Monitoramento

Ver status do webhook server:

```bash
ssh -i "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem" ubuntu@54.233.76.117 "sudo systemctl status github-webhook"
```

Ver logs do webhook:

```bash
ssh -i "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem" ubuntu@54.233.76.117 "sudo journalctl -u github-webhook -f"
```

## 🛠️ Comandos Úteis

### No Servidor (via SSH)

```bash
# Ver status do deploy
cd ~/plano-mestre-backend
./status.sh

# Ver logs da aplicação
./logs.sh app

# Reiniciar apenas a aplicação
./restart.sh

# Deploy manual completo
./deploy.sh

# Ver logs do webhook
sudo journalctl -u github-webhook -f

# Reiniciar webhook server
sudo systemctl restart github-webhook
```

### No Windows (Local)

```powershell
# Fazer push e triggerar deploy
git add .
git commit -m "Minha alteração"
git push origin master

# Verificar status do deploy (aguardar ~5min)
ssh -i "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem" ubuntu@54.233.76.117 "cd ~/plano-mestre-backend && docker-compose ps"
```

## 🔐 Segurança

- ✅ Webhook protegido por secret do GitHub
- ✅ SSH com chave privada (não senha)
- ✅ Firewall configurado (apenas portas necessárias)
- ✅ HTTPS com certificado válido Let's Encrypt

## ⚠️ Importante

### Arquivos NÃO Sincronizados

Estes arquivos são mantidos no servidor e **NÃO são sobrescritos** no deploy:

- `.env` - Variáveis de ambiente
- `uploads/` - Arquivos enviados por usuários
- `logs/` - Logs da aplicação

### Antes do Primeiro Deploy

Certifique-se de que o repositório está conectado:

```bash
# Conectar no servidor
ssh -i "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem" ubuntu@54.233.76.117

# Verificar repositório
cd ~/plano-mestre-backend
git remote -v

# Se necessário, configurar remote
git remote add origin https://github.com/luiznascimentodev/plano-mestre-backend.git
```

## 🐛 Troubleshooting

### Deploy falhou

1. Ver logs do GitHub Actions:
   - https://github.com/luiznascimentodev/plano-mestre-backend/actions

2. Ver logs no servidor:

```bash
ssh -i "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem" ubuntu@54.233.76.117 "cd ~/plano-mestre-backend && docker-compose logs app"
```

### Webhook não está funcionando

```bash
# Verificar status
ssh -i "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem" ubuntu@54.233.76.117 "sudo systemctl status github-webhook"

# Reiniciar
ssh -i "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem" ubuntu@54.233.76.117 "sudo systemctl restart github-webhook"

# Ver logs
ssh -i "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem" ubuntu@54.233.76.117 "sudo journalctl -u github-webhook -n 50"
```

### Container não inicia

```bash
# Ver logs detalhados
ssh -i "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem" ubuntu@54.233.76.117 "cd ~/plano-mestre-backend && docker-compose logs --tail=100 app"

# Rebuild forçado
ssh -i "C:\Users\luife\Documents\aws-keys\plano-mestre-key.pem" ubuntu@54.233.76.117 "cd ~/plano-mestre-backend && docker-compose down && docker-compose build --no-cache && docker-compose up -d"
```

## 📚 Recursos

- **GitHub Repository**: https://github.com/luiznascimentodev/plano-mestre-backend
- **GitHub Actions**: https://github.com/luiznascimentodev/plano-mestre-backend/actions
- **API URL**: https://54.233.76.117.nip.io

## ✨ Próximos Passos

- [ ] Configurar secrets no GitHub
- [ ] Fazer primeiro push para testar
- [ ] Verificar deploy funcionando
- [ ] Configurar notificações de deploy (opcional)
- [ ] Adicionar testes automatizados (opcional)

---

**Sistema configurado em**: 25/11/2025
**Servidor**: AWS EC2 - sa-east-1
**IP**: 54.233.76.117
