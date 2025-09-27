# TKD Hub API - Test Runner Script
# This script runs tests with various options and provides formatted output


param(
    [switch]$Coverage,      # Run with code coverage
    [switch]$Watch,         # Run in watch mode
    [switch]$Clean,         # Clean before running
    [switch]$Verbose,       # Verbose output
    [string]$Filter = "",   # Test filter (e.g., "ClassName" or "TestMethod")
    [switch]$Help          # Show help
)


function Show-Help {
    Write-Host ""
    Write-Host "🧪 TKD Hub API Test Runner" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\run-tests.ps1 [options]" -ForegroundColor White
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "  -Coverage     Run tests with code coverage collection" -ForegroundColor White
    Write-Host "  -Watch        Run tests in watch mode (re-run on file changes)" -ForegroundColor White
    Write-Host "  -Clean        Clean test results before running" -ForegroundColor White
    Write-Host "  -Verbose      Show detailed test output" -ForegroundColor White
    Write-Host "  -Filter       Filter tests by class or method name" -ForegroundColor White
    Write-Host "  -Help         Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\run-tests.ps1                          # Run all tests" -ForegroundColor Gray
    Write-Host "  .\run-tests.ps1 -Coverage                # Run with coverage" -ForegroundColor Gray
    Write-Host "  .\run-tests.ps1 -Watch                   # Watch mode" -ForegroundColor Gray
    Write-Host "  .\run-tests.ps1 -Filter DojaangService   # Run specific tests" -ForegroundColor Gray
    Write-Host "  .\run-tests.ps1 -Clean -Coverage         # Clean and run with coverage" -ForegroundColor Gray
    Write-Host ""
}


if ($Help) {
    Show-Help
    exit 0
}


# Clean test results if requested
if ($Clean) {
    Write-Host "🧹 Cleaning test results..." -ForegroundColor Yellow
    if (Test-Path "test-results") {
        Remove-Item -Recurse -Force "test-results"
        Write-Host "✅ Test results cleaned" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ No test results to clean" -ForegroundColor Cyan
    }
}


# Ensure we're in the project root
if (-not (Test-Path "TKD_Hub_API.sln")) {
    Write-Host "❌ Error: This script must be run from the project root directory" -ForegroundColor Red
    exit 1
}


Write-Host ""
Write-Host "🧪 TKD Hub API Test Runner" -ForegroundColor Cyan
Write-Host "==========================" -ForegroundColor Cyan
Write-Host ""


# Build the dotnet test command
$testArgs = @("test")


# Add verbosity
if ($Verbose) {
    $testArgs += @("--verbosity", "detailed")
} else {
    $testArgs += @("--verbosity", "normal")
}


# Add filter if specified
if ($Filter) {
    $testArgs += @("--filter", $Filter)
    Write-Host "🔍 Running tests matching: $Filter" -ForegroundColor Yellow
}


# Add coverage collection if requested
if ($Coverage) {
    Write-Host "📊 Code coverage collection enabled" -ForegroundColor Yellow
    $testArgs += @(
        "--collect", "XPlat Code Coverage",
        "--settings", "coverlet.runsettings",
        "--logger", "trx",
        "--results-directory", "./test-results"
    )
}


# Handle watch mode
if ($Watch) {
    Write-Host "👀 Running tests in watch mode (press Ctrl+C to exit)" -ForegroundColor Yellow
    Write-Host ""
    $watchArgs = @("watch") + $testArgs
    & dotnet @watchArgs
} else {
    Write-Host "🚀 Running tests..." -ForegroundColor Yellow
    Write-Host ""
   
    # Run the tests
    $testStart = Get-Date
    & dotnet @testArgs
    $testEnd = Get-Date
    $testDuration = $testEnd - $testStart
   
    Write-Host ""
    Write-Host "⏱️ Test execution completed in $($testDuration.TotalSeconds.ToString('F2')) seconds" -ForegroundColor Cyan
   
    # If coverage was enabled, show coverage info
    if ($Coverage -and (Test-Path "test-results")) {
        Write-Host ""
        Write-Host "📈 Coverage results generated in test-results folder" -ForegroundColor Green
       
        # Look for coverage files
        $coverageFiles = Get-ChildItem -Path "test-results" -Filter "coverage.cobertura.xml" -Recurse
        if ($coverageFiles.Count -gt 0) {
            Write-Host "📊 Coverage files found:" -ForegroundColor Yellow
            $coverageFiles | ForEach-Object {
                Write-Host "   - $($_.FullName)" -ForegroundColor Gray
            }
        }
       
        # Look for trx files
        $trxFiles = Get-ChildItem -Path "test-results" -Filter "*.trx" -Recurse
        if ($trxFiles.Count -gt 0) {
            Write-Host "📋 Test result files found:" -ForegroundColor Yellow
            $trxFiles | ForEach-Object {
                Write-Host "   - $($_.FullName)" -ForegroundColor Gray
            }
        }
    }
}


Write-Host ""
Write-Host "✅ Test runner completed" -ForegroundColor Green