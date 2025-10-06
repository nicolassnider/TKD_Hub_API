// Cost-Optimized Bicep template for TKD Hub deployment
// Deploys: Web App (Free tier) + Static Web App (Free) + SQL Database (Basic) + Storage (minimal)
// Estimated cost: ~$5-10/month

@description('Name of the application')
param appName string

@description('Location for all resources')
param location string = resourceGroup().location

@description('SQL Server administrator login')
param sqlAdminLogin string

@description('SQL Server administrator password')
@secure()
param sqlAdminPassword string

@description('Environment name')
param environment string = 'dev'

@description('JWT signing key for token authentication')
@secure()
param jwtKey string

@description('JWT issuer URL')
param jwtIssuer string

@description('JWT audience URL')
param jwtAudience string

@description('Dojang name')
param dojaangName string = 'TKD Hub Central'

@description('Dojang address')
param dojaangAddress string = 'Main Street 123'

@description('Dojang location')
param dojaangLocation string = 'Central City'

@description('Dojang phone number')
param dojaangPhoneNumber string = ''

@description('Dojang email')
param dojaangEmail string = ''

@description('Grand Master first name')
param grandMasterFirstName string = 'Grand'

@description('Grand Master last name')
param grandMasterLastName string = 'Master'

@description('Grand Master email')
param grandMasterEmail string = ''

@description('Grand Master password')
@secure()
param grandMasterPassword string

// Variables for cost-optimized resources
var webAppName = '${appName}-api-free'
var staticWebAppName = '${appName}-swa-free'
var storageAccountName = replace(replace(toLower('${appName}freestorage'), '-', ''), '_', '')
var sqlServerName = '${appName}-sql-free'
var sqlDatabaseName = 'TKDHubDb'

// Parameters
@description('Deployment timestamp for tagging')
param deploymentTime string = utcNow()

// Tags
var commonTags = {
  application: 'TKD-Hub'
  environment: environment
  deployedBy: 'Bicep'
  deployedAt: deploymentTime
  costTier: 'Free'
}

// Storage Account for minimal storage needs (LRS - cheapest option)
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  tags: commonTags
  sku: {
    name: 'Standard_LRS' // Cheapest option
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
    accessTier: 'Cool' // Cheaper access tier
  }
}

// SQL Server (same as regular, but will use Basic database)
resource sqlServer 'Microsoft.Sql/servers@2023-05-01-preview' = {
  name: sqlServerName
  location: location
  tags: commonTags
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
}

// SQL Database - Basic tier (cheapest SQL option ~$5/month)
resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  tags: commonTags
  sku: {
    name: 'Basic'
    tier: 'Basic'
    capacity: 5 // DTU
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648 // 2GB max for Basic
  }
}

// Allow Azure services to access SQL Server
resource sqlServerFirewallRuleAzure 'Microsoft.Sql/servers/firewallRules@2023-05-01-preview' = {
  parent: sqlServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// App Service Plan - FREE tier (F1) - $0/month
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: '${appName}-asp-free'
  location: location
  tags: commonTags
  sku: {
    name: 'F1'     // FREE tier
    tier: 'Free'
    size: 'F1'
    capacity: 1
  }
  properties: {
    reserved: false // Windows (cheaper than Linux for free tier)
  }
}

// Web App for ASP.NET Core API - FREE tier
resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: webAppName
  location: location
  tags: commonTags
  kind: 'app'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    clientAffinityEnabled: false
    siteConfig: {
      netFrameworkVersion: 'v8.0'
      defaultDocuments: []
      httpLoggingEnabled: false // Disable to save space
      requestTracingEnabled: false // Disable to save space
      detailedErrorLoggingEnabled: false // Disable to save space
      appSettings: [
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: 'Production'
        }
        {
          name: 'ConnectionStrings__DefaultConnection'
          value: 'Server=tcp:${sqlServer.properties.fullyQualifiedDomainName},1433;Initial Catalog=${sqlDatabaseName};Persist Security Info=False;User ID=${sqlAdminLogin};Password=${sqlAdminPassword};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
        }
        {
          name: 'Jwt__Key'
          value: jwtKey
        }
        {
          name: 'Jwt__Issuer'
          value: jwtIssuer
        }
        {
          name: 'Jwt__Audience'
          value: jwtAudience
        }
        {
          name: 'Jwt__ExpiresInMinutes'
          value: '120'
        }
        {
          name: 'DojaangSettings__Name'
          value: dojaangName
        }
        {
          name: 'DojaangSettings__Address'
          value: dojaangAddress
        }
        {
          name: 'DojaangSettings__Location'
          value: dojaangLocation
        }
        {
          name: 'DojaangSettings__PhoneNumber'
          value: dojaangPhoneNumber
        }
        {
          name: 'DojaangSettings__Email'
          value: dojaangEmail
        }
        {
          name: 'GrandMasterSettings__FirstName'
          value: grandMasterFirstName
        }
        {
          name: 'GrandMasterSettings__LastName'
          value: grandMasterLastName
        }
        {
          name: 'GrandMasterSettings__Email'
          value: grandMasterEmail
        }
        {
          name: 'GrandMasterSettings__Password'
          value: grandMasterPassword
        }
        {
          name: 'PaginationSettings__DefaultPageSize'
          value: '10'
        }
        {
          name: 'PaginationSettings__MaxPageSize'
          value: '50' // Reduced for free tier
        }
        {
          name: 'Cors__AllowedOrigins__0'
          value: 'https://${staticWebAppName}.azurestaticapps.net'
        }
        {
          name: 'Cors__AllowedOrigins__1'
          value: 'http://localhost:3000'
        }
        {
          name: 'Cors__AllowedOrigins__2'
          value: 'http://localhost:5173'
        }
        {
          name: 'Cors__AllowCredentials'
          value: 'true'
        }
      ]
    }
  }
}

// Static Web App - FREE tier ($0/month)
resource staticWebApp 'Microsoft.Web/staticSites@2023-01-01' = {
  name: staticWebAppName
  location: location
  tags: commonTags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    allowConfigFileUpdates: true
    stagingEnvironmentPolicy: 'Disabled' // Disable staging for free tier
    enterpriseGradeCdnStatus: 'Disabled' // Disable CDN for free tier
  }
}

// Configure Static Web App to connect to Web App API
resource staticWebAppConfig 'Microsoft.Web/staticSites/config@2023-01-01' = {
  parent: staticWebApp
  name: 'appsettings'
  properties: {
    API_BASE_URL: 'https://${webApp.properties.defaultHostName}/api'
  }
}

// Outputs
output webAppName string = webApp.name
output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
output staticWebAppName string = staticWebApp.name
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
output sqlServerName string = sqlServer.name
output storageAccountName string = storageAccount.name
output estimatedMonthlyCost string = 'SQL Database Basic: ~$5/month + Storage LRS: ~$0.50/month + Web App & Static Web App: FREE = Total: ~$5.50/month'
