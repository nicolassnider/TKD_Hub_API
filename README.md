# TKD Hub - Azure Deployment Guide


This guide covers the complete deployment of the TKD Hub application to Azure, including the .NET Azure Functions API, React SPA, and all supporting infrastructure.


## 📋 Prerequisites


### Required Tools
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18.x or later](https://nodejs.org/)
- [PowerShell 7+](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell) (for deployment script)
- [Git](https://git-scm.com/)


### Azure Resources Needed
- Azure subscription with appropriate permissions
- Resource Group (or permissions to create one)


## 🚀 Quick Start Deployment


### Option 1: PowerShell Script (Recommended)


1. **Clone and prepare the repository:**
   ```powershell
   git clone <your-repo-url>
   cd TKD_Hub_API
   ```


2. **Login to Azure:**
   ```powershell
   Connect-AzAccount
   ```


3. **Run deployment script:**
   ```powershell
   .\Deploy-TKDHub-Complete.ps1 -ResourceGroupName "tkdhub-rg" -AppName "tkdhub" -Location "East US"
   ```


4. **Follow the prompts and note the generated SQL password**


### Option 2: Manual Bicep Deployment


1. **Deploy infrastructure:**
   ```bash
   az group create --name "tkdhub-rg" --location "East US"
   
   az deployment group create \
     --resource-group "tkdhub-rg" \
     --template-file "./infra/main.bicep" \
     --parameters \
       appName="tkdhub" \
       location="East US" \
       sqlAdminLogin="tkdhubadmin" \
       sqlAdminPassword="YourSecurePassword123!"
   ```


2. **Deploy Function App:**
   ```bash
   cd src/TKDHubAPI.Functions
   dotnet publish --configuration Release --output ./publish
   
   func azure functionapp publish tkdhub-func --csharp
   ```


3. **Deploy Static Web App:**
   ```bash
   cd frontend/spa
   npm install
   npm run build
   
   # Use Static Web Apps CLI or the deployment token from Azure
   swa deploy ./dist --deployment-token $DEPLOYMENT_TOKEN
   ```


## 🔧 CI/CD Setup


### GitHub Actions Setup


1. **Create GitHub repository secrets:**
   ```
   AZURE_CREDENTIALS              # Service principal credentials (JSON)
   AZURE_SUBSCRIPTION_ID          # Your Azure subscription ID
   AZURE_RG_NAME                 # Resource group name
   APP_NAME                      # Application name
   AZURE_LOCATION                # Azure region (e.g., "East US")
   SQL_ADMIN_LOGIN              # SQL Server admin username
   SQL_ADMIN_PASSWORD           # SQL Server admin password
   AZURE_STATIC_WEB_APPS_API_TOKEN # Static Web App deployment token
   ```


2. **Create Azure Service Principal:**
   ```bash
   az ad sp create-for-rbac --name "tkdhub-github" \
     --role contributor \
     --scopes /subscriptions/{subscription-id} \
     --sdk-auth
   ```


3. **Push code to main/master branch to trigger deployment**


### Azure DevOps Setup


1. **Create Variable Group "TKDHub-Variables":**
   ```
   azureServiceConnection         # Service connection name
   resourceGroupName             # Resource group name
   appName                      # Application name
   location                     # Azure region
   sqlAdminLogin               # SQL Server admin username
   sqlAdminPassword            # SQL Server admin password (secure)
   staticWebAppToken           # Static Web App deployment token (secure)
   ```


2. **Create Azure Service Connection in Azure DevOps**


3. **Import the `azure-pipelines.yml` file**


## 🏗️ Infrastructure Overview


### Deployed Resources


| Resource Type | Name Pattern | Purpose |
|---------------|--------------|---------|
| Function App | `{appName}-func` | .NET 8 Isolated API |
| Static Web App | `{appName}-swa` | React SPA hosting |
| Storage Account | `{appName}storage` | Function App storage |
| Key Vault | `{appName}-kv` | Secrets management |
| SQL Server | `{appName}-sql` | Database server |
| SQL Database | `TKDHubDb` | Application database |
| Application Insights | `{appName}-ai` | Monitoring & telemetry |


### Security Features


- **Key Vault Integration**: All secrets stored in Azure Key Vault
- **Managed Identity**: Function App uses System Assigned Managed Identity
- **HTTPS Only**: All services enforce HTTPS
- **CORS Configuration**: Proper CORS setup between SPA and API
- **SQL Security**: Azure SQL with firewall rules


## 🔐 Configuration


### Required Secrets in Key Vault


| Secret Name | Description |
|-------------|-------------|
| `ConnectionStrings--DefaultConnection` | SQL Server connection string |
| `APPLICATIONINSIGHTS-CONNECTION-STRING` | Application Insights connection string |


### Environment Variables


Function App automatically configured with:
- Key Vault references for sensitive settings
- Application Insights integration
- Proper runtime configuration


## 🧪 Testing Deployment


### Function App Health Check
```bash
curl https://{appName}-func.azurewebsites.net/api/health
```


### Static Web App Access
```bash
curl https://{appName}-swa.azurestaticapps.net
```


### Database Connection Test
Use Azure Data Studio or SQL Server Management Studio to connect:
- **Server**: `{appName}-sql.database.windows.net`
- **Database**: `TKDHubDb`
- **Authentication**: SQL Server Authentication


## 🔄 Database Migrations


### Using Entity Framework Core


1. **Install EF Core tools:**
   ```bash
   dotnet tool install --global dotnet-ef
   ```


2. **Update connection string** in `appsettings.json` or use Azure connection string


3. **Run migrations:**
   ```bash
   cd src/TKDHubAPI.Infrastructure
   dotnet ef database update --startup-project ../TKDHubAPI.WebAPI
   ```


### Using SQL Scripts


Execute scripts from the `sql.data/` folder in order:
1. Core schema setup
2. Sample data (optional)
3. Permissions and security


## 🚨 Troubleshooting


### Common Issues


1. **Function App won't start:**
   - Check Application Insights connection string
   - Verify Key Vault access permissions
   - Check function app logs in Azure portal


2. **Database connection failures:**
   - Verify firewall rules allow Azure services
   - Check connection string format
   - Ensure SQL authentication is enabled


3. **Static Web App routing issues:**
   - Verify `staticwebapp.config.json` is in the `public` folder
   - Check API routes configuration
   - Ensure proper CORS settings


4. **Deployment failures:**
   - Check Azure subscription limits/quotas
   - Verify resource naming conventions
   - Review deployment logs


### Monitoring


- **Application Insights**: Monitor performance and errors
- **Azure Monitor**: Resource health and metrics
- **Function App Logs**: Real-time logging via Azure portal or CLI


## 📚 Additional Resources


- [Azure Functions Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Bicep Documentation](https://docs.microsoft.com/en-us/azure/azure-resource-manager/bicep/)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)


## 💰 Cost Estimation


### Monthly Costs (Estimated)


| Resource | SKU | Estimated Cost |
|----------|-----|---------------|
| Function App | Flex Consumption | $0-10 |
| Static Web App | Free | $0 |
| SQL Database | Basic (5 DTU) | $5 |
| Storage Account | Standard LRS | $1-2 |
| Key Vault | Standard | $1 |
| Application Insights | Pay-as-you-go | $1-5 |
| **Total** | | **$8-23/month** |


> Costs may vary based on usage patterns and region selection.


## 🔒 Security Best Practices


1. **Regular Updates**: Keep all packages and dependencies updated
2. **Access Reviews**: Regularly review Key Vault access policies
3. **Monitoring**: Set up alerts for unusual activity
4. **Backup**: Enable point-in-time restore for SQL Database
5. **SSL/TLS**: Ensure all communications use HTTPS/TLS 1.2+
6. **Authentication**: Implement proper authentication for API endpoints
7. **Secrets Rotation**: Regularly rotate passwords and keys


