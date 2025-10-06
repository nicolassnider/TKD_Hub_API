# GitHub Actions Setup Guide


## Fixed Issues


### 1. SPA Build Configuration
- **Issue**: Working directory configuration was causing npm ci to fail
- **Fix**: Moved working-directory from defaults to individual steps
- **Fix**: Added cache-dependency-path for better npm caching


### 2. Azure Bicep Template Path
- **Issue**: Template path was pointing to `main.bicep` but actual file is `.main.bicep`
- **Fix**: Updated template path to `./infra/.main.bicep`


### 3. Static Web App Deployment
- **Issue**: Artifact download and deployment configuration
- **Fix**: Simplified artifact handling for static web app deployment


## Required GitHub Secrets


Your repository needs the following secrets configured in GitHub Settings > Secrets and variables > Actions:


### Azure Authentication
- `AZURE_CLIENT_ID` - Service Principal Client ID
- `AZURE_TENANT_ID` - Azure AD Tenant ID  
- `AZURE_SUBSCRIPTION_ID` - Azure Subscription ID


### Azure Resources
- `AZURE_RG_NAME` - Resource Group Name
- `APP_NAME` - Application Name (used as prefix for resources)
- `AZURE_LOCATION` - Azure Region (optional, defaults to 'East US')


### SQL Database
- `SQL_ADMIN_LOGIN` - SQL Server Admin Username
- `SQL_ADMIN_PASSWORD` - SQL Server Admin Password


### Static Web App
- `AZURE_STATIC_WEB_APPS_API_TOKEN` - Static Web App deployment token


## Setting up Azure Service Principal


To set up the Azure Service Principal for GitHub Actions:


```bash
# Login to Azure
az login


# Get your subscription ID
az account show --query id --output tsv


# Create service principal with your subscription ID
az ad sp create-for-rbac --name "github-actions-tkdhub" \
  --role contributor \
  --scopes /subscriptions/###
```


## ✅ Service Principal Created Successfully!


Your service principal output:
```json
{
  "appId": "###",
  "displayName": "github-actions-tkdhub",
  "password": "###",
  "tenant": "###"
}
```


## GitHub Secrets Configuration


Add these **exact values** to your GitHub repository secrets:


### Azure Authentication (✅ Ready to configure)
- `AZURE_CLIENT_ID` = `###`
- `AZURE_TENANT_ID` = `###`  
- `AZURE_SUBSCRIPTION_ID` = `###`


### Additional Required Secrets (❗ You need to set these)
- `AZURE_RG_NAME` = Your resource group name (e.g., "tkd-hub-rg")
- `APP_NAME` = Your app name prefix (e.g., "tkdhub")
- `SQL_ADMIN_LOGIN` = SQL Server admin username
- `SQL_ADMIN_PASSWORD` = SQL Server admin password (strong password required)
- `AZURE_STATIC_WEB_APPS_API_TOKEN` = Static Web App deployment token (get this after deploying infrastructure)


**🔒 Security Note:** The `password` field is sensitive - keep it secure and don't commit it to source control.


## Verifying the Setup


1. Ensure all secrets are configured in GitHub
2. The Bicep template (`infra/.main.bicep`) exists and is valid
3. The SPA package.json exists in `frontend/spa/`
4. The Web API project exists in `src/TKDHubAPI.WebAPI/`


## Workflow Triggers


The workflow will run on:
- Push to `main` or `master` branch
- Pull request to `main` or `master` branch  
- Manual trigger via workflow_dispatch (with environment selection)


## Environments


The workflow supports two environments:
- `dev` - Development environment
- `prod` - Production environment (default)


Environment-specific parameters are loaded from:
- `infra/main.dev.parameters.json`
- `infra/main.prod.parameters.json`