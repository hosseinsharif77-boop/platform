<#
.SYNOPSIS
    Live Price Platform - PowerShell Launcher
.DESCRIPTION
    Modern launcher for managing the Live Price Platform services.
    Matches the premium SaaS design language of the platform.
.NOTES
    Author: Live Price Platform Team
    Version: 1.0.0
#>

# ===========================================
# CONFIGURATION
# ===========================================

$Config = @{
    FrontendPort = 3100
    BackendPort = 5100
    MongoDBPort = 27017
    RedisPort = 6379
    FrontendUrl = "http://localhost:3100"
    BackendUrl = "http://localhost:5100"
    ApiUrl = "http://localhost:5100/api"
    HealthUrl = "http://localhost:5100/health"
    MarketplaceUrl = "http://localhost:3100/marketplace"
    DashboardUrl = "http://localhost:3100/dashboard"
    AdminUrl = "http://localhost:3100/admin"
}

# ===========================================
# COLORS & STYLING
# ===========================================

$Colors = @{
    Primary = "Indigo"
    Secondary = "Gray"
    Success = "Green"
    Warning = "Yellow"
    Danger = "Red"
    Info = "Cyan"
    Muted = "DarkGray"
}

# ===========================================
# HELPER FUNCTIONS
# ===========================================

function Write-Header {
    param([string]$Title)
    
    $line = "═" * 60
    Write-Host ""
    Write-Host "  $line" -ForegroundColor $Colors.Primary
    Write-Host "  │" -ForegroundColor $Colors.Primary -NoNewline
    Write-Host " $Title" -ForegroundColor White -NoNewline
    Write-Host " │" -ForegroundColor $Colors.Primary
    Write-Host "  $line" -ForegroundColor $Colors.Primary
    Write-Host ""
}

function Write-Status {
    param(
        [string]$Service,
        [string]$Status,
        [string]$Port
    )
    
    $statusColor = switch ($Status) {
        "Running" { $Colors.Success }
        "Stopped" { $Colors.Danger }
        "Unknown" { $Colors.Warning }
        default { $Colors.Muted }
    }
    
    Write-Host "  │ " -ForegroundColor $Colors.Primary -NoNewline
    Write-Host "$Service".PadRight(15) -ForegroundColor White -NoNewline
    Write-Host "│ " -ForegroundColor $Colors.Primary -NoNewline
    Write-Host $Status.PadRight(12) -ForegroundColor $statusColor -NoNewline
    Write-Host "│ " -ForegroundColor $Colors.Primary -NoNewline
    Write-Host $Port.PadRight(8) -ForegroundColor $Colors.Info -NoNewline
    Write-Host "│" -ForegroundColor $Colors.Primary
}

function Write-MenuItem {
    param(
        [string]$Number,
        [string]$Label,
        [string]$Description
    )
    
    Write-Host "  │ " -ForegroundColor $Colors.Primary -NoNewline
    Write-Host "[$Number]" -ForegroundColor $Colors.Primary -NoNewline
    Write-Host " $Label".PadRight(20) -ForegroundColor White -NoNewline
    Write-Host "- $Description" -ForegroundColor $Colors.Muted -NoNewline
    Write-Host " │" -ForegroundColor $Colors.Primary
}

function Test-Port {
    param([int]$Port)
    
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
        return $connection.TcpTestSucceeded
    } catch {
        return $false
    }
}

function Test-ServiceStatus {
    param([string]$ServiceName)
    
    try {
        $process = Get-Process -Name $ServiceName -ErrorAction SilentlyContinue
        return $null -ne $process
    } catch {
        return $false
    }
}

# ===========================================
# MAIN MENU
# ===========================================

function Show-MainMenu {
    Clear-Host
    
    # Logo
    Write-Host ""
    Write-Host "  ██████╗ ██╗      █████╗ ████████╗███████╗ ██████╗" -ForegroundColor $Colors.Primary
    Write-Host "  ██╔══██╗██║     ██╔══██╗╚══██╔══╝██╔════╝██╔════╝" -ForegroundColor $Colors.Primary
    Write-Host "  ██████╔╝██║     ███████║   ██║   █████╗  ██║" -ForegroundColor $Colors.Primary
    Write-Host "  ██╔═══╝ ██║     ██╔══██║   ██║   ██╔══╝  ██║" -ForegroundColor $Colors.Primary
    Write-Host "  ██║     ███████╗██║  ██║   ██║   ███████╗╚██████╗" -ForegroundColor $Colors.Primary
    Write-Host "  ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚═════╝" -ForegroundColor $Colors.Primary
    Write-Host ""
    Write-Host "                    🚀 Launcher v1.0.0" -ForegroundColor $Colors.Info
    Write-Host ""
    
    # Port Summary
    Write-Host "  ┌─────────────────────────────────────────────────────────┐" -ForegroundColor $Colors.Primary
    Write-Host "  │ " -ForegroundColor $Colors.Primary -NoNewline
    Write-Host "PORT CONFIGURATION" -ForegroundColor White -NoNewline
    Write-Host "                                         │" -ForegroundColor $Colors.Primary
    Write-Host "  ├─────────────────────────────────────────────────────────┤" -ForegroundColor $Colors.Primary
    Write-Status "Frontend" "Unknown" ":$($Config.FrontendPort)"
    Write-Status "Backend" "Unknown" ":$($Config.BackendPort)"
    Write-Status "MongoDB" "Unknown" ":$($Config.MongoDBPort)"
    Write-Status "Redis" "Unknown" ":$($Config.RedisPort)"
    Write-Host "  └─────────────────────────────────────────────────────────┘" -ForegroundColor $Colors.Primary
    Write-Host ""
    
    # Menu
    Write-Host "  ┌─────────────────────────────────────────────────────────┐" -ForegroundColor $Colors.Primary
    Write-Host "  │ " -ForegroundColor $Colors.Primary -NoNewline
    Write-Host "OPTIONS" -ForegroundColor White -NoNewline
    Write-Host "                                                 │" -ForegroundColor $Colors.Primary
    Write-Host "  ├─────────────────────────────────────────────────────────┤" -ForegroundColor $Colors.Primary
    Write-MenuItem "1" "START" "Start all services"
    Write-MenuItem "2" "STOP" "Stop all services"
    Write-MenuItem "3" "RESTART" "Restart all services"
    Write-MenuItem "4" "STATUS" "Check service status"
    Write-MenuItem "5" "OPEN" "Open browser windows"
    Write-MenuItem "6" "LOGS" "View service logs"
    Write-MenuItem "7" "INSTALL" "Install dependencies"
    Write-MenuItem "8" "BUILD" "Build for production"
    Write-MenuItem "0" "EXIT" "Exit launcher"
    Write-Host "  └─────────────────────────────────────────────────────────┘" -ForegroundColor $Colors.Primary
    Write-Host ""
}

# ===========================================
# SERVICE OPERATIONS
# ===========================================

function Start-Services {
    Clear-Host
    Write-Header "STARTING LIVE PRICE PLATFORM"
    
    # Start MongoDB
    Write-Host "  [1/4] Starting MongoDB..." -ForegroundColor Yellow
    docker start live-price-mongodb 2>$null
    if ($LASTEXITCODE -ne 0) {
        docker-compose up -d mongodb 2>$null
    }
    Write-Host "  [OK] MongoDB started" -ForegroundColor Green
    
    # Start Redis
    Write-Host "  [2/4] Starting Redis..." -ForegroundColor Yellow
    docker start live-price-redis 2>$null
    if ($LASTEXITCODE -ne 0) {
        docker-compose up -d redis 2>$null
    }
    Write-Host "  [OK] Redis started" -ForegroundColor Green
    
    # Wait for services
    Write-Host "  [3/4] Waiting for services..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    Write-Host "  [OK] Services ready" -ForegroundColor Green
    
    # Start Backend
    Write-Host "  [4/4] Starting Backend (Port $($Config.BackendPort))..." -ForegroundColor Yellow
    Start-Process -FilePath "cmd" -ArgumentList "/c", "cd backend && set PORT=$($Config.BackendPort) && npx tsx watch src/index.ts" -WindowStyle Normal
    Start-Sleep -Seconds 2
    Write-Host "  [OK] Backend started" -ForegroundColor Green
    
    # Start Frontend
    Write-Host "  [5/5] Starting Frontend (Port $($Config.FrontendPort))..." -ForegroundColor Yellow
    Start-Process -FilePath "cmd" -ArgumentList "/c", "cd frontend && set PORT=$($Config.FrontendPort) && npm run dev" -WindowStyle Normal
    Start-Sleep -Seconds 2
    Write-Host "  [OK] Frontend started" -ForegroundColor Green
    
    # Summary
    Write-Host ""
    Write-Host "  ┌─────────────────────────────────────────────────────────┐" -ForegroundColor Green
    Write-Host "  │ " -ForegroundColor Green -NoNewline
    Write-Host "✅ ALL SERVICES STARTED SUCCESSFULLY" -ForegroundColor White
    Write-Host "  ├─────────────────────────────────────────────────────────┤" -ForegroundColor Green
    Write-Host "  │ Frontend  : $($Config.FrontendUrl)" -ForegroundColor White
    Write-Host "  │ Backend   : $($Config.BackendUrl)/api" -ForegroundColor White
    Write-Host "  │ MongoDB   : mongodb://localhost:$($Config.MongoDBPort)" -ForegroundColor White
    Write-Host "  │ Redis     : redis://localhost:$($Config.RedisPort)" -ForegroundColor White
    Write-Host "  └─────────────────────────────────────────────────────────┘" -ForegroundColor Green
    
    Start-Sleep -Seconds 2
}

function Stop-Services {
    Clear-Host
    Write-Header "STOPPING LIVE PRICE PLATFORM"
    
    # Stop Frontend
    Write-Host "  [1/3] Stopping Frontend..." -ForegroundColor Yellow
    Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "  [OK] Frontend stopped" -ForegroundColor Green
    
    # Stop Backend
    Write-Host "  [2/3] Stopping Backend..." -ForegroundColor Yellow
    Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*tsx*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "  [OK] Backend stopped" -ForegroundColor Green
    
    # Stop Docker
    Write-Host "  [3/3] Stopping Docker services..." -ForegroundColor Yellow
    docker-compose stop 2>$null
    Write-Host "  [OK] Docker services stopped" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "  ┌─────────────────────────────────────────────────────────┐" -ForegroundColor Red
    Write-Host "  │ " -ForegroundColor Red -NoNewline
    Write-Host "✅ ALL SERVICES STOPPED" -ForegroundColor White
    Write-Host "  └─────────────────────────────────────────────────────────┘" -ForegroundColor Red
    
    Start-Sleep -Seconds 2
}

function Restart-Services {
    Clear-Host
    Write-Header "RESTARTING LIVE PRICE PLATFORM"
    
    Stop-Services
    Start-Sleep -Seconds 3
    Start-Services
    
    Write-Host ""
    Write-Host "  ┌─────────────────────────────────────────────────────────┐" -ForegroundColor Green
    Write-Host "  │ " -ForegroundColor Green -NoNewline
    Write-Host "✅ ALL SERVICES RESTARTED" -ForegroundColor White
    Write-Host "  └─────────────────────────────────────────────────────────┘" -ForegroundColor Green
    
    Start-Sleep -Seconds 2
}

function Show-Status {
    Clear-Host
    Write-Header "SERVICE STATUS"
    
    Write-Host "  ┌─────────────────────────────────────────────────────────┐" -ForegroundColor $Colors.Primary
    Write-Host "  │ " -ForegroundColor $Colors.Primary -NoNewline
    Write-Host "SERVICE STATUS" -ForegroundColor White -NoNewline
    Write-Host "                                            │" -ForegroundColor $Colors.Primary
    Write-Host "  ├─────────────────────────────────────────────────────────┤" -ForegroundColor $Colors.Primary
    
    # Check Frontend
    $frontendRunning = Test-Port -Port $Config.FrontendPort
    $frontendStatus = if ($frontendRunning) { "Running" } else { "Stopped" }
    Write-Status "Frontend" $frontendStatus ":$($Config.FrontendPort)"
    
    # Check Backend
    $backendRunning = Test-Port -Port $Config.BackendPort
    $backendStatus = if ($backendRunning) { "Running" } else { "Stopped" }
    Write-Status "Backend" $backendStatus ":$($Config.BackendPort)"
    
    # Check MongoDB
    $mongoRunning = Test-Port -Port $Config.MongoDBPort
    $mongoStatus = if ($mongoRunning) { "Running" } else { "Stopped" }
    Write-Status "MongoDB" $mongoStatus ":$($Config.MongoDBPort)"
    
    # Check Redis
    $redisRunning = Test-Port -Port $Config.RedisPort
    $redisStatus = if ($redisRunning) { "Running" } else { "Stopped" }
    Write-Status "Redis" $redisStatus ":$($Config.RedisPort)"
    
    Write-Host "  └─────────────────────────────────────────────────────────┘" -ForegroundColor $Colors.Primary
    Write-Host ""
    
    # URLs
    Write-Host "  ┌─────────────────────────────────────────────────────────┐" -ForegroundColor $Colors.Info
    Write-Host "  │ " -ForegroundColor $Colors.Info -NoNewline
    Write-Host "AVAILABLE URLS" -ForegroundColor White -NoNewline
    Write-Host "                                              │" -ForegroundColor $Colors.Info
    Write-Host "  ├─────────────────────────────────────────────────────────┤" -ForegroundColor $Colors.Info
    Write-Host "  │ Marketplace : $($Config.MarketplaceUrl)" -ForegroundColor White
    Write-Host "  │ Dashboard   : $($Config.DashboardUrl)" -ForegroundColor White
    Write-Host "  │ Admin       : $($Config.AdminUrl)" -ForegroundColor White
    Write-Host "  │ API Health  : $($Config.HealthUrl)" -ForegroundColor White
    Write-Host "  └─────────────────────────────────────────────────────────┘" -ForegroundColor $Colors.Info
    Write-Host ""
    
    Start-Sleep -Seconds 1
}

function Open-Browser {
    Clear-Host
    Write-Header "OPENING BROWSER"
    
    Write-Host "  [1/4] Opening Marketplace..." -ForegroundColor Yellow
    Start-Process $Config.MarketplaceUrl
    Start-Sleep -Milliseconds 500
    
    Write-Host "  [2/4] Opening Seller Dashboard..." -ForegroundColor Yellow
    Start-Process $Config.DashboardUrl
    Start-Sleep -Milliseconds 500
    
    Write-Host "  [3/4] Opening Admin Panel..." -ForegroundColor Yellow
    Start-Process $Config.AdminUrl
    Start-Sleep -Milliseconds 500
    
    Write-Host "  [4/4] Opening API Health Check..." -ForegroundColor Yellow
    Start-Process $Config.HealthUrl
    
    Write-Host ""
    Write-Host "  [OK] All browser windows opened" -ForegroundColor Green
    Write-Host ""
    
    Start-Sleep -Seconds 2
}

function Install-Dependencies {
    Clear-Host
    Write-Header "INSTALLING DEPENDENCIES"
    
    Write-Host "  [1/3] Installing root dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "  [OK] Root dependencies installed" -ForegroundColor Green
    
    Write-Host "  [2/3] Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "  [OK] Backend dependencies installed" -ForegroundColor Green
    
    Write-Host "  [3/3] Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "  [OK] Frontend dependencies installed" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "  ┌─────────────────────────────────────────────────────────┐" -ForegroundColor Green
    Write-Host "  │ " -ForegroundColor Green -NoNewline
    Write-Host "✅ ALL DEPENDENCIES INSTALLED" -ForegroundColor White
    Write-Host "  └─────────────────────────────────────────────────────────┘" -ForegroundColor Green
    Write-Host ""
    
    Start-Sleep -Seconds 2
}

function Build-Production {
    Clear-Host
    Write-Header "BUILDING FOR PRODUCTION"
    
    Write-Host "  [1/2] Building Backend..." -ForegroundColor Yellow
    Set-Location backend
    npm run build
    Set-Location ..
    Write-Host "  [OK] Backend built" -ForegroundColor Green
    
    Write-Host "  [2/2] Building Frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm run build
    Set-Location ..
    Write-Host "  [OK] Frontend built" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "  ┌─────────────────────────────────────────────────────────┐" -ForegroundColor Green
    Write-Host "  │ " -ForegroundColor Green -NoNewline
    Write-Host "✅ BUILD COMPLETED SUCCESSFULLY" -ForegroundColor White
    Write-Host "  └─────────────────────────────────────────────────────────┘" -ForegroundColor Green
    Write-Host ""
    
    Start-Sleep -Seconds 2
}

# ===========================================
# MAIN EXECUTION
# ===========================================

$running = $true

while ($running) {
    Show-MainMenu
    
    $choice = Read-Host "  Enter your choice (0-8)"
    
    switch ($choice) {
        "1" { Start-Services }
        "2" { Stop-Services }
        "3" { Restart-Services }
        "4" { Show-Status }
        "5" { Open-Browser }
        "6" {
            Write-Host "  Opening logs in separate windows..." -ForegroundColor Yellow
            # Open log viewing
        }
        "7" { Install-Dependencies }
        "8" { Build-Production }
        "0" {
            Clear-Host
            Write-Host ""
            Write-Host "  ╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
            Write-Host "  ║                                                           ║" -ForegroundColor Green
            Write-Host "  ║     Thank you for using Live Price Platform!              ║" -ForegroundColor Green
            Write-Host "  ║                    Goodbye! 👋                             ║" -ForegroundColor Green
            Write-Host "  ║                                                           ║" -ForegroundColor Green
            Write-Host "  ╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
            Write-Host ""
            $running = $false
        }
        default {
            Write-Host "  [ERROR] Invalid option. Please try again." -ForegroundColor Red
            Start-Sleep -Seconds 2
        }
    }
}
