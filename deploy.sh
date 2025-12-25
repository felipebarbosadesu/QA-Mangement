#!/bin/bash

# 🚀 Script de Deploy Quality Hub v19 para GitHub Pages
# Autor: Felipe Vieira Barbosa
# Data: 25/12/2026

echo "🎯 Quality Hub v19 - Deploy para GitHub Pages"
echo "=============================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se Git está instalado
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git não está instalado. Instale o Git primeiro.${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Passo 1: Configurando repositório Git...${NC}"

# Inicializar Git se necessário
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✅ Repositório Git inicializado${NC}"
else
    echo -e "${GREEN}✅ Repositório Git já existe${NC}"
fi

# Solicitar informações do usuário
echo ""
echo -e "${YELLOW}📝 Por favor, forneça as seguintes informações:${NC}"
echo ""
read -p "Seu usuário do GitHub: " GITHUB_USER
read -p "Nome do repositório (ex: quality-hub): " REPO_NAME

# Verificar se as variáveis foram preenchidas
if [ -z "$GITHUB_USER" ] || [ -z "$REPO_NAME" ]; then
    echo -e "${RED}❌ Usuário e nome do repositório são obrigatórios!${NC}"
    exit 1
fi

# Atualizar vite.config.ts com o nome correto do repositório
echo ""
echo -e "${YELLOW}⚙️  Passo 2: Atualizando vite.config.ts...${NC}"

if [ -f "vite.config.ts" ]; then
    sed -i.bak "s|base: '/quality-hub/'|base: '/$REPO_NAME/'|g" vite.config.ts
    rm vite.config.ts.bak 2>/dev/null
    echo -e "${GREEN}✅ vite.config.ts atualizado${NC}"
else
    echo -e "${RED}❌ vite.config.ts não encontrado!${NC}"
    exit 1
fi

# Atualizar 404.html se existir
if [ -f "public/404.html" ]; then
    sed -i.bak "s|const base = '/quality-hub/'|const base = '/$REPO_NAME/'|g" public/404.html
    rm public/404.html.bak 2>/dev/null
    echo -e "${GREEN}✅ 404.html atualizado${NC}"
fi

echo ""
echo -e "${YELLOW}📦 Passo 3: Adicionando arquivos ao Git...${NC}"

# Adicionar todos os arquivos
git add .

echo -e "${GREEN}✅ Arquivos adicionados${NC}"

echo ""
echo -e "${YELLOW}💾 Passo 4: Fazendo commit...${NC}"

# Commit
git commit -m "🚀 Quality Hub v19 - Deploy inicial para GitHub Pages"

echo -e "${GREEN}✅ Commit realizado${NC}"

echo ""
echo -e "${YELLOW}🌐 Passo 5: Configurando remote...${NC}"

# Verificar se remote já existe
if git remote | grep -q "origin"; then
    echo -e "${YELLOW}⚠️  Remote 'origin' já existe. Atualizando...${NC}"
    git remote set-url origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
else
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
fi

echo -e "${GREEN}✅ Remote configurado${NC}"

echo ""
echo -e "${YELLOW}🔄 Passo 6: Renomeando branch para 'main'...${NC}"

git branch -M main

echo -e "${GREEN}✅ Branch renomeada${NC}"

echo ""
echo -e "${YELLOW}📤 Passo 7: Enviando para GitHub...${NC}"
echo -e "${YELLOW}⚠️  Você pode precisar autenticar no GitHub${NC}"

# Push para GitHub
if git push -u origin main; then
    echo -e "${GREEN}✅ Código enviado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao enviar código. Verifique suas credenciais.${NC}"
    exit 1
fi

echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Deploy iniciado com sucesso!${NC}"
echo "=============================================="
echo ""
echo -e "${YELLOW}📋 PRÓXIMOS PASSOS:${NC}"
echo ""
echo "1. Acesse: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "2. Vá em Settings → Pages"
echo "3. Em 'Source', selecione: GitHub Actions"
echo "4. Aguarde o workflow completar (~2-3 minutos)"
echo "5. Acesse sua aplicação em:"
echo ""
echo -e "${GREEN}   🔗 https://$GITHUB_USER.github.io/$REPO_NAME/${NC}"
echo ""
echo "=============================================="
echo ""
echo -e "${YELLOW}💡 Dica: Para atualizações futuras, use:${NC}"
echo ""
echo "   git add ."
echo "   git commit -m 'Sua mensagem'"
echo "   git push"
echo ""
echo "   O deploy será AUTOMÁTICO! 🚀"
echo ""
echo "=============================================="
echo ""
echo -e "${GREEN}✅ Script concluído!${NC}"
echo ""
