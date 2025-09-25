# =============================================================================
# TKD Hub API - Quick Deployment Script (Essential Steps Only)
# =============================================================================


# Quick configuration - modify these values as needed
$ResourceGroup = "tkd-hub-rg"
$Location = "Central US"
$GitHubRepo = "nicolassnider/TKD_Hub_API"
$SqlAdminPassword = "SecurePassword123!"  # Change this!


# Generate unique names
$randomSuffix = Get-Random -Minimum 100000 -Maximum 999999
$sqlServerName = "tkd-hub-sql-$randomSuffix"
$signalRName = "tkd-hub-signalr-$randomSuffix"
$staticWebAppName = "tkd-hub-app-$randomSuffix"


Write-Host "🚀 Quick TKD Hub Deployment Starting..." -ForegroundColor Green


# 1. Create Resource Group
Write-Host "`n📂 Creating Resource Group..." -ForegroundColor Cyan
az group create --name $ResourceGroup --location $Location


# 2. Create SQL Server & Database
Write-Host "`n🗄️ Creating SQL Database..." -ForegroundColor Cyan
az sql server create --name $sqlServerName --resource-group $ResourceGroup --location $Location --admin-user "tkdhub-admin" --admin-password $SqlAdminPassword
az sql db create --resource-group $ResourceGroup --server $sqlServerName --name "TKDHubDb" --edition GeneralPurpose --compute-model Serverless --family Gen5 --capacity 1 --auto-pause-delay 60
az sql server firewall-rule create --resource-group $ResourceGroup --server $sqlServerName --name "AllowAzureServices" --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0


# 3. Create SignalR Service
Write-Host "`n📡 Creating SignalR Service..." -ForegroundColor Cyan
az signalr create --name $signalRName --resource-group $ResourceGroup --location $Location --sku Free_F1 --unit-count 1 --service-mode Serverless


# 4. Create Static Web App
Write-Host "`n🌐 Creating Static Web App..." -ForegroundColor Cyan
az staticwebapp create --name $staticWebAppName --resource-group $ResourceGroup --location $Location


# 5. Get connection strings and configure settings
Write-Host "`n⚙️ Configuring Settings..." -ForegroundColor Cyan
$sqlConnectionString = "Server=tcp:$sqlServerName.database.windows.net,1433;Initial Catalog=TKDHubDb;Persist Security Info=False;User ID=tkdhub-admin;Password=$SqlAdminPassword;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
$signalRConnectionString = az signalr key list --name $signalRName --resource-group $ResourceGroup --query primaryConnectionString -o tsv


az staticwebapp appsettings set --name $staticWebAppName --resource-group $ResourceGroup --setting-names "DefaultConnection=$sqlConnectionString" "SignalRConnectionString=$signalRConnectionString" "ASPNETCORE_ENVIRONMENT=Production"


# 6. Get deployment token for GitHub
$deploymentToken = az staticwebapp secrets list --name $staticWebAppName --resource-group $ResourceGroup --query "properties.apiKey" -o tsv
$staticWebAppUrl = az staticwebapp show --name $staticWebAppName --resource-group $ResourceGroup --query "defaultHostname" -o tsv


# Final output
Write-Host "`n🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════" -ForegroundColor Green
Write-Host "🌐 App URL: https://$staticWebAppUrl" -ForegroundColor Yellow
Write-Host "🗄️ SQL Server: $sqlServerName.database.windows.net" -ForegroundColor Yellow
Write-Host "📡 SignalR: $signalRName.service.signalr.net" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔗 GitHub Setup Required:" -ForegroundColor Cyan
Write-Host "Add this secret to your GitHub repo ($GitHubRepo):"
Write-Host "Name: AZURE_STATIC_WEB_APPS_API_TOKEN"
Write-Host "Value: $deploymentToken"
Write-Host "═══════════════════════════════════════════" -ForegroundColor Green
