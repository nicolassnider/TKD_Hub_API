# TKD Hub - Local Development Setup Script
# Sets up the development environment


param(
    [Parameter(Mandatory = $false)]
    [switch]$SkipDotnetRestore,
   
    [Parameter(Mandatory = $false)]
    [switch]$SkipNpmInstall,
   
    [Parameter(Mandatory = $false)]
    [switch]$StartServices
)


Write-Host "🚀 TKD Hub - Local Development Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green


# Function to check if a command exists
function Test-Command {
    param([string]$Command)
   
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}


# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow


$prerequisites = @{
    "dotnet" = ".NET SDK"
    "node" = "Node.js"
    "npm" = "npm"
    "func" = "Azure Functions Core Tools"
}


$missingPrereqs = @()
foreach ($cmd in $prerequisites.Keys) {
    if (Test-Command $cmd) {
        Write-Host "✅ $($prerequisites[$cmd]) found" -ForegroundColor Green
    }
    else {
        Write-Host "❌ $($prerequisites[$cmd]) not found" -ForegroundColor Red
        $missingPrereqs += $prerequisites[$cmd]
    }
}


if ($missingPrereqs.Count -gt 0) {
    Write-Host ""
    Write-Host "❌ Missing prerequisites:" -ForegroundColor Red
    $missingPrereqs | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Please install the missing prerequisites and run the script again." -ForegroundColor Yellow
    exit 1
}


Write-Host ""
Write-Host "🔧 Setting up development environment..." -ForegroundColor Yellow


# Restore .NET packages
if (-not $SkipDotnetRestore) {
    Write-Host "📦 Restoring .NET packages..." -ForegroundColor Cyan
   
    try {
        dotnet restore
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ .NET packages restored successfully" -ForegroundColor Green
        }
        else {
            throw "dotnet restore failed"
        }
    }
    catch {
        Write-Host "❌ Failed to restore .NET packages: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "⏭️ Skipping .NET package restore" -ForegroundColor Yellow
}


# Install npm packages
if (-not $SkipNpmInstall) {
    Write-Host "📦 Installing npm packages for SPA..." -ForegroundColor Cyan
   
    $spaPath = Join-Path $PSScriptRoot "frontend\spa"
   
    if (Test-Path $spaPath) {
        Push-Location $spaPath
        try {
            npm install
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ npm packages installed successfully" -ForegroundColor Green
            }
            else {
                throw "npm install failed"
            }
        }
        catch {
            Write-Host "❌ Failed to install npm packages: $($_.Exception.Message)" -ForegroundColor Red
            exit 1
        }
        finally {
            Pop-Location
        }
    }
    else {
        Write-Host "⚠️ SPA directory not found: $spaPath" -ForegroundColor Yellow
    }
}
else {
    Write-Host "⏭️ Skipping npm package installation" -ForegroundColor Yellow
}


# Check appsettings configuration
Write-Host "⚙️ Checking Web API configuration..." -ForegroundColor Cyan


$appSettingsPath = Join-Path $PSScriptRoot "src\TKDHubAPI.WebAPI\appsettings.Development.json"


if (Test-Path $appSettingsPath) {
    Write-Host "✅ appsettings.Development.json found" -ForegroundColor Green
}
else {
    Write-Host "⚠️ appsettings.Development.json not found. Creating from template..." -ForegroundColor Yellow
   
    $appSettings = @{
        "ConnectionStrings" = @{
            "DefaultConnection" = "Server=(localdb)\mssqllocaldb;Database=TKDHubDb;Trusted_Connection=True;MultipleActiveResultSets=true;"
        }
        "Logging" = @{
            "LogLevel" = @{
                "Default" = "Information"
                "Microsoft.AspNetCore" = "Warning"
            }
        }
    }
   
    $appSettings | ConvertTo-Json -Depth 3 | Set-Content $appSettingsPath -Encoding UTF8
    Write-Host "✅ appsettings.Development.json created" -ForegroundColor Green
}


# Build the solution
Write-Host "🏗️ Building the solution..." -ForegroundColor Cyan


try {
    dotnet build --configuration Debug
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Solution built successfully" -ForegroundColor Green
    }
    else {
        throw "dotnet build failed"
    }
}
catch {
    Write-Host "❌ Failed to build solution: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}


# Start services if requested
if ($StartServices) {
    Write-Host ""
    Write-Host "🚀 Starting development services..." -ForegroundColor Yellow
   
    # Start Web API
    Write-Host "Starting ASP.NET Core Web API..." -ForegroundColor Cyan
    $webApiPath = Join-Path $PSScriptRoot "src\TKDHubAPI.WebAPI"
   
    Start-Process -FilePath "dotnet" -ArgumentList "run", "--project", $webApiPath -WindowStyle Normal
   
    Start-Sleep -Seconds 3
   
    # Start SPA
    Write-Host "Starting React SPA..." -ForegroundColor Cyan
    $spaPath = Join-Path $PSScriptRoot "frontend\spa"
   
    if (Test-Path $spaPath) {
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WorkingDirectory $spaPath -WindowStyle Normal
    }
   
    Write-Host ""
    Write-Host "🌐 Services started:" -ForegroundColor Green
    Write-Host "   - ASP.NET Core Web API: https://localhost:7071" -ForegroundColor White
    Write-Host "   - React SPA: http://localhost:5173" -ForegroundColor White
}


Write-Host ""
Write-Host "🎉 Development environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Quick commands:" -ForegroundColor Cyan
Write-Host "   # Start Web API"
Write-Host "   cd src\TKDHubAPI.WebAPI && dotnet run" -ForegroundColor Gray
Write-Host ""
Write-Host "   # Start React SPA"
Write-Host "   cd frontend\spa && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   # Run tests"
Write-Host "   dotnet test" -ForegroundColor Gray
Write-Host ""
Write-Host "   # Deploy to Azure"
Write-Host "   .\Deploy-TKDHub-Complete.ps1 -ResourceGroupName 'your-rg' -AppName 'your-app'" -ForegroundColor Gray