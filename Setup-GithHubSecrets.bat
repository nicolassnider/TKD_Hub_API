@echo off
REM GitHub Secrets Setup Batch Script for TKD Hub API
REM This script provides examples of how to set GitHub secrets using GitHub CLI

echo.
echo ========================================
echo   TKD Hub API - GitHub Secrets Setup
echo ========================================
echo.

REM Check if GitHub CLI is installed
gh --version >nul 2>&1
if errorlevel 1 (
    echo ❌ GitHub CLI is not installed or not in PATH
    echo    Install from: https://cli.github.com/
    pause
    exit /b 1
)

echo ✅ GitHub CLI is available

REM Check authentication
gh auth status >nul 2>&1
if errorlevel 1 (
    echo ❌ GitHub CLI is not authenticated
    echo    Run: gh auth login
    pause
    exit /b 1
)

echo ✅ GitHub CLI is authenticated

echo.
echo This script will help you set GitHub repository secrets.
echo You can run the commands individually or use the PowerShell script for interactive setup.
echo.

echo ========================================
echo   OPTION 1: PowerShell Interactive Script
echo ========================================
echo.
echo For the best experience, use the PowerShell script:
echo.
echo   # Standard deployment (~$82/month)
echo   .\Setup-GitHubSecrets.ps1 -DeploymentType Standard
echo.
echo   # FREE TIER deployment (~$5.50/month)
echo   .\Setup-GitHubSecrets.ps1 -DeploymentType FreeTier
echo.
echo   # Both deployments
echo   .\Setup-GitHubSecrets.ps1 -DeploymentType Both
echo.

echo ========================================
echo   OPTION 2: Manual Commands (Examples)
echo ========================================
echo.
echo Here are example commands to set secrets manually:
echo.

echo REM Azure Authentication (Required for all deployments)
echo echo "your-client-id" ^| gh secret set AZURE_CLIENT_ID
echo echo "your-tenant-id" ^| gh secret set AZURE_TENANT_ID  
echo echo "your-subscription-id" ^| gh secret set AZURE_SUBSCRIPTION_ID
echo.

echo REM Standard Deployment Secrets
echo echo "tkd-hub-rg" ^| gh secret set AZURE_RG_NAME
echo echo "tkdhub" ^| gh secret set APP_NAME
echo echo "sqladmin" ^| gh secret set SQL_ADMIN_LOGIN
echo echo "MyStrongP@ssw0rd123!" ^| gh secret set SQL_ADMIN_PASSWORD
echo echo "admin@tkdhub.com" ^| gh secret set GRANDMASTER_EMAIL
echo echo "AdminP@ssw0rd123!" ^| gh secret set GRANDMASTER_PASSWORD
echo.

echo REM FREE TIER Deployment Secrets (different resource names)
echo echo "tkd-hub-free-rg" ^| gh secret set AZURE_RG_NAME_FREE
echo echo "tkdhubfree" ^| gh secret set APP_NAME_FREE
echo.

echo REM Optional Secrets (same for both deployments)
echo echo "My Martial Arts School" ^| gh secret set DOJANG_NAME
echo echo "123 Training Way" ^| gh secret set DOJANG_ADDRESS
echo echo "My City" ^| gh secret set DOJANG_LOCATION
echo echo "555-123-4567" ^| gh secret set DOJANG_PHONE
echo echo "info@myschool.com" ^| gh secret set DOJANG_EMAIL
echo.

echo ========================================
echo   Current Repository Information
echo ========================================
echo.

REM Try to get current repository info
for /f "tokens=*" %%i in ('git config --get remote.origin.url 2^>nul') do set REPO_URL=%%i

if defined REPO_URL (
    echo Current repository: %REPO_URL%
    echo.
    
    REM Extract owner/repo from URL
    for /f "tokens=1,2 delims=/" %%a in ('echo %REPO_URL% ^| findstr /r "github\.com[:/]"') do (
        for /f "tokens=4,5 delims=/" %%c in ("%%a/%%b") do (
            set REPO_OWNER=%%c
            set REPO_NAME=%%d
        )
    )
    
    if defined REPO_NAME (
        set REPO_NAME=%REPO_NAME:.git=%
        echo To set secrets for this repository, add --repo %REPO_OWNER%/%REPO_NAME% to commands
        echo Example: echo "value" ^| gh secret set SECRET_NAME --repo %REPO_OWNER%/%REPO_NAME%
    )
) else (
    echo Could not detect current repository
    echo Make sure you're in a git repository with GitHub remote
)

echo.
echo ========================================
echo   Secret Generation Helpers
echo ========================================
echo.
echo To generate secure values:
echo.
echo JWT Key (64 hex chars):
powershell -Command "[System.BitConverter]::ToString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)) -replace '-', ''"
echo.

echo Strong Password:
powershell -Command "$chars='ABCDEFGHKLMNOPRSTUVWXYZabcdefghiklmnoprstuvwxyz0123456789!@#$%^&*'; -join ((1..16) | ForEach-Object { $chars[(Get-Random -Minimum 0 -Maximum $chars.Length)] })"
echo.

echo ========================================
echo   Verification
echo ========================================
echo.
echo To verify secrets are set correctly:
echo   gh secret list
echo.
echo To view a specific secret (shows only if set):
echo   gh secret list ^| findstr SECRET_NAME
echo.

echo ========================================
echo   Next Steps After Setting Secrets
echo ========================================
echo.
echo Standard Deployment:
echo   1. Push to 'main' branch
echo   2. Monitor GitHub Actions workflow
echo   3. Cost: ~$82/month
echo.
echo FREE TIER Deployment:
echo   1. Create branch: git checkout -b free-tier
echo   2. Push branch: git push origin free-tier  
echo   3. Monitor GitHub Actions workflow
echo   4. Cost: ~$5.50/month
echo.

echo ✅ Setup guide complete!
echo.
echo Recommendation: Use the PowerShell script for interactive setup:
echo   .\Setup-GitHubSecrets.ps1 -DeploymentType FreeTier
echo.
pause
