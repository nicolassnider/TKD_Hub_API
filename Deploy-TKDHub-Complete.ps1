# =============================================================================
# TKD Hub - Complete Azure Deployment Script
# Deploys: Azure Functions API + Static Web App + Services + Secrets
# =============================================================================


param(
    [Parameter(Mandatory = $true)]
    [string]$ResourceGroupName,
   
    [Parameter(Mandatory = $true)]
    [string]$Location = "East US",
   
    [Parameter(Mandatory = $true)]
    [string]$AppName,
   
    [Parameter(Mandatory = $false)]
    [string]$SqlAdminPassword,
   
    [Parameter(Mandatory = $false)]
    [string]$SubscriptionId,
   
    [Parameter(Mandatory = $false)]
    [switch]$SkipBuild,
   
    [Parameter(Mandatory = $false)]
    [switch]$Preview
)


# Import required modules
Import-Module Az -Force
Import-Module Az.Websites -Force
Import-Module Az.Storage -Force
Import-Module Az.KeyVault -Force


# Configuration
$ErrorActionPreference = "Stop"
$config = @{
    ResourceGroup = $ResourceGroupName
    Location = $Location
    AppName = $AppName
    WebAppName = "$AppName-api"
    StaticWebAppName = "$AppName-swa"
    StorageAccountName = ($AppName -replace '[^a-zA-Z0-9]', '').ToLower() + "storage"
    KeyVaultName = "$AppName-kv"
    SqlServerName = "$AppName-sql"
    SqlDatabaseName = "TKDHubDb"
    ApplicationInsightsName = "$AppName-ai"
    SqlAdminUser = "tkdhubadmin"
}


Write-Host "🚀 Starting TKD Hub Complete Deployment" -ForegroundColor Green
Write-Host "Configuration:" -ForegroundColor Yellow
$config | Format-Table -AutoSize


# Function to check if user is logged in to Azure
function Test-AzureLogin {
    try {
        $context = Get-AzContext
        if ($null -eq $context) {
            Write-Host "❌ Not logged in to Azure. Please run 'Connect-AzAccount'" -ForegroundColor Red
            return $false
        }
        Write-Host "✅ Logged in as: $($context.Account.Id)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Not logged in to Azure. Please run 'Connect-AzAccount'" -ForegroundColor Red
        return $false
    }
}


# Function to set subscription
function Set-AzureSubscription {
    if ($SubscriptionId) {
        Write-Host "🔄 Setting subscription to: $SubscriptionId" -ForegroundColor Yellow
        Set-AzContext -SubscriptionId $SubscriptionId
    }
    else {
        $subscription = Get-AzSubscription | Select-Object -First 1
        Write-Host "🔄 Using subscription: $($subscription.Name)" -ForegroundColor Yellow
        Set-AzContext -SubscriptionId $subscription.Id
    }
}


# Function to create or update resource group
function New-ResourceGroupIfNotExists {
    Write-Host "🔄 Checking Resource Group: $($config.ResourceGroup)" -ForegroundColor Yellow
   
    $rg = Get-AzResourceGroup -Name $config.ResourceGroup -ErrorAction SilentlyContinue
    if ($null -eq $rg) {
        Write-Host "➡️ Creating Resource Group: $($config.ResourceGroup)" -ForegroundColor Yellow
        New-AzResourceGroup -Name $config.ResourceGroup -Location $config.Location
        Write-Host "✅ Resource Group created" -ForegroundColor Green
    }
    else {
        Write-Host "✅ Resource Group exists" -ForegroundColor Green
    }
}


# Function to generate secure password
function New-SecurePassword {
    param([int]$Length = 16)
   
    $chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*"
    $password = ""
    for ($i = 0; $i -lt $Length; $i++) {
        $password += $chars[(Get-Random -Maximum $chars.Length)]
    }
    return $password
}


# Function to deploy infrastructure
function Deploy-Infrastructure {
    Write-Host "🏗️ Deploying Infrastructure..." -ForegroundColor Yellow
   
    # Generate SQL password if not provided
    if (-not $SqlAdminPassword) {
        $SqlAdminPassword = New-SecurePassword -Length 20
        Write-Host "🔑 Generated SQL password (save this): $SqlAdminPassword" -ForegroundColor Magenta
    }
   
    # Deploy Bicep template
    $templatePath = Join-Path $PSScriptRoot "infra\main.bicep"
    if (Test-Path $templatePath) {
        Write-Host "➡️ Deploying Bicep template..." -ForegroundColor Yellow
       
        $deploymentParams = @{
            appName = $config.AppName
            location = $config.Location
            sqlAdminLogin = $config.SqlAdminUser
            sqlAdminPassword = (ConvertTo-SecureString $SqlAdminPassword -AsPlainText -Force)
        }
       
        if ($Preview) {
            Write-Host "🔍 Preview mode - showing what-if analysis..." -ForegroundColor Cyan
            New-AzResourceGroupDeployment `
                -ResourceGroupName $config.ResourceGroup `
                -TemplateFile $templatePath `
                -TemplateParameterObject $deploymentParams `
                -WhatIf
            return
        }
       
        $deployment = New-AzResourceGroupDeployment `
            -ResourceGroupName $config.ResourceGroup `
            -TemplateFile $templatePath `
            -TemplateParameterObject $deploymentParams `
            -Verbose
           
        Write-Host "✅ Infrastructure deployed successfully" -ForegroundColor Green
        return $deployment.Outputs
    }
    else {
        Write-Host "⚠️ Bicep template not found. Creating resources manually..." -ForegroundColor Yellow
        Deploy-ResourcesManually -SqlPassword $SqlAdminPassword
    }
}


# Function to deploy resources manually if Bicep template doesn't exist
function Deploy-ResourcesManually {
    param([string]$SqlPassword)
   
    Write-Host "🔄 Creating Storage Account..." -ForegroundColor Yellow
    $storageAccount = New-AzStorageAccount `
        -ResourceGroupName $config.ResourceGroup `
        -Name $config.StorageAccountName `
        -Location $config.Location `
        -SkuName "Standard_LRS" `
        -Kind "StorageV2"
   
    Write-Host "🔄 Creating Application Insights..." -ForegroundColor Yellow
    $appInsights = New-AzApplicationInsights `
        -ResourceGroupName $config.ResourceGroup `
        -Name $config.ApplicationInsightsName `
        -Location $config.Location
   
    Write-Host "🔄 Creating Key Vault..." -ForegroundColor Yellow
    $keyVault = New-AzKeyVault `
        -ResourceGroupName $config.ResourceGroup `
        -VaultName $config.KeyVaultName `
        -Location $config.Location `
        -EnabledForDeployment `
        -EnabledForTemplateDeployment
   
    Write-Host "🔄 Creating SQL Server..." -ForegroundColor Yellow
    $sqlCredential = New-Object System.Management.Automation.PSCredential ($config.SqlAdminUser, (ConvertTo-SecureString $SqlPassword -AsPlainText -Force))
    $sqlServer = New-AzSqlServer `
        -ResourceGroupName $config.ResourceGroup `
        -ServerName $config.SqlServerName `
        -Location $config.Location `
        -SqlAdministratorCredentials $sqlCredential
   
    Write-Host "🔄 Creating SQL Database..." -ForegroundColor Yellow
    $sqlDatabase = New-AzSqlDatabase `
        -ResourceGroupName $config.ResourceGroup `
        -ServerName $config.SqlServerName `
        -DatabaseName $config.SqlDatabaseName `
        -RequestedServiceObjectiveName "Basic"
   
    # Allow Azure services to access SQL Server
    New-AzSqlServerFirewallRule `
        -ResourceGroupName $config.ResourceGroup `
        -ServerName $config.SqlServerName `
        -FirewallRuleName "AllowAzureServices" `
        -StartIpAddress "0.0.0.0" `
        -EndIpAddress "0.0.0.0"
   
    Write-Host "🔄 Creating App Service Plan..." -ForegroundColor Yellow
    $appServicePlan = New-AzAppServicePlan `
        -ResourceGroupName $config.ResourceGroup `
        -Name "$($config.AppName)-asp" `
        -Location $config.Location `
        -Tier "Basic" `
        -NumberofWorkers 1 `
        -WorkerSize "Small" `
        -Linux
   
    Write-Host "🔄 Creating Web App..." -ForegroundColor Yellow
    $webApp = New-AzWebApp `
        -ResourceGroupName $config.ResourceGroup `
        -Name $config.WebAppName `
        -Location $config.Location `
        -AppServicePlan "$($config.AppName)-asp"
   
    Write-Host "✅ Resources created manually" -ForegroundColor Green
}


# Function to configure secrets in Key Vault
function Set-KeyVaultSecrets {
    Write-Host "🔐 Configuring Key Vault secrets..." -ForegroundColor Yellow
   
    $connectionString = "Server=tcp:$($config.SqlServerName).database.windows.net,1433;Initial Catalog=$($config.SqlDatabaseName);Persist Security Info=False;User ID=$($config.SqlAdminUser);Password=$SqlAdminPassword;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
   
    # Store connection string
    Set-AzKeyVaultSecret -VaultName $config.KeyVaultName -Name "ConnectionStrings--DefaultConnection" -SecretValue (ConvertTo-SecureString $connectionString -AsPlainText -Force)
   
    # Store Application Insights connection string
    $appInsights = Get-AzApplicationInsights -ResourceGroupName $config.ResourceGroup -Name $config.ApplicationInsightsName
    Set-AzKeyVaultSecret -VaultName $config.KeyVaultName -Name "APPLICATIONINSIGHTS-CONNECTION-STRING" -SecretValue (ConvertTo-SecureString $appInsights.ConnectionString -AsPlainText -Force)
   
    Write-Host "✅ Secrets configured in Key Vault" -ForegroundColor Green
}


# Function to configure Web App settings
function Set-WebAppConfiguration {
    Write-Host "⚙️ Configuring Web App settings..." -ForegroundColor Yellow
   
    $keyVaultUri = "https://$($config.KeyVaultName).vault.azure.net/"
   
    # Enable System Managed Identity for Web App
    $webApp = Get-AzWebApp -ResourceGroupName $config.ResourceGroup -Name $config.WebAppName
    Set-AzWebApp -ResourceGroupName $config.ResourceGroup -Name $config.WebAppName -AssignIdentity $true
   
    # Grant Key Vault access to Web App
    $principalId = (Get-AzWebApp -ResourceGroupName $config.ResourceGroup -Name $config.WebAppName).Identity.PrincipalId
    Set-AzKeyVaultAccessPolicy -VaultName $config.KeyVaultName -ObjectId $principalId -PermissionsToSecrets Get, List
   
    # Configure app settings to use Key Vault references
    $appSettings = @{
        "ASPNETCORE_ENVIRONMENT" = "Production"
        "ConnectionStrings__DefaultConnection" = "@Microsoft.KeyVault(VaultName=$($config.KeyVaultName);SecretName=ConnectionStrings--DefaultConnection)"
        "APPLICATIONINSIGHTS_CONNECTION_STRING" = "@Microsoft.KeyVault(VaultName=$($config.KeyVaultName);SecretName=APPLICATIONINSIGHTS-CONNECTION-STRING)"
    }
   
    Set-AzWebApp -ResourceGroupName $config.ResourceGroup -Name $config.WebAppName -AppSettings $appSettings
   
    Write-Host "✅ Web App configured" -ForegroundColor Green
}


# Function to build and deploy Web API
function Deploy-WebAPI {
    Write-Host "🔄 Building and deploying Web API..." -ForegroundColor Yellow
   
    if (-not $SkipBuild) {
        # Build the project
        Write-Host "➡️ Building .NET project..." -ForegroundColor Yellow
        $webApiPath = Join-Path $PSScriptRoot "src\TKDHubAPI.WebAPI"
       
        Push-Location $webApiPath
        try {
            & dotnet clean --configuration Release
            & dotnet publish --configuration Release --output ".\publish"
           
            if ($LASTEXITCODE -ne 0) {
                throw "Build failed"
            }
           
            Write-Host "✅ Build completed" -ForegroundColor Green
           
            # Create deployment package
            $publishPath = Join-Path $webApiPath "publish"
            $zipPath = Join-Path $webApiPath "web-app.zip"
           
            if (Test-Path $zipPath) {
                Remove-Item $zipPath -Force
            }
           
            Compress-Archive -Path "$publishPath\*" -DestinationPath $zipPath -Force
            Write-Host "✅ Deployment package created" -ForegroundColor Green
           
            # Deploy to Azure
            Write-Host "➡️ Deploying to Azure Web App..." -ForegroundColor Yellow
            Publish-AzWebApp -ResourceGroupName $config.ResourceGroup -Name $config.WebAppName -ArchivePath $zipPath -Force
           
            Write-Host "✅ Web API deployed successfully" -ForegroundColor Green
        }
        finally {
            Pop-Location
        }
    }
    else {
        Write-Host "⏭️ Skipping build and deployment (SkipBuild flag set)" -ForegroundColor Yellow
    }
}


# Function to create and deploy Static Web App
function Deploy-StaticWebApp {
    Write-Host "🔄 Creating Static Web App..." -ForegroundColor Yellow
   
    # Check if Static Web App exists
    $swa = Get-AzStaticWebApp -ResourceGroupName $config.ResourceGroup -Name $config.StaticWebAppName -ErrorAction SilentlyContinue
   
    if ($null -eq $swa) {
        Write-Host "➡️ Creating new Static Web App..." -ForegroundColor Yellow
        $swa = New-AzStaticWebApp -ResourceGroupName $config.ResourceGroup -Name $config.StaticWebAppName -Location $config.Location -SkuName "Free"
    }
    else {
        Write-Host "✅ Static Web App already exists" -ForegroundColor Green
    }
   
    # Get deployment token for Static Web App
    $deploymentToken = Get-AzStaticWebAppSecret -ResourceGroupName $config.ResourceGroup -Name $config.StaticWebAppName
   
    Write-Host "🔑 Static Web App Deployment Token: $($deploymentToken.Properties.ApiKey)" -ForegroundColor Magenta
    Write-Host "💡 Use this token in your GitHub Actions or Azure DevOps pipeline" -ForegroundColor Cyan
   
    # Build and deploy SPA if not skipping build
    if (-not $SkipBuild) {
        Write-Host "➡️ Building SPA..." -ForegroundColor Yellow
        $spaPath = Join-Path $PSScriptRoot "frontend\spa"
       
        Push-Location $spaPath
        try {
            & npm ci
            & npm run build
           
            if ($LASTEXITCODE -ne 0) {
                throw "SPA build failed"
            }
           
            Write-Host "✅ SPA build completed" -ForegroundColor Green
        }
        finally {
            Pop-Location
        }
    }
   
    Write-Host "💡 To deploy your SPA, use the deployment token with Static Web Apps CLI:" -ForegroundColor Cyan
    Write-Host "   npm install -g @azure/static-web-apps-cli" -ForegroundColor Gray
    Write-Host "   swa deploy ./frontend/spa/dist --deployment-token '$($deploymentToken.Properties.ApiKey)'" -ForegroundColor Gray
}


# Function to display deployment summary
function Show-DeploymentSummary {
    Write-Host ""
    Write-Host "🎉 Deployment Summary" -ForegroundColor Green
    Write-Host "=====================" -ForegroundColor Green
    Write-Host "Resource Group: $($config.ResourceGroup)" -ForegroundColor White
    Write-Host "Web API: https://$($config.WebAppName).azurewebsites.net" -ForegroundColor White
    Write-Host "Static Web App: https://$($config.StaticWebAppName).azurestaticapps.net" -ForegroundColor White
    Write-Host "Key Vault: https://$($config.KeyVaultName).vault.azure.net" -ForegroundColor White
    Write-Host "SQL Server: $($config.SqlServerName).database.windows.net" -ForegroundColor White
    Write-Host ""
    Write-Host "🔄 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Configure your GitHub repository secrets with the Static Web App deployment token"
    Write-Host "2. Set up CI/CD pipeline using the provided YAML files"
    Write-Host "3. Run database migrations against the Azure SQL Database"
    Write-Host "4. Test your deployed applications"
    Write-Host ""
    Write-Host "📋 Useful Commands:" -ForegroundColor Cyan
    Write-Host "   # Test Web API"
    Write-Host "   Invoke-RestMethod -Uri 'https://$($config.WebAppName).azurewebsites.net/api/health'"
    Write-Host ""
    Write-Host "   # View Web App logs"
    Write-Host "   az webapp log tail --name $($config.WebAppName) --resource-group $($config.ResourceGroup)"
}


# Main execution
try {
    # Validate prerequisites
    if (-not (Test-AzureLogin)) {
        exit 1
    }
   
    Set-AzureSubscription
    New-ResourceGroupIfNotExists
   
    # Deploy infrastructure
    $deploymentOutputs = Deploy-Infrastructure
   
    if (-not $Preview) {
        # Configure services
        Set-KeyVaultSecrets
        Set-WebAppConfiguration
       
        # Deploy applications
        Deploy-WebAPI
        Deploy-StaticWebApp
       
        # Show summary
        Show-DeploymentSummary
    }
    else {
        Write-Host "🔍 Preview completed. Run without -Preview flag to execute deployment." -ForegroundColor Cyan
    }
}
catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Stack trace: $($_.ScriptStackTrace)" -ForegroundColor Red
    exit 1
}
