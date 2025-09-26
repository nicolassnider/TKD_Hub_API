# TKD Hub API - Quick Azure Deployment Script
# This script creates all necessary Azure resources and deploys the TKD Hub API


# Configuration Variables
$ResourceGroup = "tkd-hub-rg"
$Location = "East US"
$sqlServerName = "tkd-hub-sql-server"
$databaseName = "TKDHubDB"
$storageAccountName = "tkdhubstorage$(Get-Random -Minimum 1000 -Maximum 9999)"
$appServicePlan = "tkd-hub-app-plan"
$webAppName = "tkd-hub-api-$(Get-Random -Minimum 1000 -Maximum 9999)"
$adminUsername = "tkdadmin"
$adminPassword = "TKDHub2024!@#"


Write-Host "Starting TKD Hub API deployment to Azure..." -ForegroundColor Green
Write-Host "Resource Group: $ResourceGroup" -ForegroundColor Yellow
Write-Host "Location: $Location" -ForegroundColor Yellow


# 1. Create Resource Group
Write-Host "Creating Resource Group..." -ForegroundColor Cyan
az group create --name $ResourceGroup --location $Location


# 2. Create SQL Server and Database with region retry
$regions = @("Central US", "East US 2", "West US 2", "South Central US", "North Central US")
$sqlServerCreated = $false


foreach ($region in $regions) {
    Write-Host "Trying to create SQL Server in $region..." -ForegroundColor Cyan
    az sql server create --name $sqlServerName --resource-group $ResourceGroup --location $region --admin-user $adminUsername --admin-password $adminPassword
   
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SQL Server created successfully in $region" -ForegroundColor Green
        $sqlServerCreated = $true
        break
    } else {
        Write-Host "Failed to create SQL Server in $region, trying next region..." -ForegroundColor Yellow
    }
}


if ($sqlServerCreated) {
    Write-Host "Creating SQL Database..." -ForegroundColor Cyan
    az sql db create --resource-group $ResourceGroup --server $sqlServerName --name $databaseName --service-objective S0
   
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create SQL Database" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Failed to create SQL Server in any available region" -ForegroundColor Red
    exit 1
}


# 3. Create Storage Account
Write-Host "Creating Storage Account..." -ForegroundColor Cyan
az storage account create --name $storageAccountName --resource-group $ResourceGroup --location $Location --sku Standard_LRS


if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create Storage Account in $Location, this may not be critical for basic deployment" -ForegroundColor Yellow
}


# 4. Create App Service Plan and WebAPI with region retry
$appServiceRegions = @("Central US", "East US 2", "West US 2", "South Central US", "North Central US", "West US", "East US")
$appServicePlanCreated = $false
$finalAppServiceRegion = ""


foreach ($region in $appServiceRegions) {
    Write-Host "Trying to create App Service Plan in $region..." -ForegroundColor Cyan
    az appservice plan create --name $appServicePlan --resource-group $ResourceGroup --location $region --sku B1
   
    if ($LASTEXITCODE -eq 0) {
        Write-Host "App Service Plan created successfully in $region" -ForegroundColor Green
        $appServicePlanCreated = $true
        $finalAppServiceRegion = $region
        break
    } else {
        Write-Host "Failed to create App Service Plan in $region, trying next region..." -ForegroundColor Yellow
    }
}


if ($appServicePlanCreated) {
    Write-Host "Creating Web App for API..." -ForegroundColor Cyan
    Write-Host "Checking available Windows runtimes..." -ForegroundColor DarkCyan
    az webapp list-runtimes --os-type windows
   
    Write-Host "Creating WebApp with .NET 8.0 runtime..." -ForegroundColor Cyan
    az webapp create --name $webAppName --resource-group $ResourceGroup --plan $appServicePlan --runtime "dotnet:8"
   
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Web App created successfully: $webAppName" -ForegroundColor Green
    } else {
        Write-Host "Failed to create Web App. Check if the name is available." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Failed to create App Service Plan in any available region" -ForegroundColor Red
    Write-Host "You may need to request quota increase or try again later" -ForegroundColor Yellow
    exit 1
}


# Configure WebAPI settings
Write-Host "Configuring WebAPI settings..." -ForegroundColor Cyan
$connectionString = "Server=tcp:$sqlServerName.database.windows.net,1433;Initial Catalog=$databaseName;Persist Security Info=False;User ID=$adminUsername;Password=$adminPassword;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"


az webapp config appsettings set --name $webAppName --resource-group $ResourceGroup --settings `
    "ConnectionStrings__DefaultConnection=$connectionString" `
    "ASPNETCORE_ENVIRONMENT=Production"


# Get storage account connection string
$storageConnectionString = az storage account show-connection-string --name $storageAccountName --resource-group $ResourceGroup --query connectionString -o tsv


az webapp config appsettings set --name $webAppName --resource-group $ResourceGroup --settings `
    "AzureStorage__ConnectionString=$storageConnectionString"


# Configure CORS
Write-Host "Configuring CORS..." -ForegroundColor Cyan
az webapp cors add --name $webAppName --resource-group $ResourceGroup --allowed-origins "*"


# 5. Create Static Web App for Frontend
$staticWebAppName = "tkd-hub-frontend-$(Get-Random -Minimum 1000 -Maximum 9999)"
$swaRegions = @("Central US", "East US 2", "West US 2")


foreach ($swaRegion in $swaRegions) {
    Write-Host "Trying to create Static Web App in $swaRegion..." -ForegroundColor Cyan
    az staticwebapp create --name $staticWebAppName --resource-group $ResourceGroup --location $swaRegion --source "https://github.com/nicolassnider/TKD_Hub_API" --branch "master" --app-location "/frontend/tkd_hub_web" --api-location "/src/TKDHubAPI.Functions" --output-location "dist"
   
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Static Web App created successfully in ${swaRegion}: $staticWebAppName" -ForegroundColor Green
       
        # Get Static Web App deployment token
        Write-Host "Getting Static Web App deployment token..." -ForegroundColor DarkCyan
        $swaDeploymentToken = az staticwebapp secrets list --name $staticWebAppName --resource-group $ResourceGroup --query "properties.apiKey" -o tsv
       
        # Save deployment token to file
        $swaDeploymentToken | Out-File -FilePath "staticwebapp-deployment-token.txt" -Encoding UTF8
        break
       
    } else {
        Write-Host "Failed to create Static Web App in $swaRegion, trying next region..." -ForegroundColor Yellow
    }
}


if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to create Static Web App in any region" -ForegroundColor Yellow
    Write-Host "You can create it manually later or skip this step for now" -ForegroundColor Yellow
}


# Get publish profiles for GitHub Actions
Write-Host "Getting publish profiles for CI/CD..." -ForegroundColor Cyan


# Get WebAPI publish profile
Write-Host "Getting WebAPI publish profile..." -ForegroundColor DarkCyan
$webApiPublishProfile = az webapp deployment list-publishing-profiles --name $webAppName --resource-group $ResourceGroup --xml


# Save publish profiles to files (without displaying secrets)
$webApiPublishProfile | Out-File -FilePath "webapi-publish-profile.xml" -Encoding UTF8


Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Web App API URL: https://$webAppName.azurewebsites.net" -ForegroundColor Yellow
Write-Host "Static Web App: $staticWebAppName" -ForegroundColor Yellow
Write-Host "SQL Server: $sqlServerName.database.windows.net" -ForegroundColor Yellow
Write-Host "Database: $databaseName" -ForegroundColor Yellow
Write-Host "Storage Account: $storageAccountName" -ForegroundColor Yellow


Write-Host "`nPublish profiles and secrets saved to files:" -ForegroundColor Cyan
Write-Host "1. WebAPI Publish Profile: webapi-publish-profile.xml" -ForegroundColor White
Write-Host "2. Static Web App Token: staticwebapp-deployment-token.txt" -ForegroundColor White


Write-Host "`nGitHub Secrets to add:" -ForegroundColor Cyan
Write-Host "1. AZURE_WEBAPP_PUBLISH_PROFILE (from webapi-publish-profile.xml)" -ForegroundColor White
Write-Host "2. AZURE_STATIC_WEB_APPS_API_TOKEN (from staticwebapp-deployment-token.txt)" -ForegroundColor White


Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Add the secrets to GitHub repository settings" -ForegroundColor White
Write-Host "2. Push your code to trigger the GitHub Actions deployment" -ForegroundColor White
Write-Host "3. Configure your database schema using Entity Framework migrations" -ForegroundColor White


Write-Host "`nTo view secrets (be careful with these):" -ForegroundColor Yellow
Write-Host "Get-Content webapi-publish-profile.xml" -ForegroundColor Gray
Write-Host "Get-Content staticwebapp-deployment-token.txt" -ForegroundColor Gray


