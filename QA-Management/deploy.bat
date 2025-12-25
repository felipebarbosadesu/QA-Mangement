@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 🚀 Script de Deploy Quality Hub v19 para GitHub Pages (Windows)
REM Autor: Felipe Vieira Barbosa
REM Data: 25/12/2026

echo.
echo ============================================== 
echo 🎯 Quality Hub v19 - Deploy para GitHub Pages
echo ==============================================
echo.

REM Verificar se Git está instalado
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git não está instalado. Instale o Git primeiro.
    echo 📥 Download: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo 📋 Passo 1: Configurando repositório Git...
echo.

REM Inicializar Git se necessário
if not exist ".git" (
    git init
    echo ✅ Repositório Git inicializado
) else (
    echo ✅ Repositório Git já existe
)

echo.
echo 📝 Por favor, forneça as seguintes informações:
echo.
set /p GITHUB_USER="Seu usuário do GitHub: "
set /p REPO_NAME="Nome do repositório (ex: quality-hub): "

REM Verificar se as variáveis foram preenchidas
if "!GITHUB_USER!"=="" (
    echo ❌ Usuário do GitHub é obrigatório!
    pause
    exit /b 1
)
if "!REPO_NAME!"=="" (
    echo ❌ Nome do repositório é obrigatório!
    pause
    exit /b 1
)

echo.
echo ⚙️  Passo 2: Atualizando vite.config.ts...
echo.

REM Atualizar vite.config.ts com PowerShell
powershell -Command "(Get-Content vite.config.ts) -replace \"base: '/quality-hub/'\", \"base: '/%REPO_NAME%/'\" | Set-Content vite.config.ts"
echo ✅ vite.config.ts atualizado

REM Atualizar 404.html se existir
if exist "public\404.html" (
    powershell -Command "(Get-Content public\404.html) -replace \"const base = '/quality-hub/'\", \"const base = '/%REPO_NAME%/'\" | Set-Content public\404.html"
    echo ✅ 404.html atualizado
)

echo.
echo 📦 Passo 3: Adicionando arquivos ao Git...
echo.

git add .
echo ✅ Arquivos adicionados

echo.
echo 💾 Passo 4: Fazendo commit...
echo.

git commit -m "🚀 Quality Hub v19 - Deploy inicial para GitHub Pages"
echo ✅ Commit realizado

echo.
echo 🌐 Passo 5: Configurando remote...
echo.

REM Verificar se remote já existe
git remote | findstr "origin" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Remote 'origin' já existe. Atualizando...
    git remote set-url origin https://github.com/!GITHUB_USER!/!REPO_NAME!.git
) else (
    git remote add origin https://github.com/!GITHUB_USER!/!REPO_NAME!.git
)

echo ✅ Remote configurado

echo.
echo 🔄 Passo 6: Renomeando branch para 'main'...
echo.

git branch -M main
echo ✅ Branch renomeada

echo.
echo 📤 Passo 7: Enviando para GitHub...
echo ⚠️  Você pode precisar autenticar no GitHub
echo.

git push -u origin main
if %errorlevel% neq 0 (
    echo ❌ Erro ao enviar código. Verifique suas credenciais.
    pause
    exit /b 1
)

echo ✅ Código enviado com sucesso!

echo.
echo ==============================================
echo 🎉 Deploy iniciado com sucesso!
echo ==============================================
echo.
echo 📋 PRÓXIMOS PASSOS:
echo.
echo 1. Acesse: https://github.com/!GITHUB_USER!/!REPO_NAME!
echo 2. Vá em Settings → Pages
echo 3. Em 'Source', selecione: GitHub Actions
echo 4. Aguarde o workflow completar (~2-3 minutos^)
echo 5. Acesse sua aplicação em:
echo.
echo    🔗 https://!GITHUB_USER!.github.io/!REPO_NAME!/
echo.
echo ==============================================
echo.
echo 💡 Dica: Para atualizações futuras, use:
echo.
echo    git add .
echo    git commit -m "Sua mensagem"
echo    git push
echo.
echo    O deploy será AUTOMÁTICO! 🚀
echo.
echo ==============================================
echo.
echo ✅ Script concluído!
echo.
pause
