// Main Bicep template for TKD Hub deployment
// Deploys: Function App (Flex Consumption) + Static Web App + SQL + Key Vault + Storage + Application Insights

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
param environment string = 'prod'

@description('JWT signing key for token authentication')
@secure()
param jwtKey string

@description('JWT issuer URL')
param jwtIssuer string

@description('JWT audience URL')
param jwtAudience string

@description('MercadoPago public key')
param mercadoPagoPublicKey string = ''

@description('MercadoPago access token')
@secure()
param mercadoPagoAccessToken string = ''

@description('Azure Service Bus connection string')
@secure()
param serviceBusConnectionString string = ''

@description('Azure SignalR connection string')
@secure()
param signalRConnectionString string = ''

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

// Variables
var webAppName = '${appName}-api'
var staticWebAppName = '${appName}-swa'
var storageAccountName = replace(replace(toLower('${appName}storage'), '-', ''), '_', '')
var keyVaultName = '${appName}-kv-${uniqueString(resourceGroup().id)}'
var sqlServerName = '${appName}-sql'
var sqlDatabaseName = 'TKDHubDb'
var applicationInsightsName = '${appName}-ai'
var logAnalyticsWorkspaceName = '${appName}-law'
var appServicePlanName = '${appName}-asp'

// Parameters
@description('Deployment timestamp for tagging')
param deploymentTime string = utcNow()

// Tags
var commonTags = {
  application: 'TKD-Hub'
  environment: environment
  deployedBy: 'Bicep'
  deployedAt: deploymentTime
}

// Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  tags: commonTags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

// Application Insights
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: location
  tags: commonTags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
    IngestionMode: 'LogAnalytics'
  }
}

// Storage Account for Function App
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  tags: commonTags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    supportsHttpsTrafficOnly: true
    allowBlobPublicAccess: false
    minimumTlsVersion: 'TLS1_2'
    encryption: {
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    networkAcls: {
      bypass: 'AzureServices'
      virtualNetworkRules: []
      ipRules: []
      defaultAction: 'Allow'
    }
  }
}

// Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: keyVaultName
  location: location
  tags: commonTags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: tenant().tenantId
    enabledForDeployment: true
    enabledForDiskEncryption: false
    enabledForTemplateDeployment: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
    enableRbacAuthorization: false
    accessPolicies: []
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

// SQL Server
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

// SQL Database
resource sqlDatabase 'Microsoft.Sql/servers/databases@2023-05-01-preview' = {
  parent: sqlServer
  name: sqlDatabaseName
  location: location
  tags: commonTags
  sku: {
    name: 'Basic'
    tier: 'Basic'
    capacity: 5
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648 // 2GB
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

// App Service Plan for Web API
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  tags: commonTags
  sku: {
    name: 'S1'
    tier: 'Standard'
  }
  properties: {
    reserved: true // Linux
  }
}

// Web App for ASP.NET Core API
resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: webAppName
  location: location
  tags: commonTags
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    reserved: true
    httpsOnly: true
    clientAffinityEnabled: false
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|8.0'
      alwaysOn: true
      http20Enabled: true
      minTlsVersion: '1.2'
      scmMinTlsVersion: '1.2'
      ftpsState: 'Disabled'
      healthCheckPath: '/health'
      appSettings: [
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
        }
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: 'Production'
        }
        {
          name: 'ConnectionStrings__DefaultConnection'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=ConnectionStrings--DefaultConnection)'
        }
        {
          name: 'Jwt__Key'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=Jwt--Key)'
        }
        {
          name: 'Jwt__Issuer'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=Jwt--Issuer)'
        }
        {
          name: 'Jwt__Audience'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=Jwt--Audience)'
        }
        {
          name: 'Jwt__ExpiresInMinutes'
          value: '120'
        }
        {
          name: 'MercadoPago__PublicKey'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=MercadoPago--PublicKey)'
        }
        {
          name: 'MercadoPago__AccessToken'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=MercadoPago--AccessToken)'
        }
        {
          name: 'AzureServiceBus__ConnectionString'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=AzureServiceBus--ConnectionString)'
        }
        {
          name: 'AzureServiceBus__PaymentQueue'
          value: 'mercadopago-payments'
        }
        {
          name: 'Azure__SignalR__ConnectionString'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=Azure--SignalR--ConnectionString)'
        }
        {
          name: 'DojaangSettings__Name'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=DojaangSettings--Name)'
        }
        {
          name: 'DojaangSettings__Address'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=DojaangSettings--Address)'
        }
        {
          name: 'DojaangSettings__Location'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=DojaangSettings--Location)'
        }
        {
          name: 'DojaangSettings__PhoneNumber'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=DojaangSettings--PhoneNumber)'
        }
        {
          name: 'DojaangSettings__Email'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=DojaangSettings--Email)'
        }
        {
          name: 'GrandMasterSettings__FirstName'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=GrandMasterSettings--FirstName)'
        }
        {
          name: 'GrandMasterSettings__LastName'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=GrandMasterSettings--LastName)'
        }
        {
          name: 'GrandMasterSettings__Email'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=GrandMasterSettings--Email)'
        }
        {
          name: 'GrandMasterSettings__Password'
          value: '@Microsoft.KeyVault(VaultName=${keyVaultName};SecretName=GrandMasterSettings--Password)'
        }
        {
          name: 'PaginationSettings__DefaultPageSize'
          value: '10'
        }
        {
          name: 'PaginationSettings__MaxPageSize'
          value: '100'
        }
      ]
      cors: {
        allowedOrigins: [
          'https://portal.azure.com'
          'https://${staticWebAppName}.azurestaticapps.net'
          'http://localhost:3000'
          'http://localhost:5173'
        ]
        supportCredentials: true
      }
    }
  }
}

// Set Web App as Azure AD administrator for SQL Server
resource sqlServerAADAdmin 'Microsoft.Sql/servers/administrators@2023-05-01-preview' = {
  parent: sqlServer
  name: 'ActiveDirectory'
  properties: {
    administratorType: 'ActiveDirectory'
    login: webApp.name
    sid: webApp.identity.principalId
    tenantId: webApp.identity.tenantId
  }
}

// Grant Web App access to Key Vault
resource keyVaultAccessPolicy 'Microsoft.KeyVault/vaults/accessPolicies@2023-07-01' = {
  name: 'add'
  parent: keyVault
  properties: {
    accessPolicies: [
      {
        tenantId: tenant().tenantId
        objectId: webApp.identity.principalId
        permissions: {
          secrets: [
            'get'
            'list'
          ]
        }
      }
    ]
  }
}

// Store all application secrets in Key Vault
resource connectionStringSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'ConnectionStrings--DefaultConnection'
  properties: {
    value: 'Server=tcp:${sqlServer.properties.fullyQualifiedDomainName},1433;Initial Catalog=${sqlDatabaseName};Authentication=Active Directory Managed Identity;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
  }
}

resource jwtKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'Jwt--Key'
  properties: {
    value: jwtKey
  }
}

resource jwtIssuerSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'Jwt--Issuer'
  properties: {
    value: jwtIssuer
  }
}

resource jwtAudienceSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'Jwt--Audience'
  properties: {
    value: jwtAudience
  }
}

resource mercadoPagoPublicKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (mercadoPagoPublicKey != '') {
  parent: keyVault
  name: 'MercadoPago--PublicKey'
  properties: {
    value: mercadoPagoPublicKey
  }
}

resource mercadoPagoAccessTokenSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (mercadoPagoAccessToken != '') {
  parent: keyVault
  name: 'MercadoPago--AccessToken'
  properties: {
    value: mercadoPagoAccessToken
  }
}

resource serviceBusConnectionStringSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (serviceBusConnectionString != '') {
  parent: keyVault
  name: 'AzureServiceBus--ConnectionString'
  properties: {
    value: serviceBusConnectionString
  }
}

resource signalRConnectionStringSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = if (signalRConnectionString != '') {
  parent: keyVault
  name: 'Azure--SignalR--ConnectionString'
  properties: {
    value: signalRConnectionString
  }
}

resource dojaangNameSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'DojaangSettings--Name'
  properties: {
    value: dojaangName
  }
}

resource dojaangAddressSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'DojaangSettings--Address'
  properties: {
    value: dojaangAddress
  }
}

resource dojaangLocationSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'DojaangSettings--Location'
  properties: {
    value: dojaangLocation
  }
}

resource dojaangPhoneSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'DojaangSettings--PhoneNumber'
  properties: {
    value: dojaangPhoneNumber
  }
}

resource dojaangEmailSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'DojaangSettings--Email'
  properties: {
    value: dojaangEmail
  }
}

resource grandMasterFirstNameSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'GrandMasterSettings--FirstName'
  properties: {
    value: grandMasterFirstName
  }
}

resource grandMasterLastNameSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'GrandMasterSettings--LastName'
  properties: {
    value: grandMasterLastName
  }
}

resource grandMasterEmailSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'GrandMasterSettings--Email'
  properties: {
    value: grandMasterEmail
  }
}

resource grandMasterPasswordSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  parent: keyVault
  name: 'GrandMasterSettings--Password'
  properties: {
    value: grandMasterPassword
  }
}

// Static Web App
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
    stagingEnvironmentPolicy: 'Enabled'
    enterpriseGradeCdnStatus: 'Disabled'
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
output keyVaultName string = keyVault.name
output keyVaultUri string = keyVault.properties.vaultUri
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
output sqlDatabaseName string = sqlDatabase.name
output applicationInsightsConnectionString string = applicationInsights.properties.ConnectionString
output storageAccountName string = storageAccount.name
output resourceGroupName string = resourceGroup().name
