# PowerShell Setup Script for Windows Server VPS

Write-Host "=== Windows Server VPS Setup for Fiverr Review Collector ===" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Please run as Administrator!" -ForegroundColor Red
    exit 1
}

# Install Chocolatey if not present
Write-Host "1. Checking Chocolatey..." -ForegroundColor Yellow
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Chocolatey..." -ForegroundColor Green
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
} else {
    Write-Host "Chocolatey already installed" -ForegroundColor Green
}

# Install Node.js
Write-Host "2. Installing Node.js..." -ForegroundColor Yellow
choco install nodejs -y

# Refresh environment variables
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Install Git
Write-Host "3. Installing Git..." -ForegroundColor Yellow
choco install git -y

# Check RDS is enabled
Write-Host "4. Checking Remote Desktop Services..." -ForegroundColor Yellow
$rdpService = Get-Service -Name "TermService" -ErrorAction SilentlyContinue
if ($rdpService) {
    Write-Host "Remote Desktop Services: $($rdpService.Status)" -ForegroundColor Green
    if ($rdpService.Status -ne "Running") {
        Start-Service -Name "TermService"
        Write-Host "Started Remote Desktop Services" -ForegroundColor Green
    }
} else {
    Write-Host "Remote Desktop Services not found" -ForegroundColor Yellow
}

# Enable RDP firewall rule
Write-Host "5. Configuring firewall..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "Remote Desktop" -Direction Inbound -LocalPort 3389 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue
Write-Host "Firewall rule created/updated" -ForegroundColor Green

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Connect via RDP to $env:COMPUTERNAME:3389" -ForegroundColor White
Write-Host "2. Navigate to project directory" -ForegroundColor White
Write-Host "3. Run: npm install" -ForegroundColor White
Write-Host "4. Run: npx playwright install chrome" -ForegroundColor White
Write-Host "5. Run: npm run buyer username" -ForegroundColor White
Write-Host ""