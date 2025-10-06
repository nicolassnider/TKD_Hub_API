# GitHub Secrets Setup Script for TKD Hub API
# This script automatically configures all required GitHub repository secrets

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("Standard", "FreeTier", "Both")]
    [string]$DeploymentType,
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubRepo,
    
    [Parameter(Mandatory=$false)]
    [switch]$Interactive = $true,
    
    [Parameter(Mandatory=$false)]
    [switch]$WhatIf = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$ConfigFile,
    
    [Parameter(Mandatory=$false)]
    [switch]$GenerateTemplate = $false
)

# Color functions for better output
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "⚠️ $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "ℹ️ $Message" -ForegroundColor Cyan }
function Write-Header { param($Message) Write-Host "`n🔧 $Message" -ForegroundColor Magenta }

# Function to check prerequisites
function Test-Prerequisites {
    Write-Header "Checking Prerequisites"
    
    # Check if GitHub CLI is installed
    try {
        $ghVersion = gh --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "GitHub CLI is installed: $(($ghVersion -split "`n")[0])"
        }
    }
    catch {
        Write-Error "GitHub CLI (gh) is not installed or not in PATH"
        Write-Info "Install from: https://cli.github.com/"
        exit 1
    }
    
    # Check if user is authenticated
    try {
        $authStatus = gh auth status 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "GitHub CLI is authenticated"
        } else {
            Write-Error "GitHub CLI is not authenticated"
            Write-Info "Run: gh auth login"
            exit 1
        }
    }
    catch {
        Write-Error "Failed to check GitHub authentication status"
        exit 1
    }
    
    # Get repository information if not provided
    if (-not $GitHubRepo) {
        try {
            $remoteUrl = git config --get remote.origin.url 2>$null
            if ($remoteUrl -match "github\.com[:/]([^/]+)/([^/\.]+)") {
                $script:GitHubRepo = "$($matches[1])/$($matches[2])"
                Write-Success "Detected repository: $script:GitHubRepo"
            } else {
                Write-Error "Could not detect GitHub repository from git remote"
                $script:GitHubRepo = Read-Host "Please enter GitHub repository (owner/repo)"
            }
        }
        catch {
            $script:GitHubRepo = Read-Host "Please enter GitHub repository (owner/repo)"
        }
    } else {
        $script:GitHubRepo = $GitHubRepo
    }
    
    # Verify repository access
    try {
        gh repo view $script:GitHubRepo --json name 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Repository access confirmed: $script:GitHubRepo"
        } else {
            Write-Error "Cannot access repository: $script:GitHubRepo"
            exit 1
        }
    }
    catch {
        Write-Error "Failed to verify repository access"
        exit 1
    }
}

# Function to generate secure passwords
function New-SecurePassword {
    param([int]$Length = 16)
    $chars = 'ABCDEFGHKLMNOPRSTUVWXYZabcdefghiklmnoprstuvwxyz0123456789!@#$%^&*'
    return -join ((1..$Length) | ForEach-Object { $chars[(Get-Random -Minimum 0 -Maximum $chars.Length)] })
}

# Function to generate JWT key
function New-JwtKey {
    return [System.BitConverter]::ToString([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)) -replace '-', ''
}

# Function to prompt for secret value
function Get-SecretValue {
    param(
        [string]$Name,
        [string]$Description,
        [string]$DefaultValue = "",
        [bool]$IsSecure = $false,
        [bool]$IsRequired = $true,
        [string]$Example = ""
    )
    
    if (-not $Interactive -and $DefaultValue) {
        return $DefaultValue
    }
    
    $prompt = "$Name"
    if ($Description) { $prompt += " ($Description)" }
    if ($Example) { $prompt += "`n  Example: $Example" }
    if ($DefaultValue -and -not $IsSecure) { $prompt += " [Default: $DefaultValue]" }
    if (-not $IsRequired) { $prompt += " (Optional)" }
    $prompt += ": "
    
    if ($IsSecure) {
        $secureValue = Read-Host $prompt -AsSecureString
        $value = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureValue))
    } else {
        $value = Read-Host $prompt
    }
    
    if ([string]::IsNullOrWhiteSpace($value)) {
        if ($DefaultValue) {
            return $DefaultValue
        } elseif ($IsRequired) {
            Write-Warning "This secret is required. Please provide a value."
            return Get-SecretValue -Name $Name -Description $Description -DefaultValue $DefaultValue -IsSecure $IsSecure -IsRequired $IsRequired -Example $Example
        }
    }
    
    return $value
}

# Function to set GitHub secret
function Set-GitHubSecret {
    param(
        [string]$Name,
        [string]$Value,
        [string]$Repository
    )
    
    if ($WhatIf) {
        Write-Info "WHAT-IF: Would set secret '$Name' in repository '$Repository'"
        return $true
    }
    
    if ([string]::IsNullOrWhiteSpace($Value)) {
        Write-Warning "Skipping empty secret: $Name"
        return $false
    }
    
    try {
        # Use GitHub CLI to set the secret
        $Value | gh secret set $Name --repo $Repository 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Set secret: $Name"
            return $true
        } else {
            Write-Error "Failed to set secret: $Name"
            return $false
        }
    }
    catch {
        Write-Error "Error setting secret ${Name}: $($_.Exception.Message)"
        return $false
    }
}

# Function to collect Azure authentication secrets
function Get-AzureAuthSecrets {
    Write-Header "Azure Authentication Secrets (Required)"
    Write-Info "These are required for GitHub Actions to deploy to Azure"
    Write-Info "Get these from your Azure AD App Registration (Service Principal)"
    
    $secrets = @{}
    $secrets['AZURE_CLIENT_ID'] = Get-SecretValue -Name "AZURE_CLIENT_ID" -Description "Service Principal Client ID" -Example "12345678-1234-1234-1234-123456789012" -IsRequired $true
    $secrets['AZURE_TENANT_ID'] = Get-SecretValue -Name "AZURE_TENANT_ID" -Description "Azure AD Tenant ID" -Example "12345678-1234-1234-1234-123456789012" -IsRequired $true
    $secrets['AZURE_SUBSCRIPTION_ID'] = Get-SecretValue -Name "AZURE_SUBSCRIPTION_ID" -Description "Azure Subscription ID" -Example "12345678-1234-1234-1234-123456789012" -IsRequired $true
    
    return $secrets
}

# Function to collect standard deployment secrets
function Get-StandardDeploymentSecrets {
    Write-Header "Standard Deployment Secrets"
    
    $secrets = @{}
    
    # Basic Azure resources
    $secrets['AZURE_RG_NAME'] = Get-SecretValue -Name "AZURE_RG_NAME" -Description "Resource Group name" -DefaultValue "tkd-hub-rg" -Example "tkd-hub-rg"
    $secrets['APP_NAME'] = Get-SecretValue -Name "APP_NAME" -Description "Application name prefix" -DefaultValue "tkdhub" -Example "tkdhub"
    $secrets['AZURE_LOCATION'] = Get-SecretValue -Name "AZURE_LOCATION" -Description "Azure region" -DefaultValue "eastus" -IsRequired $false -Example "eastus"
    
    # Database
    $secrets['SQL_ADMIN_LOGIN'] = Get-SecretValue -Name "SQL_ADMIN_LOGIN" -Description "SQL Server admin username" -DefaultValue "sqladmin" -Example "sqladmin"
    $secrets['SQL_ADMIN_PASSWORD'] = Get-SecretValue -Name "SQL_ADMIN_PASSWORD" -Description "SQL Server admin password" -DefaultValue (New-SecurePassword -Length 20) -IsSecure $true -Example "MyStrongP@ssw0rd123!"
    
    # Admin user
    $secrets['GRANDMASTER_EMAIL'] = Get-SecretValue -Name "GRANDMASTER_EMAIL" -Description "Initial admin user email" -Example "admin@tkdhub.com" -IsRequired $true
    $secrets['GRANDMASTER_PASSWORD'] = Get-SecretValue -Name "GRANDMASTER_PASSWORD" -Description "Initial admin user password" -DefaultValue (New-SecurePassword -Length 16) -IsSecure $true -Example "AdminP@ssw0rd123!"
    
    # Optional JWT (will be auto-generated if not provided)
    $secrets['JWT_KEY'] = Get-SecretValue -Name "JWT_KEY" -Description "JWT signing key (auto-generated if empty)" -DefaultValue (New-JwtKey) -IsRequired $false -Example "64-character hex string"
    
    # Optional Dojang settings
    Write-Info "`nDojang/School Information (Optional - has defaults)"
    $secrets['DOJANG_NAME'] = Get-SecretValue -Name "DOJANG_NAME" -Description "School/Dojang name" -DefaultValue "TKD Hub Central" -IsRequired $false -Example "My Martial Arts School"
    $secrets['DOJANG_ADDRESS'] = Get-SecretValue -Name "DOJANG_ADDRESS" -Description "School address" -DefaultValue "Main Street 123" -IsRequired $false -Example "123 Training Way"
    $secrets['DOJANG_LOCATION'] = Get-SecretValue -Name "DOJANG_LOCATION" -Description "City/Location" -DefaultValue "Central City" -IsRequired $false -Example "My City"
    $secrets['DOJANG_PHONE'] = Get-SecretValue -Name "DOJANG_PHONE" -Description "Contact phone" -IsRequired $false -Example "555-123-4567"
    $secrets['DOJANG_EMAIL'] = Get-SecretValue -Name "DOJANG_EMAIL" -Description "Contact email" -IsRequired $false -Example "info@myschool.com"
    
    # Optional Grand Master customization
    Write-Info "`nAdmin User Customization (Optional)"
    $secrets['GRANDMASTER_FIRST_NAME'] = Get-SecretValue -Name "GRANDMASTER_FIRST_NAME" -Description "Admin first name" -DefaultValue "Grand" -IsRequired $false -Example "Master"
    $secrets['GRANDMASTER_LAST_NAME'] = Get-SecretValue -Name "GRANDMASTER_LAST_NAME" -Description "Admin last name" -DefaultValue "Master" -IsRequired $false -Example "Smith"
    
    # Optional third-party integrations
    Write-Info "`nThird-Party Integrations (Optional - leave empty to disable)"
    $secrets['MERCADOPAGO_PUBLIC_KEY'] = Get-SecretValue -Name "MERCADOPAGO_PUBLIC_KEY" -Description "MercadoPago public key" -IsRequired $false -Example "TEST-a83e3239-d403-45b3-b71b-5222133f91b4"
    $secrets['MERCADOPAGO_ACCESS_TOKEN'] = Get-SecretValue -Name "MERCADOPAGO_ACCESS_TOKEN" -Description "MercadoPago access token" -IsRequired $false -IsSecure $true -Example "TEST-4654559135754755..."
    $secrets['SERVICEBUS_CONNECTION_STRING'] = Get-SecretValue -Name "SERVICEBUS_CONNECTION_STRING" -Description "Azure Service Bus connection" -IsRequired $false -IsSecure $true -Example "Endpoint=sb://..."
    $secrets['SIGNALR_CONNECTION_STRING'] = Get-SecretValue -Name "SIGNALR_CONNECTION_STRING" -Description "Azure SignalR connection" -IsRequired $false -IsSecure $true -Example "Endpoint=https://..."
    
    return $secrets
}

# Function to collect FREE TIER deployment secrets
function Get-FreeTierDeploymentSecrets {
    Write-Header "FREE TIER Deployment Secrets"
    
    $secrets = @{}
    
    # FREE TIER Azure resources (different names to avoid conflicts)
    $secrets['AZURE_RG_NAME_FREE'] = Get-SecretValue -Name "AZURE_RG_NAME_FREE" -Description "FREE TIER Resource Group name" -DefaultValue "tkd-hub-free-rg" -Example "tkd-hub-free-rg"
    $secrets['APP_NAME_FREE'] = Get-SecretValue -Name "APP_NAME_FREE" -Description "FREE TIER Application name prefix" -DefaultValue "tkdhubfree" -Example "tkdhubfree"
    
    # Database (same as standard)
    $secrets['SQL_ADMIN_LOGIN'] = Get-SecretValue -Name "SQL_ADMIN_LOGIN" -Description "SQL Server admin username" -DefaultValue "sqladmin" -Example "sqladmin"
    $secrets['SQL_ADMIN_PASSWORD'] = Get-SecretValue -Name "SQL_ADMIN_PASSWORD" -Description "SQL Server admin password" -DefaultValue (New-SecurePassword -Length 20) -IsSecure $true -Example "MyStrongP@ssw0rd123!"
    
    # Admin user (same as standard)
    $secrets['GRANDMASTER_EMAIL'] = Get-SecretValue -Name "GRANDMASTER_EMAIL" -Description "Initial admin user email" -Example "admin@tkdhub.com" -IsRequired $true
    $secrets['GRANDMASTER_PASSWORD'] = Get-SecretValue -Name "GRANDMASTER_PASSWORD" -Description "Initial admin user password" -DefaultValue (New-SecurePassword -Length 16) -IsSecure $true -Example "AdminP@ssw0rd123!"
    
    # Optional settings (same as standard but fewer options for FREE TIER)
    Write-Info "`nOptional Settings (FREE TIER)"
    $secrets['JWT_KEY'] = Get-SecretValue -Name "JWT_KEY" -Description "JWT signing key (auto-generated if empty)" -DefaultValue (New-JwtKey) -IsRequired $false
    $secrets['DOJANG_NAME'] = Get-SecretValue -Name "DOJANG_NAME" -Description "School name" -DefaultValue "TKD Hub Central (Free)" -IsRequired $false
    $secrets['DOJANG_ADDRESS'] = Get-SecretValue -Name "DOJANG_ADDRESS" -Description "School address" -DefaultValue "Main Street 123" -IsRequired $false
    $secrets['DOJANG_LOCATION'] = Get-SecretValue -Name "DOJANG_LOCATION" -Description "City/Location" -DefaultValue "Central City" -IsRequired $false
    $secrets['DOJANG_PHONE'] = Get-SecretValue -Name "DOJANG_PHONE" -Description "Contact phone" -IsRequired $false
    $secrets['DOJANG_EMAIL'] = Get-SecretValue -Name "DOJANG_EMAIL" -Description "Contact email" -IsRequired $false
    $secrets['GRANDMASTER_FIRST_NAME'] = Get-SecretValue -Name "GRANDMASTER_FIRST_NAME" -Description "Admin first name" -DefaultValue "Grand" -IsRequired $false
    $secrets['GRANDMASTER_LAST_NAME'] = Get-SecretValue -Name "GRANDMASTER_LAST_NAME" -Description "Admin last name" -DefaultValue "Master" -IsRequired $false
    
    return $secrets
}

# Function to load configuration from JSON file
function Import-SecretsConfig {
    param([string]$ConfigFilePath)
    
    if (-not (Test-Path $ConfigFilePath)) {
        Write-Error "Configuration file not found: $ConfigFilePath"
        return $null
    }
    
    try {
        $config = Get-Content $ConfigFilePath -Raw | ConvertFrom-Json
        Write-Success "Loaded configuration from: $ConfigFilePath"
        return $config
    }
    catch {
        Write-Error "Failed to parse configuration file: $($_.Exception.Message)"
        return $null
    }
}

# Function to extract secrets from config object
function Convert-ConfigToSecrets {
    param($Config)
    
    $secrets = @{}
    
    # Recursively extract secrets from config sections
    function Extract-Secrets {
        param($Object, $Prefix = "")
        
        foreach ($property in $Object.PSObject.Properties) {
            $key = $property.Name
            $value = $property.Value
            
            # Skip metadata properties
            if ($key.StartsWith("_") -or $key -eq "deployment_type") {
                continue
            }
            
            if ($value -is [PSCustomObject]) {
                # Recurse into nested objects
                Extract-Secrets -Object $value -Prefix $Prefix
            }
            elseif ($key.EndsWith("_example")) {
                # Skip example keys, look for actual keys
                $actualKey = $key -replace "_example$", ""
                if (-not $secrets.ContainsKey($actualKey) -and $Object.PSObject.Properties[$actualKey]) {
                    $secrets[$actualKey] = $Object.PSObject.Properties[$actualKey].Value
                }
            }
            elseif (-not $key.EndsWith("_example") -and $value -and $value.ToString().Trim()) {
                # This is an actual secret value
                $secrets[$key] = $value.ToString().Trim()
            }
        }
    }
    
    Extract-Secrets -Object $Config
    return $secrets
}

# Function to generate template configuration file
function New-TemplateConfig {
    param([string]$OutputPath = "secrets-config.json")
    
    if (Test-Path $OutputPath) {
        $overwrite = Read-Host "File '$OutputPath' exists. Overwrite? (y/N)"
        if ($overwrite -notmatch '^y|yes$') {
            Write-Info "Template generation cancelled"
            return
        }
    }
    
    try {
        Copy-Item "secrets-config.template.json" $OutputPath
        Write-Success "Template created: $OutputPath"
        Write-Info "1. Edit the file and replace '_example' keys with actual keys"
        Write-Info "2. Fill in your values"  
        Write-Info "3. Run: .\Setup-GitHubSecrets.ps1 -ConfigFile $OutputPath"
        Write-Warning "⚠️ Do NOT commit the config file to source control!"
    }
    catch {
        Write-Error "Failed to create template: $($_.Exception.Message)"
    }
}

# Main execution
try {
    Write-Host "🚀 TKD Hub API - GitHub Secrets Setup" -ForegroundColor Magenta
    Write-Host "========================================" -ForegroundColor Magenta
    
    # Handle template generation
    if ($GenerateTemplate) {
        New-TemplateConfig
        return
    }
    
    # Check prerequisites
    Test-Prerequisites
    
    # Handle configuration file input
    if ($ConfigFile) {
        Write-Info "Loading configuration from file: $ConfigFile"
        $config = Import-SecretsConfig -ConfigFilePath $ConfigFile
        if (-not $config) {
            exit 1
        }
        
        # Extract deployment type from config if not specified
        if (-not $DeploymentType -and $config.deployment_type) {
            $DeploymentType = $config.deployment_type
            Write-Info "Using deployment type from config: $DeploymentType"
        }
        
        # Convert config to secrets hash table
        $allSecrets = Convert-ConfigToSecrets -Config $config
        Write-Info "Extracted $($allSecrets.Count) secrets from configuration file"
        
        # Set non-interactive mode when using config file
        $script:Interactive = $false
    }
    else {
        # Interactive mode - collect secrets manually
        if (-not $DeploymentType) {
            Write-Info "Available deployment types:"
            Write-Info "  Standard  - Full enterprise features (~$82/month)"
            Write-Info "  FreeTier  - Minimal cost deployment (~$5.50/month)"  
            Write-Info "  Both      - Setup for both deployment types"
            
            do {
                $DeploymentType = Read-Host "Select deployment type (Standard/FreeTier/Both)"
            } while ($DeploymentType -notin @("Standard", "FreeTier", "Both"))
        }
        
        # Collect Azure authentication secrets (required for all deployments)
        $azureSecrets = Get-AzureAuthSecrets
        
        # Collect deployment-specific secrets
        $deploymentSecrets = @{}
        
        switch ($DeploymentType) {
            "Standard" {
                Write-Info "Setting up secrets for STANDARD deployment (~$82/month)"
                $deploymentSecrets = Get-StandardDeploymentSecrets
            }
            "FreeTier" {
                Write-Info "Setting up secrets for FREE TIER deployment (~$5.50/month)"
                $deploymentSecrets = Get-FreeTierDeploymentSecrets
            }
            "Both" {
                Write-Info "Setting up secrets for BOTH standard and FREE TIER deployments"
                $standardSecrets = Get-StandardDeploymentSecrets
                $freeTierSecrets = Get-FreeTierDeploymentSecrets
                
                # Combine secrets, FREE TIER specific ones take precedence for duplicates
                $deploymentSecrets = $standardSecrets.Clone()
                foreach ($key in $freeTierSecrets.Keys) {
                    $deploymentSecrets[$key] = $freeTierSecrets[$key]
                }
            }
        }
        
        # Combine all secrets
        $allSecrets = @{}
        foreach ($key in $azureSecrets.Keys) {
            $allSecrets[$key] = $azureSecrets[$key]
        }
        foreach ($key in $deploymentSecrets.Keys) {
            $allSecrets[$key] = $deploymentSecrets[$key]
        }
    }
    
    # Display summary
    Write-Header "Secrets Summary"
    Write-Info "Repository: $script:GitHubRepo"
    Write-Info "Deployment Type: $DeploymentType"
    Write-Info "Total Secrets: $($allSecrets.Count)"
    
    if ($WhatIf) {
        Write-Warning "WHAT-IF MODE - No secrets will be actually set"
    }
    
    # Confirm before setting secrets
    if ($Interactive -and -not $WhatIf) {
        $confirm = Read-Host "`nProceed with setting $($allSecrets.Count) secrets in $script:GitHubRepo? (y/N)"
        if ($confirm -notmatch '^y|yes$') {
            Write-Warning "Operation cancelled by user"
            exit 0
        }
    }
    
    # Set secrets in GitHub
    Write-Header "Setting GitHub Secrets"
    $successCount = 0
    $failureCount = 0
    
    foreach ($secretName in ($allSecrets.Keys | Sort-Object)) {
        $secretValue = $allSecrets[$secretName]
        if (Set-GitHubSecret -Name $secretName -Value $secretValue -Repository $script:GitHubRepo) {
            $successCount++
        } else {
            $failureCount++
        }
    }
    
    # Final summary
    Write-Header "Setup Complete"
    Write-Success "$successCount secrets set successfully"
    if ($failureCount -gt 0) {
        Write-Warning "$failureCount secrets failed to set"
    }
    
    # Next steps
    Write-Header "Next Steps"
    switch ($DeploymentType) {
        "Standard" {
            Write-Info "1. Push changes to 'main' branch to trigger standard deployment"
            Write-Info "2. Monitor deployment in GitHub Actions"
            Write-Info "3. Estimated cost: ~$82/month"
        }
        "FreeTier" {
            Write-Info "1. Create and push 'free-tier' branch: git checkout -b free-tier && git push origin free-tier"
            Write-Info "2. Monitor deployment in GitHub Actions"
            Write-Info "3. Estimated cost: ~$5.50/month"
        }
        "Both" {
            Write-Info "1. Push to 'main' branch for standard deployment OR"
            Write-Info "2. Create 'free-tier' branch for FREE TIER deployment"
            Write-Info "3. Costs: Standard ~$82/month, FREE TIER ~$5.50/month"
        }
    }
    
    Write-Success "GitHub secrets setup completed successfully! 🎉"
}
catch {
    Write-Error "Script execution failed: $($_.Exception.Message)"
    exit 1
}
