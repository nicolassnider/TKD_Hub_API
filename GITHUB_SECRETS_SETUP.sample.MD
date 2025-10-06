# GitHub Secrets Configuration


## How to Add Secrets to GitHub


1. Go to your GitHub repository: `https://github.com/nicolassnider/TKD_Hub_API`
2. Click on **Settings** tab
3. Click on **Secrets and variables** > **Actions** in the left sidebar
4. Click **New repository secret** for each secret below


## Required Secrets


### ✅ Azure Authentication (Ready to configure)


| Secret Name | Value |
|-------------|-------|
| `AZURE_CLIENT_ID` | `###` |
| `AZURE_TENANT_ID` | `###` |
| `AZURE_SUBSCRIPTION_ID` | `###` |


### ❗ Additional Secrets (You need to decide these values)


| Secret Name | Example Value | Description |
|-------------|---------------|-------------|
| `AZURE_RG_NAME` | `tkd-hub-rg` | Azure Resource Group name |
| `APP_NAME` | `tkdhub` | Application name prefix |
| `SQL_ADMIN_LOGIN` | `###` | SQL Server administrator username |
| `SQL_ADMIN_PASSWORD` | `###` | SQL Server administrator password |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | *(Get after infrastructure deployment)* | Static Web App deployment token |


## Optional Secrets


| Secret Name | Example Value | Default |
|-------------|---------------|---------|
| `AZURE_LOCATION` | `East US` | `East US` |


## Next Steps


1. **Configure the secrets above in GitHub**
2. **Run the workflow** - Push to main branch or trigger manually
3. **Get Static Web App token** - After infrastructure is deployed, you'll get the token from Azure portal
4. **Add the Static Web App token** as the final secret


## Testing the Setup


After configuring all secrets, you can test by:
- Pushing a commit to the `master` branch
- Or going to **Actions** tab and manually triggering "Deploy TKD Hub to Azure"


The workflow should now run successfully! 🚀
