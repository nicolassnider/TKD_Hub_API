# Azure Deployment Guide - TKD Hub API


This guide provides step-by-step instructions for deploying the TKD Hub API application to Microsoft Azure with **ultra-low-cost optimization**.


## 🚀 Quick Start - Copy & Run Complete Script


**For fastest deployment, jump to the [Complete Deployment Script](#complete-deployment-script-all-steps-combined) section and run the PowerShell script.**


## 💰 Cost Summary


| Deployment Type | Monthly Cost | Components |
|----------------|--------------|------------|
| **Ultra-Low-Cost** (Recommended) | **$5-15** | Static Web Apps (FREE) + SQL Serverless ($5-15) + SignalR (FREE) |
| Standard Budget | $19-25 | App Services ($13) + SQL Basic ($5) + SignalR (FREE) |
| Enterprise | $80-150+ | Premium tiers with enhanced features |


## ⚡ Ultra-Low-Cost Features


- ✅ **Azure Static Web Apps**: FREE hosting for React SPA + Azure Functions API
- ✅ **SQL Database Serverless**: Auto-pause when not in use ($5-15/month)
- ✅ **SignalR Service**: FREE tier (up to 20 connections)
- ✅ **GitHub CI/CD**: Automatic deployments
- ✅ **SSL & Custom Domains**: FREE
- ✅ **94% cost reduction** compared to traditional hosting


## Table of Contents
- [Prerequisites](#prerequisites)
- [Azure Services Overview](#azure-services-overview)
- [Deployment Architecture](#deployment-architecture)
- [Step-by-Step Deployment](#step-by-step-deployment)
- [Configuration](#configuration)
- [Post-Deployment](#post-deployment)
- [Cost Optimization](#cost-optimization)
- [Troubleshooting](#troubleshooting)


## Prerequisites


### Required Tools
- Azure CLI installed and configured
- Azure subscription with appropriate permissions
- .NET 8.0 SDK
- Node.js 18+ for React frontend
- SQL Server Management Studio (optional)


### Required Accounts
- Microsoft Azure subscription
- MercadoPago developer account (for payments)


## Azure Services Overview


### Ultra-Low-Cost Solution (Recommended for Start-ups)


| Service | Purpose | Tier | Est. Monthly Cost |
|---------|---------|------|-------------------|
| **Azure Static Web Apps** | Host React SPA + API | Free | $0 |
| **Azure SQL Database** | Application database | Serverless (0.5 vCore) | $5-15/month* |
| **Azure SignalR Service** | Real-time notifications | Free | $0 |
| **Azure Key Vault** | Secrets management | Standard | $0.03/operation |
| **Application Insights** | Monitoring & analytics | Free tier (5GB) | $0 |


**Total Ultra-Low Cost: ~$5-20/month***


*Cost varies based on database usage - can be as low as $5/month with minimal usage


### Standard Budget Solution (Production Ready)


| Service | Purpose | Tier | Est. Monthly Cost |
|---------|---------|------|-------------------|
| **App Service Plan** | Host web applications | Basic B1 | $13 |
| **App Service (API)** | ASP.NET Core Web API | - | Included in plan |
| **Azure Static Web Apps** | React SPA hosting | Free | $0 |
| **Azure SQL Database** | Application database | Basic | $5 |
| **Azure SignalR Service** | Real-time notifications | Free | $0 |
| **Azure Key Vault** | Secrets management | Standard | $1 |
| **Application Insights** | Monitoring & analytics | Free tier | $0 |


**Total Budget Cost: ~$19/month**


### Optional Services (Recommended)


| Service | Purpose | Tier | Est. Monthly Cost |
|---------|---------|------|-------------------|
| **Azure Storage Account** | File uploads, static hosting | Standard LRS | $10 |
| **Azure CDN** | Global content delivery | Standard | $15 |
| **Azure API Management** | API gateway, rate limiting | Developer | $50 |
| **Azure Functions** | Background processing | Consumption | $5 |


## Deployment Architecture


```
Internet
    ↓
Azure Front Door (Optional)
    ↓
App Service (React SPA) ←→ App Service (ASP.NET Core API)
    ↓                           ↓
Azure CDN (Optional)        Azure SQL Database
    ↓                           ↓
Azure Storage               Azure SignalR Service
    ↓                           ↓
Azure Key Vault ←→ Application Insights
```


## Ultra-Low-Cost Deployment Strategy


### Option 1: Azure Static Web Apps (FREE Hosting)


**Perfect for MVPs and early-stage applications**


Azure Static Web Apps provides:
- ✅ FREE hosting for React frontend
- ✅ FREE Azure Functions backend (500K requests/month)
- ✅ FREE custom domains and SSL
- ✅ Built-in CI/CD from GitHub
- ✅ FREE authentication (social logins)


### Deployment Architecture (Ultra-Low-Cost)


```
GitHub Repository
    ↓ (Automatic CI/CD)
Azure Static Web Apps (FREE)
├── React SPA Frontend (FREE)
├── Azure Functions API (FREE up to 500K requests)
└── Authentication (FREE)
    ↓
Azure SQL Database Serverless (~$5-15/month)
    ↓
Azure SignalR Service (FREE tier)
```


### Cost Breakdown (Ultra-Low-Cost)


| Component | Service | Cost |
|-----------|---------|------|
| **Frontend Hosting** | Azure Static Web Apps | FREE |
| **API Hosting** | Azure Functions (Consumption) | FREE (up to 500K requests) |
| **Database** | Azure SQL Serverless (0.5 vCore) | $5-15/month |
| **Real-time** | Azure SignalR Service (Free) | FREE |
| **Authentication** | Static Web Apps Auth | FREE |
| **CI/CD** | GitHub Actions | FREE |
| **SSL & Domain** | Static Web Apps | FREE |
| **Monitoring** | Application Insights (5GB) | FREE |


**Total Monthly Cost: $5-15** 🎉


### When to Use Ultra-Low-Cost vs Budget Solution


**Use Ultra-Low-Cost ($5-15/month) when:**
- ⭐ MVP or prototype stage
- ⭐ Low traffic (<100K requests/month)
- ⭐ Team size <5 users
- ⭐ Simple API operations
- ⭐ Learning/experimental project


**Upgrade to Budget Solution ($19/month) when:**
- 🚀 Growing user base (>100K requests/month)
- 🚀 Need more consistent performance
- 🚀 Complex background processing
- 🚀 Production-critical application
- 🚀 Need dedicated compute resources


## Step-by-Step Deployment


### Ultra-Low-Cost Deployment (Azure Static Web Apps + Functions)


⚠️ **IMPORTANT**: Execute these steps in **EXACT ORDER**. Each step depends on the previous ones.


#### Step 1: Prerequisites and Setup


**1.1 Verify Required Tools**
```powershell
# Check Azure CLI
az --version


# Check .NET SDK
dotnet --version


# Check Node.js
node --version


# Check Azure Functions Core Tools
func --version
```


**1.2 Login to Azure**
```powershell
# Login to Azure (opens browser)
az login


# Verify subscription
az account show --query "name" -o tsv
```


**1.3 Set Global Variables**
```powershell
# Set these variables - they will be used throughout the deployment
$resourceGroup = "tkd-hub-rg"
$location = "Central US"  # Primary recommendation
$sqlServerName = "tkd-hub-sql-$(Get-Random)"
$sqlDbName = "TKDHubDb"
$sqlAdminUser = "tkdhub-admin"
$sqlAdminPassword = "SecurePassword123!"
$signalRName = "tkd-hub-signalr-$(Get-Random)"
$staticWebAppName = "tkd-hub-app-$(Get-Random)"
$githubRepo = "nicolassnider/TKD_Hub_API"  # Replace with your actual GitHub repo


# Display variables for confirmation
Write-Host "🔧 Deployment Configuration:"
Write-Host "Resource Group: $resourceGroup"
Write-Host "Location: $location"
Write-Host "SQL Server: $sqlServerName"
Write-Host "SignalR: $signalRName"
Write-Host "Static Web App: $staticWebAppName"
Write-Host "GitHub Repo: $githubRepo"
```


#### Step 2: Create Resource Group


```powershell
# Create resource group
Write-Host "📂 Creating resource group..."
az group create --name $resourceGroup --location $location


# Verify creation
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Resource group created successfully"
    az group show --name $resourceGroup --query "location" -o tsv
} else {
    Write-Host "❌ Failed to create resource group"
    # Try alternative regions if Central US fails
    Write-Host "🔄 Trying alternative regions..."
    $alternativeLocations = @("West US 2", "South Central US", "East US 2")
    foreach ($altLocation in $alternativeLocations) {
        Write-Host "Trying: $altLocation"
        $location = $altLocation
        az group create --name $resourceGroup --location $location
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Resource group created in $location"
            break
        }
    }
}
```


#### Step 3: Create Azure SQL Database (Serverless - Ultra Cheap)


```powershell
Write-Host "🗄️ Creating SQL Server and Database..."


# Create SQL Server
Write-Host "Creating SQL Server: $sqlServerName"
az sql server create `
  --name $sqlServerName `
  --resource-group $resourceGroup `
  --location $location `
  --admin-user $sqlAdminUser `
  --admin-password $sqlAdminPassword


# Verify SQL Server creation
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SQL Server created successfully"
   
    # Create SERVERLESS SQL Database (auto-pause when not in use)
    Write-Host "Creating serverless database: $sqlDbName"
    az sql db create `
      --resource-group $resourceGroup `
      --server $sqlServerName `
      --name $sqlDbName `
      --edition GeneralPurpose `
      --compute-model Serverless `
      --family Gen5 `
      --capacity 1 `
      --auto-pause-delay 60
   
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database created successfully"
       
        # Configure firewall to allow Azure services
        Write-Host "Configuring firewall rules..."
        az sql server firewall-rule create `
          --resource-group $resourceGroup `
          --server $sqlServerName `
          --name "AllowAzureServices" `
          --start-ip-address 0.0.0.0 `
          --end-ip-address 0.0.0.0
       
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Firewall configured successfully"
            Write-Host "📊 Database Details:"
            Write-Host "   Server: $sqlServerName.database.windows.net"
            Write-Host "   Database: $sqlDbName"
            Write-Host "   Edition: Serverless (0.5 vCore, auto-pause after 60 min)"
            Write-Host "   💰 Estimated Cost: $5-15/month"
        } else {
            Write-Host "❌ Failed to configure firewall"
        }
    } else {
        Write-Host "❌ Failed to create database"
    }
} else {
    Write-Host "❌ Failed to create SQL Server"
    Write-Host "💡 Try a different region or check naming conflicts"
}
```


#### Step 4: Create SignalR Service (FREE Tier)


```powershell
Write-Host "📡 Creating SignalR Service..."


# Create SignalR Service with FREE tier
Write-Host "Creating SignalR Service: $signalRName"
az signalr create `
  --name $signalRName `
  --resource-group $resourceGroup `
  --location $location `
  --sku Free_F1 `
  --unit-count 1 `
  --service-mode Serverless


# Verify SignalR creation
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SignalR Service created successfully"
   
    # Get connection string for later use
    Write-Host "📋 Retrieving SignalR connection string..."
    $signalRConnectionString = az signalr key list `
      --name $signalRName `
      --resource-group $resourceGroup `
      --query primaryConnectionString -o tsv
   
    if ($signalRConnectionString) {
        Write-Host "✅ SignalR connection string retrieved"
        Write-Host "📊 SignalR Details:"
        Write-Host "   Service: $signalRName.service.signalr.net"
        Write-Host "   Mode: Serverless (FREE tier)"
        Write-Host "   💰 Cost: FREE (up to 20 connections)"
    } else {
        Write-Host "⚠️ SignalR created but connection string retrieval failed"
        Write-Host "💡 You can get it later from Azure Portal"
    }
} else {
    Write-Host "❌ Failed to create SignalR Service"
}
```


#### Step 5: Setup Azure Functions Project (Local Development)


```powershell
Write-Host "⚡ Setting up Azure Functions project..."


# Navigate to project root and create Azure Functions directory
Write-Host "Creating Azure Functions project structure..."
if (-not (Test-Path "AzureFunctions")) {
    New-Item -ItemType Directory -Path "AzureFunctions"
    Write-Host "✅ Created AzureFunctions directory"
}


Set-Location "AzureFunctions"


# Initialize Functions project
Write-Host "Initializing Functions project..."
if (-not (Test-Path "TKDHubFunctions")) {
    func init TKDHubFunctions --dotnet --target-framework net8.0
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Azure Functions project initialized"
       
        # Navigate to Functions project
        Set-Location "TKDHubFunctions"
       
        # Add required packages
        Write-Host "Adding required NuGet packages..."
        dotnet add package Microsoft.Azure.Functions.Extensions
        dotnet add package Microsoft.EntityFrameworkCore.SqlServer
        dotnet add package Microsoft.Azure.SignalR.Management
        dotnet add package Microsoft.EntityFrameworkCore.Tools
        dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
        dotnet add package System.IdentityModel.Tokens.Jwt
       
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ NuGet packages added successfully"
            Write-Host "📦 Azure Functions Project Ready!"
            Write-Host "📂 Location: .\AzureFunctions\TKDHubFunctions"
        } else {
            Write-Host "❌ Failed to add NuGet packages"
        }
    } else {
        Write-Host "❌ Failed to initialize Functions project"
    }
} else {
    Write-Host "⚠️ Functions project already exists"
}


# Return to project root
Set-Location "..\..\"
```


#### Step 6: Create Static Web App with GitHub Integration


```powershell
Write-Host "🌐 Creating Azure Static Web App..."


# Create Static Web App with GitHub integration
Write-Host "Creating Static Web App: $staticWebAppName"
Write-Host "GitHub Repository: $githubRepo"


az staticwebapp create `
    --name $staticWebAppName `
    --resource-group $resourceGroup `
    --source "https://github.com/$githubRepo" `
    --location $location `
    --branch "master" `
    --app-location "/frontend/spa" `
    --api-location "/AzureFunctions/TKDHubFunctions" `
    --output-location "dist" `
    --login-with-github


# Verify Static Web App creation
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Static Web App created successfully"
   
    # Get the default hostname
    Write-Host "📋 Retrieving Static Web App URL..."
    $staticWebAppUrl = az staticwebapp show `
      --name $staticWebAppName `
      --resource-group $resourceGroup `
      --query "defaultHostname" -o tsv
   
    if ($staticWebAppUrl) {
        Write-Host "✅ Static Web App deployed successfully"
        Write-Host "📊 Static Web App Details:"
        Write-Host "   Name: $staticWebAppName"
        Write-Host "   URL: https://$staticWebAppUrl"
        Write-Host "   GitHub: $githubRepo (master branch)"
        Write-Host "   Frontend: /frontend/spa"
        Write-Host "   API: /AzureFunctions/TKDHubFunctions"
        Write-Host "   💰 Cost: FREE (includes SSL, custom domains, CI/CD)"
    } else {
        Write-Host "⚠️ Static Web App created but URL retrieval failed"
        Write-Host "💡 Check Azure Portal for the URL"
    }
} else {
    Write-Host "❌ Failed to create Static Web App"
    Write-Host "💡 Check that GitHub repo URL is correct and accessible"
}
```


#### Step 7: Configure Application Settings (Critical Step)


```powershell
Write-Host "⚙️ Configuring Application Settings..."


# Build connection strings
$sqlConnectionString = "Server=tcp:$sqlServerName.database.windows.net,1433;Initial Catalog=$sqlDbName;Persist Security Info=False;User ID=$sqlAdminUser;Password=$sqlAdminPassword;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"


Write-Host "📋 Retrieving SignalR connection string..."
$signalRConnectionString = az signalr key list `
  --name $signalRName `
  --resource-group $resourceGroup `
  --query primaryConnectionString -o tsv


if ($signalRConnectionString) {
    Write-Host "✅ SignalR connection string retrieved"
   
    # Configure Static Web App settings
    Write-Host "🔧 Configuring Static Web App application settings..."
    az staticwebapp appsettings set `
      --name $staticWebAppName `
      --setting-names "DefaultConnection=$sqlConnectionString" `
                      "SignalRConnectionString=$signalRConnectionString" `
                      "Jwt__SecretKey=YourJWTSecretKey-MustBe256BitsLong-ChangeThisInProduction!" `
                      "Jwt__Issuer=https://$staticWebAppName.azurestaticapps.net" `
                      "Jwt__Audience=https://$staticWebAppName.azurestaticapps.net" `
                      "MercadoPago__AccessToken=YOUR_MERCADOPAGO_TOKEN" `
                      "MercadoPago__PublicKey=YOUR_MERCADOPAGO_PUBLIC_KEY" `
                      "ASPNETCORE_ENVIRONMENT=Production"
   
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Application settings configured successfully"
        Write-Host "📊 Configuration Summary:"
        Write-Host "   ✅ Database connection configured"
        Write-Host "   ✅ SignalR connection configured"
        Write-Host "   ✅ JWT settings configured"
        Write-Host "   ⚠️ MercadoPago tokens need manual update"
        Write-Host ""
        Write-Host "🔐 SECURITY REMINDER:"
        Write-Host "   • Change JWT secret key in production"
        Write-Host "   • Update MercadoPago tokens with real values"
        Write-Host "   • Consider using Azure Key Vault for secrets"
    } else {
        Write-Host "❌ Failed to configure application settings"
    }
} else {
    Write-Host "❌ Failed to retrieve SignalR connection string"
    Write-Host "💡 Configure settings manually in Azure Portal (see STEP8_CONFIGURATION_GUIDE.md)"
}
```


#### Step 8: Verify Deployment


```powershell
Write-Host "🔍 Verifying deployment..."


# Check resource group
Write-Host "📂 Checking resource group..."
az group show --name $resourceGroup --query "location" -o tsv


# Check SQL Database
Write-Host "🗄️ Checking SQL Database..."
az sql db show --resource-group $resourceGroup --server $sqlServerName --name $sqlDbName --query "status" -o tsv


# Check SignalR Service
Write-Host "📡 Checking SignalR Service..."
az signalr show --name $signalRName --resource-group $resourceGroup --query "provisioningState" -o tsv


# Check Static Web App
Write-Host "🌐 Checking Static Web App..."
$finalUrl = az staticwebapp show --name $staticWebAppName --resource-group $resourceGroup --query "defaultHostname" -o tsv


if ($finalUrl) {
    Write-Host ""
    Write-Host "🎉 DEPLOYMENT COMPLETE!"
    Write-Host "═══════════════════════════════════════════"
    Write-Host "📊 Your Ultra-Low-Cost TKD Hub Deployment:"
    Write-Host ""
    Write-Host "🌐 Frontend URL: https://$finalUrl"
    Write-Host "🗄️ Database: $sqlServerName.database.windows.net"
    Write-Host "📡 SignalR: $signalRName.service.signalr.net"
    Write-Host "📂 Resource Group: $resourceGroup"
    Write-Host ""
    Write-Host "💰 Monthly Cost Estimate: $5-15"
    Write-Host "   • Static Web App: FREE"
    Write-Host "   • Azure Functions: FREE (up to 500K requests)"
    Write-Host "   • SignalR Service: FREE"
    Write-Host "   • SQL Database Serverless: $5-15"
    Write-Host ""
    Write-Host "🚀 Next Steps:"
    Write-Host "   1. Update MercadoPago tokens in Azure Portal"
    Write-Host "   2. Generate secure JWT secret key"
    Write-Host "   3. Create Azure Functions (see Step 9)"
    Write-Host "   4. Deploy and test your application"
    Write-Host "═══════════════════════════════════════════"
} else {
    Write-Host "⚠️ Deployment completed with issues - check Azure Portal"
}
```


#### 9. Sample Azure Function (Replace your Controllers)


Create `Functions/AuthFunction.cs`:


```csharp
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;


namespace TKDHubFunctions
{
    public class AuthFunction
    {
        private readonly ILogger _logger;


        public AuthFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<AuthFunction>();
        }


        [Function("Login")]
        public async Task<HttpResponseData> Login(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/login")]
            HttpRequestData req)
        {
            _logger.LogInformation("Login function processed a request.");


            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(new { message = "Login endpoint" });
            return response;
        }


        [Function("Register")]
        public async Task<HttpResponseData> Register(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "auth/register")]
            HttpRequestData req)
        {
            _logger.LogInformation("Register function processed a request.");


            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(new { message = "Register endpoint" });
            return response;
        }
    }
}
```


#### 10. Deploy and Verify


```bash
# Push to GitHub triggers automatic deployment
git add .
git commit -m "Add Azure Functions for ultra-low-cost deployment"
git push origin main


# Check deployment status
az staticwebapp show `
  --name $staticWebAppName `
  --resource-group $resourceGroup `
  --query "defaultHostname" -o tsv
```


## Migration Path: From Standard to Ultra-Low-Cost


### Complete Deployment Script (All Steps Combined)


**Copy and run this complete PowerShell script for automated deployment:**


```powershell
# =============================================================================
# TKD Hub API - Ultra-Low-Cost Azure Deployment Script
# Total Estimated Cost: $5-15/month
# =============================================================================


Write-Host "🚀 Starting TKD Hub API Ultra-Low-Cost Deployment..." -ForegroundColor Green
Write-Host "💰 Target Monthly Cost: $5-15 (94% cost reduction!)" -ForegroundColor Yellow


# Step 1: Verify Prerequisites
Write-Host "`n📋 Step 1: Verifying Prerequisites..." -ForegroundColor Cyan
try {
    az --version | Out-Null
    Write-Host "✅ Azure CLI is installed"
   
    dotnet --version | Out-Null
    Write-Host "✅ .NET SDK is installed"
   
    node --version | Out-Null
    Write-Host "✅ Node.js is installed"
   
    func --version | Out-Null
    Write-Host "✅ Azure Functions Core Tools installed"
} catch {
    Write-Host "❌ Missing prerequisites. Please install required tools." -ForegroundColor Red
    exit 1
}


# Step 2: Set Variables
Write-Host "`n🔧 Step 2: Setting Deployment Variables..." -ForegroundColor Cyan
$resourceGroup = "tkd-hub-rg"
$location = "Central US"
$sqlServerName = "tkd-hub-sql-$(Get-Random)"
$sqlDbName = "TKDHubDb"
$sqlAdminUser = "tkdhub-admin"
$sqlAdminPassword = "SecurePassword123!"
$signalRName = "tkd-hub-signalr-$(Get-Random)"
$staticWebAppName = "tkd-hub-app-$(Get-Random)"
$githubRepo = "nicolassnider/TKD_Hub_API"


Write-Host "Resource Group: $resourceGroup" -ForegroundColor Yellow
Write-Host "Location: $location" -ForegroundColor Yellow
Write-Host "SQL Server: $sqlServerName" -ForegroundColor Yellow


# Step 3: Login to Azure
Write-Host "`n🔐 Step 3: Azure Login..." -ForegroundColor Cyan
az login
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to login to Azure" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Logged in to Azure successfully"


# Step 4: Create Resource Group
Write-Host "`n📂 Step 4: Creating Resource Group..." -ForegroundColor Cyan
az group create --name $resourceGroup --location $location
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Resource group created successfully"
} else {
    Write-Host "❌ Failed to create resource group" -ForegroundColor Red
    exit 1
}


# Step 5: Create SQL Database
Write-Host "`n🗄️ Step 5: Creating SQL Database (Serverless)..." -ForegroundColor Cyan
az sql server create `
  --name $sqlServerName `
  --resource-group $resourceGroup `
  --location $location `
  --admin-user $sqlAdminUser `
  --admin-password $sqlAdminPassword


if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SQL Server created"
   
    az sql db create `
      --resource-group $resourceGroup `
      --server $sqlServerName `
      --name $sqlDbName `
      --edition GeneralPurpose `
      --compute-model Serverless `
      --family Gen5 `
      --capacity 0.5 `
      --auto-pause-delay 60
   
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Serverless database created (0.5 vCore, auto-pause)"
       
        az sql server firewall-rule create `
          --resource-group $resourceGroup `
          --server $sqlServerName `
          --name "AllowAzureServices" `
          --start-ip-address 0.0.0.0 `
          --end-ip-address 0.0.0.0
       
        Write-Host "✅ Firewall configured for Azure services"
    }
}


# Step 6: Create SignalR Service
Write-Host "`n📡 Step 6: Creating SignalR Service (FREE)..." -ForegroundColor Cyan
az signalr create `
  --name $signalRName `
  --resource-group $resourceGroup `
  --location $location `
  --sku Free_F1 `
  --unit-count 1 `
  --service-mode Serverless


if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SignalR Service created (FREE tier)"
}


# Step 7: Setup Azure Functions Project
Write-Host "`n⚡ Step 7: Setting up Azure Functions..." -ForegroundColor Cyan
if (-not (Test-Path "AzureFunctions")) {
    New-Item -ItemType Directory -Path "AzureFunctions"
}
Set-Location "AzureFunctions"


if (-not (Test-Path "TKDHubFunctions")) {
    func init TKDHubFunctions --dotnet --target-framework net8.0
    Set-Location "TKDHubFunctions"
   
    dotnet add package Microsoft.Azure.Functions.Extensions
    dotnet add package Microsoft.EntityFrameworkCore.SqlServer
    dotnet add package Microsoft.Azure.SignalR.Management
   
    Write-Host "✅ Azure Functions project created"
}
Set-Location "..\..\"


# Step 8: Create Static Web App
Write-Host "`n🌐 Step 8: Creating Static Web App..." -ForegroundColor Cyan
az staticwebapp create `
  --name $staticWebAppName `
  --resource-group $resourceGroup `
  --source "https://github.com/$githubRepo" `
  --location $location `
  --branch "master" `
  --app-location "/frontend/spa" `
  --api-location "/AzureFunctions/TKDHubFunctions" `
  --output-location "dist"


if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Static Web App created with GitHub integration"
}


# Step 9: Configure Application Settings
Write-Host "`n⚙️ Step 9: Configuring Application Settings..." -ForegroundColor Cyan
$sqlConnectionString = "Server=tcp:$sqlServerName.database.windows.net,1433;Initial Catalog=$sqlDbName;Persist Security Info=False;User ID=$sqlAdminUser;Password=$sqlAdminPassword;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"


$signalRConnectionString = az signalr key list `
  --name $signalRName `
  --resource-group $resourceGroup `
  --query primaryConnectionString -o tsv


if ($signalRConnectionString) {
    az staticwebapp appsettings set `
      --name $staticWebAppName `
      --setting-names "DefaultConnection=$sqlConnectionString" `
                      "SignalRConnectionString=$signalRConnectionString" `
                      "Jwt__SecretKey=YourJWTSecretKey-MustBe256BitsLong-ChangeThisInProduction!" `
                      "Jwt__Issuer=https://$staticWebAppName.azurestaticapps.net" `
                      "Jwt__Audience=https://$staticWebAppName.azurestaticapps.net" `
                      "MercadoPago__AccessToken=YOUR_MERCADOPAGO_TOKEN" `
                      "MercadoPago__PublicKey=YOUR_MERCADOPAGO_PUBLIC_KEY" `
                      "ASPNETCORE_ENVIRONMENT=Production"
   
    Write-Host "✅ Application settings configured"
}


# Step 10: Final Verification
Write-Host "`n🔍 Step 10: Final Verification..." -ForegroundColor Cyan
$finalUrl = az staticwebapp show --name $staticWebAppName --resource-group $resourceGroup --query "defaultHostname" -o tsv


Write-Host "`n🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════" -ForegroundColor Green
Write-Host "📊 Your Ultra-Low-Cost TKD Hub Deployment:" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Frontend URL: https://$finalUrl" -ForegroundColor Cyan
Write-Host "🗄️ Database: $sqlServerName.database.windows.net" -ForegroundColor Cyan
Write-Host "📡 SignalR: $signalRName.service.signalr.net" -ForegroundColor Cyan
Write-Host "📂 Resource Group: $resourceGroup" -ForegroundColor Cyan
Write-Host ""
Write-Host "💰 Monthly Cost Estimate: $5-15" -ForegroundColor Green
Write-Host "   • Static Web App: FREE ✅"
Write-Host "   • Azure Functions: FREE ✅ (up to 500K requests)"
Write-Host "   • SignalR Service: FREE ✅"
Write-Host "   • SQL Database Serverless: $5-15 💸"
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Update MercadoPago tokens in Azure Portal"
Write-Host "   2. Generate secure JWT secret key"
Write-Host "   3. Create Azure Functions (Step 9 below)"
Write-Host "   4. Deploy and test your application"
Write-Host "═══════════════════════════════════════════" -ForegroundColor Green
```


### Manual Alternative: Step-by-Step Execution


#### Choose Ultra-Low-Cost If:
- You're in MVP/early stage
- You have <1000 monthly active users
- Budget is extremely tight
- You can accept some cold start delays


#### Choose Standard Budget If:
- You need guaranteed performance
- You have >5000 monthly active users
- You require enterprise features
- You want minimal architecture changes


### Standard Budget Deployment (Keep Current ASP.NET Core Structure)


#### 1. Create Resource Group


```bash
# Set variables
$resourceGroup = "tkd-hub-rg"
# Use Central US due to East US capacity issues
$location = "Central US"  # Primary recommendation
# Alternative regions if Central US is unavailable:
# $location = "West US 2"
# $location = "South Central US"
# $location = "East US 2"


# Create resource group
az group create --name $resourceGroup --location $location
```


### 2. Create Azure Key Vault


```bash
$keyVaultName = "tkd-hub-keyvault-$(Get-Random)"


az keyvault create `
  --name $keyVaultName `
  --resource-group $resourceGroup `
  --location $location `
  --sku standard
```


### 3. Create Azure SQL Database


```bash
$sqlServerName = "tkd-hub-sql-server-$(Get-Random)"
$sqlDbName = "TKDHubDb"
$sqlAdminUser = "tkdhub-admin"
$sqlAdminPassword = "SecurePassword123!"


# Create SQL Server
az sql server create `
  --name $sqlServerName `
  --resource-group $resourceGroup `
  --location $location `
  --admin-user $sqlAdminUser `
  --admin-password $sqlAdminPassword


# Create SQL Database
az sql db create `
  --resource-group $resourceGroup `
  --server $sqlServerName `
  --name $sqlDbName `
  --service-objective Basic


# Configure firewall (allow Azure services)
az sql server firewall-rule create `
  --resource-group $resourceGroup `
  --server $sqlServerName `
  --name "AllowAzureServices" `
  --start-ip-address 0.0.0.0 `
  --end-ip-address 0.0.0.0
```


### 4. Create SignalR Service


```bash
$signalRName = "tkd-hub-signalr-$(Get-Random)"


az signalr create `
  --name $signalRName `
  --resource-group $resourceGroup `
  --location $location `
  --sku Free_F1 `
  --unit-count 1 `
  --service-mode Default
```


### 5. Create App Service Plan


```bash
$appServicePlanName = "tkd-hub-plan"


az appservice plan create `
  --name $appServicePlanName `
  --resource-group $resourceGroup `
  --location $location `
  --sku S1 `
  --is-linux
```


### 6. Create App Services


```bash
$apiAppName = "tkd-hub-api-$(Get-Random)"
$frontendAppName = "tkd-hub-frontend-$(Get-Random)"


# Create API App Service
az webapp create `
  --resource-group $resourceGroup `
  --plan $appServicePlanName `
  --name $apiAppName `
  --runtime "DOTNETCORE|8.0"


# Create Frontend App Service
az webapp create `
  --resource-group $resourceGroup `
  --plan $appServicePlanName `
  --name $frontendAppName `
  --runtime "NODE|18-lts"
```


### 7. Create Application Insights


```bash
$appInsightsName = "tkd-hub-insights"


az monitor app-insights component create `
  --app $appInsightsName `
  --location $location `
  --resource-group $resourceGroup `
  --kind web
```


### 8. Create Storage Account (Optional)


```bash
$storageAccountName = "tkdhubstorage$(Get-Random)"


az storage account create `
  --name $storageAccountName `
  --resource-group $resourceGroup `
  --location $location `
  --sku Standard_LRS `
  --kind StorageV2
```


## Configuration


### 1. Store Secrets in Key Vault


```bash
# Get connection strings
$sqlConnectionString = az sql db show-connection-string `
  --server $sqlServerName `
  --name $sqlDbName `
  --client ado.net `
  --output tsv


$signalRConnectionString = az signalr key list `
  --name $signalRName `
  --resource-group $resourceGroup `
  --query primaryConnectionString `
  --output tsv


$appInsightsKey = az monitor app-insights component show `
  --app $appInsightsName `
  --resource-group $resourceGroup `
  --query instrumentationKey `
  --output tsv


# Store in Key Vault
az keyvault secret set --vault-name $keyVaultName --name "ConnectionStrings--DefaultConnection" --value $sqlConnectionString
az keyvault secret set --vault-name $keyVaultName --name "Azure--SignalR--ConnectionString" --value $signalRConnectionString
az keyvault secret set --vault-name $keyVaultName --name "ApplicationInsights--InstrumentationKey" --value $appInsightsKey
az keyvault secret set --vault-name $keyVaultName --name "Jwt--SecretKey" --value "YourJWTSecretKeyHere"
az keyvault secret set --vault-name $keyVaultName --name "MercadoPago--AccessToken" --value "YourMercadoPagoAccessToken"
```


### 2. Configure App Service Settings


```bash
# Get Key Vault URI
$keyVaultUri = az keyvault show --name $keyVaultName --resource-group $resourceGroup --query properties.vaultUri --output tsv


# Configure API App Settings
az webapp config appsettings set `
  --resource-group $resourceGroup `
  --name $apiAppName `
  --settings `
    "ConnectionStrings__DefaultConnection=@Microsoft.KeyVault(VaultName=$keyVaultName;SecretName=ConnectionStrings--DefaultConnection)" `
    "Azure__SignalR__ConnectionString=@Microsoft.KeyVault(VaultName=$keyVaultName;SecretName=Azure--SignalR--ConnectionString)" `
    "ApplicationInsights__InstrumentationKey=@Microsoft.KeyVault(VaultName=$keyVaultName;SecretName=ApplicationInsights--InstrumentationKey)" `
    "Jwt__SecretKey=@Microsoft.KeyVault(VaultName=$keyVaultName;SecretName=Jwt--SecretKey)" `
    "MercadoPago__AccessToken=@Microsoft.KeyVault(VaultName=$keyVaultName;SecretName=MercadoPago--AccessToken)" `
    "ASPNETCORE_ENVIRONMENT=Production"


# Configure Frontend App Settings
az webapp config appsettings set `
  --resource-group $resourceGroup `
  --name $frontendAppName `
  --settings `
    "REACT_APP_API_URL=https://$apiAppName.azurewebsites.net" `
    "NODE_ENV=production"
```


### 3. Enable System-Assigned Managed Identity


```bash
# Enable managed identity for API app
az webapp identity assign --resource-group $resourceGroup --name $apiAppName


# Get the principal ID
$principalId = az webapp identity show --resource-group $resourceGroup --name $apiAppName --query principalId --output tsv


# Grant access to Key Vault
az keyvault set-policy `
  --name $keyVaultName `
  --object-id $principalId `
  --secret-permissions get list
```


## Database Migration


### 1. Update Connection String in Local Development


```json
// appsettings.Production.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your Azure SQL Connection String"
  }
}
```


### 2. Run Migrations


```bash
# From your local development environment
cd src/TKDHubAPI.Infrastructure
dotnet ef database update --startup-project ../TKDHubAPI.WebAPI --configuration Production
```


### 3. Seed Initial Data


```bash
# Execute your SQL seed scripts against Azure SQL Database
# Use SQL Server Management Studio or Azure Data Studio
# Run scripts in sql.data/ folder in order:
# 1. Master_Argentine_Data.sql
# 2. Argentine_Dojangs.sql
# 3. Argentine_Coaches.sql
# 4. Argentine_Students.sql
# 5. Argentine_Classes.sql
# 6. Add_TrainingClass_Columns.sql
```


## Application Deployment


### 1. Build and Deploy API


```bash
# Build the API
cd src/TKDHubAPI.WebAPI
dotnet publish -c Release -o ./publish


# Create deployment package
Compress-Archive -Path ./publish/* -DestinationPath ../api-deployment.zip


# Deploy to Azure
az webapp deployment source config-zip `
  --resource-group $resourceGroup `
  --name $apiAppName `
  --src ../api-deployment.zip
```


### 2. Build and Deploy Frontend


```bash
# Build the React app
cd frontend/spa
npm install
npm run build


# Create deployment package
Compress-Archive -Path ./dist/* -DestinationPath ../frontend-deployment.zip


# Deploy to Azure
az webapp deployment source config-zip `
  --resource-group $resourceGroup `
  --name $frontendAppName `
  --src ../frontend-deployment.zip
```


## Post-Deployment Configuration


### 1. Configure Custom Domains (Optional)


```bash
# Add custom domain to API
az webapp config hostname add `
  --webapp-name $apiAppName `
  --resource-group $resourceGroup `
  --hostname "api.yourdomain.com"


# Add custom domain to Frontend
az webapp config hostname add `
  --webapp-name $frontendAppName `
  --resource-group $resourceGroup `
  --hostname "yourdomain.com"
```


### 2. Enable SSL Certificates


```bash
# Create free managed certificate
az webapp config ssl create `
  --resource-group $resourceGroup `
  --name $apiAppName `
  --hostname "api.yourdomain.com"


az webapp config ssl create `
  --resource-group $resourceGroup `
  --name $frontendAppName `
  --hostname "yourdomain.com"
```


### 3. Configure CORS


```bash
# Allow frontend domain to access API
az webapp cors add `
  --resource-group $resourceGroup `
  --name $apiAppName `
  --allowed-origins "https://$frontendAppName.azurewebsites.net" "https://yourdomain.com"
```


## Monitoring and Diagnostics


### 1. Enable Application Insights


```bash
# Link Application Insights to App Services
az webapp config appsettings set `
  --resource-group $resourceGroup `
  --name $apiAppName `
  --settings "APPINSIGHTS_INSTRUMENTATIONKEY=$appInsightsKey"


az webapp config appsettings set `
  --resource-group $resourceGroup `
  --name $frontendAppName `
  --settings "APPINSIGHTS_INSTRUMENTATIONKEY=$appInsightsKey"
```


### 2. Configure Alerts


```bash
# Create alert for high error rate
az monitor metrics alert create `
  --name "High Error Rate" `
  --resource-group $resourceGroup `
  --scopes "/subscriptions/{subscription-id}/resourceGroups/$resourceGroup/providers/Microsoft.Web/sites/$apiAppName" `
  --condition "avg exceptions/server > 10" `
  --description "Alert when error rate is high"
```


## Environment Variables Reference


### API App Service Settings


```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=@Microsoft.KeyVault(...)
Azure__SignalR__ConnectionString=@Microsoft.KeyVault(...)
ApplicationInsights__InstrumentationKey=@Microsoft.KeyVault(...)
Jwt__SecretKey=@Microsoft.KeyVault(...)
Jwt__Issuer=https://api.yourdomain.com
Jwt__Audience=https://yourdomain.com
MercadoPago__AccessToken=@Microsoft.KeyVault(...)
MercadoPago__WebhookSecret=@Microsoft.KeyVault(...)
```


### Frontend App Service Settings


```
NODE_ENV=production
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_SIGNALR_URL=https://api.yourdomain.com/hubs
```


## Cost Optimization


### Development Environment
- Use **Free Tier** for App Service (F1)
- Use **Basic Tier** for SQL Database
- Use **Free Tier** for SignalR Service


### Production Environment
- Use **Standard Tier** (S1) for App Service Plan
- Use **Standard Tier** for SQL Database
- Scale up SignalR Service as needed


### Cost-Saving Tips
1. **Auto-scaling**: Configure based on CPU/memory metrics
2. **Reserved Instances**: Save up to 72% with 1-3 year commitments
3. **Dev/Test Pricing**: Use Azure Dev/Test subscription for non-production
4. **Spot Instances**: For non-critical workloads


## Backup Strategy


### Database Backups
- Azure SQL Database has automated backups (Point-in-time restore)
- Configure long-term retention for compliance


### Application Backups
- Enable App Service backup for configuration and content
- Use Azure DevOps/GitHub for source code backup


### Configuration Backup
```bash
# Export ARM template for infrastructure
az group export --name $resourceGroup > tkd-hub-infrastructure.json
```


## Troubleshooting


### Common Issues


#### 0. Region Availability Issues
```bash
# Error: "Location is not accepting creation of new Azure SQL Database servers"
# Solution: Try different regions


# Check available regions for SQL
az account list-locations --query "[?metadata.regionCategory=='Recommended'].{Name:name,DisplayName:displayName}" --output table


# Recommended regions (try in this order):
# 1. "Central US"
# 2. "West US 2"
# 3. "South Central US"
# 4. "East US 2"
# 5. "North Central US"


# Update your location variable and retry:
$location = "Central US"  # or another available region
```


#### 1. Database Connection Issues
```bash
# Test database connectivity
az sql db show-connection-string --server $sqlServerName --name $sqlDbName --client ado.net


# Check firewall rules
az sql server firewall-rule list --resource-group $resourceGroup --server $sqlServerName
```


#### 2. Key Vault Access Issues
```bash
# Check managed identity
az webapp identity show --resource-group $resourceGroup --name $apiAppName


# Check Key Vault policies
az keyvault show --name $keyVaultName --resource-group $resourceGroup
```


#### 3. SignalR Connection Issues
```bash
# Test SignalR connection
az signalr key list --name $signalRName --resource-group $resourceGroup
```


### Logging and Diagnostics


#### Enable Application Logging
```bash
# Enable application logs
az webapp log config `
  --resource-group $resourceGroup `
  --name $apiAppName `
  --application-logging filesystem `
  --web-server-logging filesystem `
  --detailed-error-messages true `
  --failed-request-tracing true
```


#### View Logs
```bash
# Stream logs
az webapp log tail --resource-group $resourceGroup --name $apiAppName


# Download logs
az webapp log download --resource-group $resourceGroup --name $apiAppName
```


## Security Checklist


- [ ] Enable HTTPS-only for all App Services
- [ ] Configure Key Vault with proper access policies
- [ ] Enable Managed Identity for secure access
- [ ] Configure CORS with specific domains
- [ ] Enable SQL Database Advanced Threat Protection
- [ ] Configure firewall rules for SQL Database
- [ ] Enable Application Gateway with WAF (if using)
- [ ] Regular security updates and patches


## Maintenance


### Regular Tasks
1. **Monitor costs** in Azure Cost Management
2. **Review Application Insights** for performance issues
3. **Update dependencies** regularly
4. **Backup verification** monthly
5. **Security patches** as available


### Performance Optimization
1. **Enable Application Insights Profiler**
2. **Configure CDN** for static content
3. **Optimize database queries**
4. **Implement caching strategies**


## Support and Resources


- [Azure Documentation](https://docs.microsoft.com/azure/)
- [ASP.NET Core on Azure](https://docs.microsoft.com/aspnet/core/host-and-deploy/azure-apps/)
- [React on Azure](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Cost Calculator](https://azure.microsoft.com/pricing/calculator/)


---


**Note**: Replace placeholder values (like domain names, passwords, and tokens) with your actual values before deployment.

# =============================================================================
# TKD Hub API - Ultra-Low-Cost Azure Deployment Script
# Total Estimated Cost: $5-15/month (94% cost reduction!)
#
# Instructions:
# 1. Open this file in PowerShell ISE
# 2. Press F5 to run the entire script, or
# 3. Select sections and press F8 to run step by step
# 4. Monitor the output for any errors
# =============================================================================


# Clear the screen and start fresh
Clear-Host


Write-Host "🚀 TKD Hub API - Ultra-Low-Cost Azure Deployment" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "💰 Target Monthly Cost: $5-15 (94% cost reduction!)" -ForegroundColor Yellow
Write-Host "📊 Architecture: Static Web Apps + Azure Functions + SQL Serverless" -ForegroundColor Cyan
Write-Host ""


# =============================================================================
# STEP 1: VERIFY PREREQUISITES
# =============================================================================
Write-Host "📋 Step 1: Verifying Prerequisites..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray


$prerequisitesFailed = $false


# Check Azure CLI
try {
    $azVersion = az --version | Select-Object -First 1
    Write-Host "✅ Azure CLI: $azVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI not found. Please install: https://aka.ms/installazurecliwindows" -ForegroundColor Red
    $prerequisitesFailed = $true
}


# Check .NET SDK
try {
    $dotnetVersion = dotnet --version
    Write-Host "✅ .NET SDK: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ .NET SDK not found. Please install: https://dotnet.microsoft.com/download" -ForegroundColor Red
    $prerequisitesFailed = $true
}


# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install: https://nodejs.org/" -ForegroundColor Red
    $prerequisitesFailed = $true
}


# Check Azure Functions Core Tools
try {
    $funcVersion = func --version
    Write-Host "✅ Azure Functions Core Tools: $funcVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure Functions Core Tools not found. Install with: npm install -g azure-functions-core-tools@4 --unsafe-perm true" -ForegroundColor Red
    $prerequisitesFailed = $true
}


if ($prerequisitesFailed) {
    Write-Host "`n❌ Prerequisites check failed. Please install missing tools and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}


Write-Host "`n✅ All prerequisites verified successfully!" -ForegroundColor Green


# =============================================================================
# STEP 2: SET DEPLOYMENT VARIABLES
# =============================================================================
Write-Host "`n🔧 Step 2: Setting Deployment Variables..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray


# Generate unique names to avoid conflicts
$randomSuffix = Get-Random -Minimum 1000000 -Maximum 9999999


# Core settings
$resourceGroup = "tkd-hub-rg"
$location = "Central US"  # Primary recommendation
$sqlServerName = "tkd-hub-sql-$randomSuffix"
$sqlDbName = "TKDHubDb"
$sqlAdminUser = "tkdhub-admin"
$sqlAdminPassword = "SecurePassword123!"
$signalRName = "tkd-hub-signalr-$randomSuffix"
$staticWebAppName = "tkd-hub-app-$randomSuffix"


# GitHub repository (CHANGE THIS TO YOUR REPO)
$githubRepo = "nicolassnider/TKD_Hub_API"  # ⚠️ UPDATE THIS TO YOUR ACTUAL GITHUB REPO


# Display configuration
Write-Host "📂 Resource Group: $resourceGroup" -ForegroundColor Yellow
Write-Host "🌍 Location: $location" -ForegroundColor Yellow
Write-Host "🗄️ SQL Server: $sqlServerName" -ForegroundColor Yellow
Write-Host "🗄️ Database: $sqlDbName" -ForegroundColor Yellow
Write-Host "📡 SignalR: $signalRName" -ForegroundColor Yellow
Write-Host "🌐 Static Web App: $staticWebAppName" -ForegroundColor Yellow
Write-Host "📦 GitHub Repo: $githubRepo" -ForegroundColor Yellow


Write-Host "`n⚠️  IMPORTANT: Make sure '$githubRepo' is your actual GitHub repository!" -ForegroundColor Red
$confirmation = Read-Host "`nPress Enter to continue, or type 'exit' to abort"
if ($confirmation -eq 'exit') {
    Write-Host "Deployment aborted by user." -ForegroundColor Yellow
    exit 0
}


# =============================================================================
# STEP 3: AZURE LOGIN
# =============================================================================
Write-Host "`n🔐 Step 3: Azure Authentication..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray


Write-Host "🔑 Checking Azure login status..." -ForegroundColor White
try {
    $account = az account show --query "name" -o tsv 2>$null
    if ($account) {
        Write-Host "✅ Already logged in to Azure: $account" -ForegroundColor Green
    } else {
        throw "Not logged in"
    }
} catch {
    Write-Host "🔓 Not logged in to Azure. Opening browser for authentication..." -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to login to Azure" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    $account = az account show --query "name" -o tsv
    Write-Host "✅ Successfully logged in to Azure: $account" -ForegroundColor Green
}


# =============================================================================
# STEP 4: CREATE RESOURCE GROUP
# =============================================================================
Write-Host "`n📂 Step 4: Creating Resource Group..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray


Write-Host "📁 Creating resource group: $resourceGroup in $location..." -ForegroundColor White
az group create --name $resourceGroup --location $location


if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Resource group created successfully" -ForegroundColor Green
    $actualLocation = az group show --name $resourceGroup --query "location" -o tsv
    Write-Host "📍 Resource group location: $actualLocation" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create resource group in $location" -ForegroundColor Red
    Write-Host "🔄 Trying alternative regions..." -ForegroundColor Yellow
   
    $alternativeLocations = @("West US 2", "South Central US", "East US 2", "North Central US")
    $created = $false
   
    foreach ($altLocation in $alternativeLocations) {
        Write-Host "🌍 Trying: $altLocation" -ForegroundColor White
        $location = $altLocation
        az group create --name $resourceGroup --location $location
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Resource group created in $location" -ForegroundColor Green
            $created = $true
            break
        }
    }
   
    if (-not $created) {
        Write-Host "❌ Failed to create resource group in any region" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}


# =============================================================================
# STEP 5: CREATE SQL DATABASE (SERVERLESS)
# =============================================================================
Write-Host "`n🗄️ Step 5: Creating SQL Database (Serverless)..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray


Write-Host "🖥️ Creating SQL Server: $sqlServerName..." -ForegroundColor White
az sql server create `
  --name $sqlServerName `
  --resource-group $resourceGroup `
  --location $location `
  --admin-user $sqlAdminUser `
  --admin-password $sqlAdminPassword


if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SQL Server created successfully" -ForegroundColor Green
   
    Write-Host "🗃️ Creating serverless database: $sqlDbName..." -ForegroundColor White
    az sql db create `
      --resource-group $resourceGroup `
      --server $sqlServerName `
      --name $sqlDbName `
      --edition GeneralPurpose `
      --compute-model Serverless `
      --family Gen5 `
      --capacity 0.5 `
      --auto-pause-delay 60
   
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Serverless database created (0.5 vCore, auto-pause after 60 min)" -ForegroundColor Green
       
        Write-Host "🔥 Configuring firewall for Azure services..." -ForegroundColor White
        az sql server firewall-rule create `
          --resource-group $resourceGroup `
          --server $sqlServerName `
          --name "AllowAzureServices" `
          --start-ip-address 0.0.0.0 `
          --end-ip-address 0.0.0.0
       
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Firewall configured successfully" -ForegroundColor Green
            Write-Host "📊 Database Details:" -ForegroundColor White
            Write-Host "   🔗 Server: $sqlServerName.database.windows.net" -ForegroundColor Gray
            Write-Host "   🗃️ Database: $sqlDbName" -ForegroundColor Gray
            Write-Host "   ⚡ Edition: Serverless (auto-pause)" -ForegroundColor Gray
            Write-Host "   💰 Estimated Cost: $5-15/month" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to configure firewall" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Failed to create database" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Failed to create SQL Server" -ForegroundColor Red
    Write-Host "💡 Possible issues:" -ForegroundColor Yellow
    Write-Host "   • Server name conflict (try different name)" -ForegroundColor Gray
    Write-Host "   • Region capacity issues (try different region)" -ForegroundColor Gray
    Write-Host "   • Subscription limitations" -ForegroundColor Gray
}


# =============================================================================
# STEP 6: CREATE SIGNALR SERVICE (FREE)
# =============================================================================
Write-Host "`n📡 Step 6: Creating SignalR Service (FREE)..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray


Write-Host "📻 Creating SignalR Service: $signalRName..." -ForegroundColor White
az signalr create `
  --name $signalRName `
  --resource-group $resourceGroup `
  --location $location `
  --sku Free_F1 `
  --unit-count 1 `
  --service-mode Serverless


if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ SignalR Service created successfully (FREE tier)" -ForegroundColor Green
   
    Write-Host "🔑 Retrieving SignalR connection string..." -ForegroundColor White
    $signalRConnectionString = az signalr key list `
      --name $signalRName `
      --resource-group $resourceGroup `
      --query primaryConnectionString -o tsv
   
    if ($signalRConnectionString) {
        Write-Host "✅ SignalR connection string retrieved" -ForegroundColor Green
        Write-Host "📊 SignalR Details:" -ForegroundColor White
        Write-Host "   📡 Service: $signalRName.service.signalr.net" -ForegroundColor Gray
        Write-Host "   ⚡ Mode: Serverless" -ForegroundColor Gray
        Write-Host "   💰 Cost: FREE (up to 20 connections)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ SignalR created but connection string retrieval failed" -ForegroundColor Yellow
        Write-Host "💡 You can get it later from Azure Portal" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Failed to create SignalR Service" -ForegroundColor Red
}


# =============================================================================
# STEP 7: SETUP AZURE FUNCTIONS PROJECT
# =============================================================================
Write-Host "`n⚡ Step 7: Setting up Azure Functions Project..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray


Write-Host "📁 Creating Azure Functions project structure..." -ForegroundColor White


# Create AzureFunctions directory if it doesn't exist
if (-not (Test-Path "AzureFunctions")) {
    New-Item -ItemType Directory -Path "AzureFunctions" | Out-Null
    Write-Host "✅ Created AzureFunctions directory" -ForegroundColor Green
} else {
    Write-Host "📂 AzureFunctions directory already exists" -ForegroundColor Yellow
}


# Navigate to AzureFunctions directory
Push-Location "AzureFunctions"


# Initialize Functions project if it doesn't exist
if (-not (Test-Path "TKDHubFunctions")) {
    Write-Host "🔧 Initializing Functions project..." -ForegroundColor White
    func init TKDHubFunctions --dotnet --target-framework net8.0
   
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Azure Functions project initialized" -ForegroundColor Green
       
        # Navigate to Functions project directory
        Push-Location "TKDHubFunctions"
       
        Write-Host "📦 Adding required NuGet packages..." -ForegroundColor White
        dotnet add package Microsoft.Azure.Functions.Extensions
        dotnet add package Microsoft.EntityFrameworkCore.SqlServer
        dotnet add package Microsoft.Azure.SignalR.Management
        dotnet add package Microsoft.EntityFrameworkCore.Tools
        dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
        dotnet add package System.IdentityModel.Tokens.Jwt
       
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ NuGet packages added successfully" -ForegroundColor Green
            Write-Host "📦 Azure Functions Project Ready!" -ForegroundColor Green
            Write-Host "📂 Location: .\AzureFunctions\TKDHubFunctions" -ForegroundColor Gray
        } else {
            Write-Host "❌ Failed to add NuGet packages" -ForegroundColor Red
        }
       
        # Return to AzureFunctions directory
        Pop-Location
    } else {
        Write-Host "❌ Failed to initialize Functions project" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️ Functions project already exists" -ForegroundColor Yellow
}


# Return to project root
Pop-Location


# =============================================================================
# STEP 8: CREATE STATIC WEB APP
# =============================================================================
Write-Host "`n🌐 Step 8: Creating Azure Static Web App..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray


Write-Host "🌍 Creating Static Web App: $staticWebAppName" -ForegroundColor White
Write-Host "📦 GitHub Repository: $githubRepo" -ForegroundColor White


az staticwebapp create `
  --name $staticWebAppName `
  --resource-group $resourceGroup `
  --source "https://github.com/$githubRepo" `
  --location $location `
  --branch "master" `
  --app-location "/frontend/spa" `
  --api-location "/AzureFunctions/TKDHubFunctions" `
  --output-location "dist"


if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Static Web App created successfully" -ForegroundColor Green
   
    Write-Host "🔗 Retrieving Static Web App URL..." -ForegroundColor White
    $staticWebAppUrl = az staticwebapp show `
      --name $staticWebAppName `
      --resource-group $resourceGroup `
      --query "defaultHostname" -o tsv
   
    if ($staticWebAppUrl) {
        Write-Host "✅ Static Web App deployed successfully" -ForegroundColor Green
        Write-Host "📊 Static Web App Details:" -ForegroundColor White
        Write-Host "   🏷️ Name: $staticWebAppName" -ForegroundColor Gray
        Write-Host "   🌐 URL: https://$staticWebAppUrl" -ForegroundColor Gray
        Write-Host "   📦 GitHub: $githubRepo (master branch)" -ForegroundColor Gray
        Write-Host "   📁 Frontend: /frontend/spa" -ForegroundColor Gray
        Write-Host "   ⚡ API: /AzureFunctions/TKDHubFunctions" -ForegroundColor Gray
        Write-Host "   💰 Cost: FREE (includes SSL, custom domains, CI/CD)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Static Web App created but URL retrieval failed" -ForegroundColor Yellow
        Write-Host "💡 Check Azure Portal for the URL" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ Failed to create Static Web App" -ForegroundColor Red
    Write-Host "💡 Possible issues:" -ForegroundColor Yellow
    Write-Host "   • GitHub repository URL is incorrect" -ForegroundColor Gray
    Write-Host "   • Repository is not public or accessible" -ForegroundColor Gray
    Write-Host "   • Static Web App name conflict" -ForegroundColor Gray
}


# =============================================================================
# STEP 9: CONFIGURE APPLICATION SETTINGS
# =============================================================================
Write-Host "`n⚙️ Step 9: Configuring Application Settings..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray


Write-Host "🔗 Building connection strings..." -ForegroundColor White
$sqlConnectionString = "Server=tcp:$sqlServerName.database.windows.net,1433;Initial Catalog=$sqlDbName;Persist Security Info=False;User ID=$sqlAdminUser;Password=$sqlAdminPassword;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"


Write-Host "🔑 Retrieving SignalR connection string..." -ForegroundColor White
$signalRConnectionString = az signalr key list `
  --name $signalRName `
  --resource-group $resourceGroup `
  --query primaryConnectionString -o tsv


if ($signalRConnectionString) {
    Write-Host "✅ SignalR connection string retrieved" -ForegroundColor Green
   
    Write-Host "🔧 Configuring Static Web App application settings..." -ForegroundColor White
    az staticwebapp appsettings set `
      --name $staticWebAppName `
      --setting-names "DefaultConnection=$sqlConnectionString" `
                      "SignalRConnectionString=$signalRConnectionString" `
                      "Jwt__SecretKey=YourJWTSecretKey-MustBe256BitsLong-ChangeThisInProduction!" `
                      "Jwt__Issuer=https://$staticWebAppName.azurestaticapps.net" `
                      "Jwt__Audience=https://$staticWebAppName.azurestaticapps.net" `
                      "MercadoPago__AccessToken=YOUR_MERCADOPAGO_TOKEN" `
                      "MercadoPago__PublicKey=YOUR_MERCADOPAGO_PUBLIC_KEY" `
                      "ASPNETCORE_ENVIRONMENT=Production"
   
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Application settings configured successfully" -ForegroundColor Green
        Write-Host "📊 Configuration Summary:" -ForegroundColor White
        Write-Host "   ✅ Database connection configured" -ForegroundColor Green
        Write-Host "   ✅ SignalR connection configured" -ForegroundColor Green
        Write-Host "   ✅ JWT settings configured" -ForegroundColor Green
        Write-Host "   ⚠️ MercadoPago tokens need manual update" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "🔐 SECURITY REMINDER:" -ForegroundColor Yellow
        Write-Host "   • Change JWT secret key in production" -ForegroundColor Gray
        Write-Host "   • Update MercadoPago tokens with real values" -ForegroundColor Gray
        Write-Host "   • Consider using Azure Key Vault for secrets" -ForegroundColor Gray
    } else {
        Write-Host "❌ Failed to configure application settings" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Failed to retrieve SignalR connection string" -ForegroundColor Red
    Write-Host "💡 Configure settings manually in Azure Portal" -ForegroundColor Yellow
    Write-Host "   See STEP8_CONFIGURATION_GUIDE.md for manual steps" -ForegroundColor Gray
}


# =============================================================================
# STEP 10: FINAL VERIFICATION
# =============================================================================
Write-Host "`n🔍 Step 10: Final Verification..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray


Write-Host "📂 Checking resource group..." -ForegroundColor White
$rgLocation = az group show --name $resourceGroup --query "location" -o tsv
Write-Host "✅ Resource Group: $resourceGroup ($rgLocation)" -ForegroundColor Green


Write-Host "🗄️ Checking SQL Database..." -ForegroundColor White
$dbStatus = az sql db show --resource-group $resourceGroup --server $sqlServerName --name $sqlDbName --query "status" -o tsv 2>$null
if ($dbStatus) {
    Write-Host "✅ SQL Database: $dbStatus" -ForegroundColor Green
} else {
    Write-Host "⚠️ SQL Database status unknown" -ForegroundColor Yellow
}


Write-Host "📡 Checking SignalR Service..." -ForegroundColor White
$signalRStatus = az signalr show --name $signalRName --resource-group $resourceGroup --query "provisioningState" -o tsv 2>$null
if ($signalRStatus) {
    Write-Host "✅ SignalR Service: $signalRStatus" -ForegroundColor Green
} else {
    Write-Host "⚠️ SignalR Service status unknown" -ForegroundColor Yellow
}


Write-Host "🌐 Checking Static Web App..." -ForegroundColor White
$finalUrl = az staticwebapp show --name $staticWebAppName --resource-group $resourceGroup --query "defaultHostname" -o tsv 2>$null


# =============================================================================
# DEPLOYMENT SUMMARY
# =============================================================================
Write-Host ""
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "📊 Your Ultra-Low-Cost TKD Hub Deployment Summary:" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""


if ($finalUrl) {
    Write-Host "🌐 Frontend URL: https://$finalUrl" -ForegroundColor Cyan
} else {
    Write-Host "🌐 Frontend URL: Check Azure Portal for Static Web App URL" -ForegroundColor Yellow
}


Write-Host "🗄️ Database Server: $sqlServerName.database.windows.net" -ForegroundColor Cyan
Write-Host "🗃️ Database Name: $sqlDbName" -ForegroundColor Cyan
Write-Host "📡 SignalR Service: $signalRName.service.signalr.net" -ForegroundColor Cyan
Write-Host "📂 Resource Group: $resourceGroup" -ForegroundColor Cyan
Write-Host "🌍 Region: $location" -ForegroundColor Cyan
Write-Host ""
Write-Host "💰 Monthly Cost Estimate: $5-15" -ForegroundColor Green
Write-Host "   • Static Web App: FREE ✅" -ForegroundColor Green
Write-Host "   • Azure Functions: FREE ✅ (up to 500K requests)" -ForegroundColor Green
Write-Host "   • SignalR Service: FREE ✅" -ForegroundColor Green
Write-Host "   • SQL Database Serverless: $5-15 💸" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Update MercadoPago tokens in Azure Portal" -ForegroundColor White
Write-Host "   2. Generate secure JWT secret key for production" -ForegroundColor White
Write-Host "   3. Create Azure Functions to replace API controllers" -ForegroundColor White
Write-Host "   4. Deploy and test your application" -ForegroundColor White
Write-Host "   5. Run database migrations against Azure SQL" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Useful Links:" -ForegroundColor Yellow
Write-Host "   • Azure Portal: https://portal.azure.com" -ForegroundColor Gray
Write-Host "   • Your Resource Group: https://portal.azure.com/#@/resource/subscriptions/{subscription}/resourceGroups/$resourceGroup" -ForegroundColor Gray
if ($finalUrl) {
    Write-Host "   • Your App: https://$finalUrl" -ForegroundColor Gray
}
Write-Host ""
Write-Host "📝 Configuration Files Created:" -ForegroundColor Yellow
Write-Host "   • STEP8_CONFIGURATION_GUIDE.md (manual config guide)" -ForegroundColor Gray
Write-Host "   • azure-static-web-app-config.json (reference config)" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "🎯 94% Cost Reduction Achieved! From ~$88/month to $5-15/month" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Green


# Pause to let user read the results
Write-Host ""
Read-Host "Press Enter to exit"

# Step 8: Configure Application Settings - Manual Guide


## Overview
Since the Azure CLI commands may have session issues, here's a manual approach to configure your Static Web App settings through the Azure Portal.


## Your Deployed Resources
- **Resource Group**: tkd-hub-rg
- **SQL Server**: tkd-hub-sql-1170870392.database.windows.net
- **SignalR Service**: tkd-hub-signalr-1170870392
- **Static Web App**: tkd-hub-app-[random-number] (check Azure Portal)


## Step-by-Step Configuration


### 1. Access Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to Resource Groups → tkd-hub-rg
3. Find your Static Web App (name starts with "tkd-hub-app-")


### 2. Configure Application Settings
1. Click on your Static Web App
2. Go to **Configuration** → **Application settings**
3. Click **+ Add** for each setting below:


#### Required Settings:


**Database Connection:**
```
Name: DefaultConnection
Value: Server=tcp:tkd-hub-sql-1170870392.database.windows.net,1433;Initial Catalog=TKDHubDb;Persist Security Info=False;User ID=tkdhub-admin;Password=SecurePassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```


**JWT Configuration:**
```
Name: Jwt__SecretKey
Value: YourJWTSecretKey-MustBe256BitsLong-ChangeThisInProduction!


Name: Jwt__Issuer  
Value: https://[your-static-web-app-name].azurestaticapps.net


Name: Jwt__Audience
Value: https://[your-static-web-app-name].azurestaticapps.net
```


**Environment:**
```
Name: ASPNETCORE_ENVIRONMENT
Value: Production
```


**MercadoPago (Replace with your actual values):**
```
Name: MercadoPago__AccessToken
Value: YOUR_MERCADOPAGO_ACCESS_TOKEN


Name: MercadoPago__PublicKey
Value: YOUR_MERCADOPAGO_PUBLIC_KEY


Name: MercadoPago__WebhookSecret
Value: YOUR_MERCADOPAGO_WEBHOOK_SECRET
```


### 3. Get SignalR Connection String
1. Go to Resource Groups → tkd-hub-rg
2. Click on SignalR Service (tkd-hub-signalr-1170870392)
3. Go to **Keys** in the left menu
4. Copy the **Primary Connection String**
5. Add this setting to your Static Web App:


```
Name: SignalRConnectionString
Value: [Paste the connection string from SignalR Keys]
```


### 4. Save Configuration
1. Click **Save** in the Application settings page
2. Wait for the configuration to be applied


## Verification Steps


### 1. Check Static Web App URL
1. In your Static Web App overview page
2. Note the **URL** (should be https://[name].azurestaticapps.net)
3. This will be your frontend URL


### 2. Test Database Connection
You can test the database connection by:
1. Using SQL Server Management Studio
2. Connecting to: tkd-hub-sql-1170870392.database.windows.net
3. Username: tkdhub-admin
4. Password: SecurePassword123!


### 3. Verify SignalR Service
1. Check that the SignalR service is running
2. Mode should be "Serverless" (FREE tier)
3. Status should be "Running"


## Next Steps After Configuration


Once you've completed Step 8, you'll need to:


1. **Step 5**: Set up Azure Functions project locally
2. **Step 9**: Create Azure Functions to replace your API controllers
3. **Step 10**: Deploy the Functions and test the complete application


## Security Notes


⚠️ **IMPORTANT**: The passwords and keys shown here are examples. In production:


1. **Change the SQL admin password** to something more secure
2. **Generate a real JWT secret key** (256 bits minimum)
3. **Use your actual MercadoPago credentials**
4. **Consider using Azure Key Vault** for sensitive values


## Cost Confirmation


With this configuration, your monthly costs should be:
- **Static Web App**: FREE
- **Azure Functions**: FREE (up to 500K requests)
- **SignalR Service**: FREE
- **SQL Database Serverless**: $5-15/month
- **Total**: $5-15/month 🎉


## Troubleshooting


If you encounter issues:
1. Check that all resource names match exactly
2. Verify the SQL server allows Azure services (firewall rule)
3. Ensure SignalR service is in Serverless mode
4. Check Application Insights for any errors


---


**Next**: Once configuration is complete, proceed to Step 5 (Azure Functions setup)


