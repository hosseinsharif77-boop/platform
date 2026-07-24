@echo off
chcp 65001 >nul
title Live Price Platform - Quick Start

echo.
echo ===============================================
echo    Live Price Platform - Quick Start
echo ===============================================
echo.
echo   Frontend : http://localhost:3100
echo   Backend  : http://localhost:5100/api
echo.
echo ===============================================
echo.

echo  [1/5] Starting MongoDB...
docker start live-price-mongodb >nul 2>&1
if %errorlevel% neq 0 (
    docker-compose up -d mongodb >nul 2>&1
)
echo  [OK] MongoDB started

echo  [2/5] Starting Redis...
docker start live-price-redis >nul 2>&1
if %errorlevel% neq 0 (
    docker-compose up -d redis >nul 2>&1
)
echo  [OK] Redis started

echo  [3/5] Waiting for services...
timeout /t 3 >nul
echo  [OK] Services ready

echo  [4/5] Starting Backend (Port 5100)...
cd backend
start "LivePrice-Backend" cmd /k "set PORT=5100 && npx tsx watch src/index.ts"
cd ..

echo  [5/5] Starting Frontend (Port 3100)...
cd frontend
start "LivePrice-Frontend" cmd /k "set PORT=3100 && npm run dev"
cd ..

echo.
echo ===============================================
echo    ALL SERVICES STARTED
echo ===============================================
echo.
echo   Frontend   : http://localhost:3100
echo   Backend    : http://localhost:5100/api
echo   Marketplace: http://localhost:3100/marketplace
echo   Dashboard  : http://localhost:3100/dashboard
echo   Admin      : http://localhost:3100/admin
echo.
echo ===============================================
echo.

echo  Opening browser in 3 seconds...
timeout /t 3 >nul
start http://localhost:3100

echo.
echo  Press any key to exit...
pause >nul
