# 🔍 GitHub Secrets Verification Script
# This script verifies that all required GitHub secrets are properly configured

param(
    [Parameter(Mandatory = $false)]
    [ValidateSet("Standard", "FreeTier", "Both")]
    [string]$DeploymentType = "Both",
    
    [Parameter(Mandatory = $false)]
    [switch]$ShowValues = $false,
    
    [Parameter(Mandatory = $false)]
    [switch]$Detailed = $false
)

# Check if GitHub CLI is installed and authenticated
function Test-GitHubCLI {
    try {
        $null = gh auth status 2>&1
        return $true
    }
    catch {
        return $false
    }
}

# Get all GitHub secrets
function Get-GitHubSecrets {
    try {
        $output = gh secret list --json name,createdAt,updatedAt | ConvertFrom-Json
        return $output
    }
    catch {
        Write-Error "Failed to retrieve GitHub secrets: $_"
        return @()
    }
}

# Required secrets by deployment type
$RequiredSecrets = @{
    "Common" = @(
        "AZURE_CLIENT_ID",
        "AZURE_TENANT_ID", 
        "AZURE_SUBSCRIPTION_ID",
        "SQL_ADMIN_LOGIN",
        "SQL_ADMIN_PASSWORD",
        "GRANDMASTER_EMAIL",
        "GRANDMASTER_PASSWORD"
    )
    "Standard" = @(
        "AZURE_RG_NAME",
        "APP_NAME"
    )
    "FreeTier" = @(
        "AZURE_RG_NAME_FREE",
        "APP_NAME_FREE"
    )
}

$OptionalSecrets = @(
    "AZURE_LOCATION",
    "JWT_KEY",
    "DOJANG_NAME",
    "DOJANG_ADDRESS",
    "DOJANG_LOCATION", 
    "DOJANG_PHONE",
    "DOJANG_EMAIL",
    "GRANDMASTER_FIRST_NAME",
    "GRANDMASTER_LAST_NAME",
    "MERCADOPAGO_PUBLIC_KEY",
    "MERCADOPAGO_ACCESS_TOKEN",
    "SERVICEBUS_CONNECTION_STRING",
    "SIGNALR_CONNECTION_STRING"
)

# Main verification function
function Test-SecretsConfiguration {
    Write-Host "🔍 GitHub Secrets Verification" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Check GitHub CLI
    if (-not (Test-GitHubCLI)) {
        Write-Host "❌ GitHub CLI not installed or not authenticated" -ForegroundColor Red
        Write-Host "   Run: gh auth login" -ForegroundColor Yellow
        return
    }
    
    Write-Host "✅ GitHub CLI authenticated" -ForegroundColor Green
    Write-Host ""
    
    # Get current secrets
    $currentSecrets = Get-GitHubSecrets
    $secretNames = $currentSecrets | ForEach-Object { $_.name }
    
    Write-Host "📊 Found $($secretNames.Count) secrets in repository" -ForegroundColor Blue
    Write-Host ""
    
    # Build required secrets list based on deployment type
    $requiredForDeployment = @()
    
    # Always include common secrets
    $requiredForDeployment += $RequiredSecrets["Common"]
    
    # Add deployment-specific secrets
    switch ($DeploymentType) {
        "Standard" { $requiredForDeployment += $RequiredSecrets["Standard"] }
        "FreeTier" { $requiredForDeployment += $RequiredSecrets["FreeTier"] }
        "Both" { 
            $requiredForDeployment += $RequiredSecrets["Standard"]
            $requiredForDeployment += $RequiredSecrets["FreeTier"]
        }
    }
    
    # Check required secrets
    Write-Host "🔐 Required Secrets Status:" -ForegroundColor Magenta
    Write-Host "===========================" -ForegroundColor Magenta
    
    $missingSecrets = @()
    $foundSecrets = 0
    
    foreach ($secret in $requiredForDeployment) {
        if ($secretNames -contains $secret) {
            $secretInfo = $currentSecrets | Where-Object { $_.name -eq $secret }
            Write-Host "✅ $secret" -ForegroundColor Green -NoNewline
            
            if ($Detailed) {
                Write-Host " (Updated: $($secretInfo.updatedAt))" -ForegroundColor Gray
            } else {
                Write-Host ""
            }
            
            if ($ShowValues) {
                try {
                    $value = gh secret get $secret 2>$null
                    if ($value) {
                        $maskedValue = $value.Substring(0, [Math]::Min(4, $value.Length)) + "***"
                        Write-Host "   Value: $maskedValue" -ForegroundColor Gray
                    }
                } catch {
                    Write-Host "   Value: [Cannot retrieve]" -ForegroundColor Yellow
                }
            }
            
            $foundSecrets++
        } else {
            Write-Host "❌ $secret" -ForegroundColor Red
            $missingSecrets += $secret
        }
    }
    
    Write-Host ""
    
    # Check optional secrets
    Write-Host "🎨 Optional Secrets Status:" -ForegroundColor Blue
    Write-Host "===========================" -ForegroundColor Blue
    
    $foundOptional = 0
    foreach ($secret in $OptionalSecrets) {
        if ($secretNames -contains $secret) {
            $secretInfo = $currentSecrets | Where-Object { $_.name -eq $secret }
            Write-Host "✅ $secret" -ForegroundColor Green -NoNewline
            
            if ($Detailed) {
                Write-Host " (Updated: $($secretInfo.updatedAt))" -ForegroundColor Gray
            } else {
                Write-Host ""
            }
            
            $foundOptional++
        } else {
            Write-Host "⚪ $secret" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    
    # Summary
    Write-Host "📋 Summary:" -ForegroundColor Cyan
    Write-Host "============" -ForegroundColor Cyan
    
    $totalRequired = $requiredForDeployment.Count
    $completionPercentage = [Math]::Round(($foundSecrets / $totalRequired) * 100, 1)
    
    Write-Host "Required secrets: $foundSecrets/$totalRequired ($completionPercentage%)" -ForegroundColor $(if ($foundSecrets -eq $totalRequired) { "Green" } else { "Yellow" })
    Write-Host "Optional secrets: $foundOptional/$($OptionalSecrets.Count)" -ForegroundColor Blue
    Write-Host ""
    
    # Deployment readiness
    if ($missingSecrets.Count -eq 0) {
        Write-Host "🚀 Deployment Ready!" -ForegroundColor Green
        Write-Host "All required secrets are configured for $DeploymentType deployment." -ForegroundColor Green
    } else {
        Write-Host "⚠️  Deployment Not Ready" -ForegroundColor Yellow
        Write-Host "Missing required secrets:" -ForegroundColor Red
        foreach ($secret in $missingSecrets) {
            Write-Host "   - $secret" -ForegroundColor Red
        }
        Write-Host ""
        Write-Host "Run the setup script to configure missing secrets:" -ForegroundColor Yellow
        Write-Host "   .\Setup-GitHubSecrets.ps1 -DeploymentType $DeploymentType" -ForegroundColor Cyan
    }
    
    Write-Host ""
    
    # Extra secrets (not in our lists)
    $knownSecrets = $requiredForDeployment + $OptionalSecrets
    $extraSecrets = $secretNames | Where-Object { $_ -notin $knownSecrets }
    
    if ($extraSecrets.Count -gt 0) {
        Write-Host "🔧 Additional Secrets Found:" -ForegroundColor Magenta
        foreach ($secret in $extraSecrets) {
            Write-Host "   • $secret" -ForegroundColor Magenta
        }
        Write-Host ""
    }
}

# Help function
function Show-Help {
    Write-Host "🔍 GitHub Secrets Verification Script" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "USAGE:" -ForegroundColor Yellow
    Write-Host "   .\Verify-GitHubSecrets.ps1 [options]"
    Write-Host ""
    Write-Host "OPTIONS:" -ForegroundColor Yellow
    Write-Host "   -DeploymentType  Standard|FreeTier|Both  (default: Both)"
    Write-Host "   -ShowValues      Show masked secret values"
    Write-Host "   -Detailed        Show additional details like update dates"
    Write-Host ""
    Write-Host "EXAMPLES:" -ForegroundColor Green
    Write-Host "   .\Verify-GitHubSecrets.ps1"
    Write-Host "   .\Verify-GitHubSecrets.ps1 -DeploymentType FreeTier"
    Write-Host "   .\Verify-GitHubSecrets.ps1 -Detailed -ShowValues"
    Write-Host ""
}

# Show help if requested
if ($args -contains "-h" -or $args -contains "--help" -or $args -contains "/?") {
    Show-Help
    return
}

# Run verification
Test-SecretsConfiguration
