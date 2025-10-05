# TKD Hub - Azure Key Vault Secrets Management Script


param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("Set", "Get", "List", "Delete")]
    [string]$Action,
   
    [Parameter(Mandatory = $true)]
    [string]$KeyVaultName,
   
    [Parameter(Mandatory = $false)]
    [string]$SecretName,
   
    [Parameter(Mandatory = $false)]
    [string]$SecretValue,
   
    [Parameter(Mandatory = $false)]
    [switch]$ShowValue
)


# Import required modules
Import-Module Az.KeyVault -Force


Write-Host "🔐 TKD Hub - Key Vault Secrets Management" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green


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


# Function to check if Key Vault exists
function Test-KeyVault {
    param([string]$VaultName)
   
    try {
        $vault = Get-AzKeyVault -VaultName $VaultName -ErrorAction Stop
        Write-Host "✅ Key Vault '$VaultName' found" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Key Vault '$VaultName' not found or no access" -ForegroundColor Red
        return $false
    }
}


# Main execution
try {
    if (-not (Test-AzureLogin)) {
        exit 1
    }
   
    if (-not (Test-KeyVault -VaultName $KeyVaultName)) {
        exit 1
    }
   
    switch ($Action) {
        "Set" {
            if (-not $SecretName -or -not $SecretValue) {
                Write-Host "❌ SecretName and SecretValue are required for Set action" -ForegroundColor Red
                exit 1
            }
           
            Write-Host "🔄 Setting secret '$SecretName' in Key Vault '$KeyVaultName'..." -ForegroundColor Yellow
           
            $secureValue = ConvertTo-SecureString $SecretValue -AsPlainText -Force
            Set-AzKeyVaultSecret -VaultName $KeyVaultName -Name $SecretName -SecretValue $secureValue
           
            Write-Host "✅ Secret '$SecretName' set successfully" -ForegroundColor Green
        }
       
        "Get" {
            if (-not $SecretName) {
                Write-Host "❌ SecretName is required for Get action" -ForegroundColor Red
                exit 1
            }
           
            Write-Host "🔄 Getting secret '$SecretName' from Key Vault '$KeyVaultName'..." -ForegroundColor Yellow
           
            try {
                $secret = Get-AzKeyVaultSecret -VaultName $KeyVaultName -Name $SecretName -AsPlainText
               
                if ($ShowValue) {
                    Write-Host "Secret Value: $secret" -ForegroundColor Cyan
                }
                else {
                    Write-Host "✅ Secret '$SecretName' retrieved successfully (use -ShowValue to display)" -ForegroundColor Green
                }
            }
            catch {
                Write-Host "❌ Failed to get secret '$SecretName': $($_.Exception.Message)" -ForegroundColor Red
                exit 1
            }
        }
       
        "List" {
            Write-Host "🔄 Listing secrets in Key Vault '$KeyVaultName'..." -ForegroundColor Yellow
           
            $secrets = Get-AzKeyVaultSecret -VaultName $KeyVaultName
           
            if ($secrets.Count -gt 0) {
                Write-Host "📋 Secrets in Key Vault:" -ForegroundColor Cyan
                $secrets | ForEach-Object {
                    $lastUpdated = if ($_.Updated) { $_.Updated.ToString("yyyy-MM-dd HH:mm:ss") } else { "N/A" }
                    Write-Host "   - $($_.Name) (Updated: $lastUpdated)" -ForegroundColor White
                }
            }
            else {
                Write-Host "📋 No secrets found in Key Vault '$KeyVaultName'" -ForegroundColor Yellow
            }
        }
       
        "Delete" {
            if (-not $SecretName) {
                Write-Host "❌ SecretName is required for Delete action" -ForegroundColor Red
                exit 1
            }
           
            Write-Host "⚠️ Are you sure you want to delete secret '$SecretName'? (y/N): " -ForegroundColor Yellow -NoNewline
            $confirmation = Read-Host
           
            if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
                Write-Host "🔄 Deleting secret '$SecretName' from Key Vault '$KeyVaultName'..." -ForegroundColor Yellow
               
                Remove-AzKeyVaultSecret -VaultName $KeyVaultName -Name $SecretName -Force
               
                Write-Host "✅ Secret '$SecretName' deleted successfully" -ForegroundColor Green
            }
            else {
                Write-Host "❌ Delete operation cancelled" -ForegroundColor Yellow
            }
        }
    }
}
catch {
    Write-Host "❌ Operation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}


Write-Host ""
Write-Host "💡 Usage Examples:" -ForegroundColor Cyan
Write-Host "   # Set a secret"
Write-Host "   .\Manage-KeyVaultSecrets.ps1 -Action Set -KeyVaultName 'tkdhub-kv' -SecretName 'MySecret' -SecretValue 'MyValue'" -ForegroundColor Gray
Write-Host ""
Write-Host "   # Get a secret (without showing value)"
Write-Host "   .\Manage-KeyVaultSecrets.ps1 -Action Get -KeyVaultName 'tkdhub-kv' -SecretName 'MySecret'" -ForegroundColor Gray
Write-Host ""
Write-Host "   # Get a secret and show its value"
Write-Host "   .\Manage-KeyVaultSecrets.ps1 -Action Get -KeyVaultName 'tkdhub-kv' -SecretName 'MySecret' -ShowValue" -ForegroundColor Gray
Write-Host ""
Write-Host "   # List all secrets"
Write-Host "   .\Manage-KeyVaultSecrets.ps1 -Action List -KeyVaultName 'tkdhub-kv'" -ForegroundColor Gray
Write-Host ""
Write-Host "   # Delete a secret"
Write-Host "   .\Manage-KeyVaultSecrets.ps1 -Action Delete -KeyVaultName 'tkdhub-kv' -SecretName 'MySecret'" -ForegroundColor Gray