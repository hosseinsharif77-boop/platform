@echo off
chcp 65001 >nul
title Live Price Platform - Installer

echo.
echo ===============================================
echo    Live Price Platform - Installer
echo ===============================================
echo.

echo  [1/6] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js not found!
    echo  Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo  [OK] Node.js installed

echo  [2/6] Installing root dependencies...
npm install --ignore-scripts
echo  [OK] Root dependencies installed

echo  [3/6] Installing backend dependencies...
cd backend
npm install
cd ..
echo  [OK] Backend dependencies installed

echo  [4/6] Installing frontend dependencies...
cd frontend
npm install
cd ..
echo  [OK] Frontend dependencies installed

echo  [5/6] Installing launcher dependencies...
cd launcher
npm install
cd ..
echo  [OK] Launcher dependencies installed

echo  [6/6] Creating environment files...
if not exist "backend\.env" (
    echo # Server> backend\.env
    echo NODE_ENV=development>> backend\.env
    echo PORT=5100>> backend\.env
    echo MONGODB_URI=mongodb://localhost:27017/live-price-platform>> backend\.env
    echo JWT_SECRET=live-price-platform-secret-key-2024>> backend\.env
    echo JWT_REFRESH_SECRET=live-price-platform-refresh-secret-2024>> backend\.env
    echo JWT_EXPIRES_IN=7d>> backend\.env
    echo JWT_REFRESH_EXPIRES_IN=30d>> backend\.env
    echo CORS_ORIGIN=http://localhost:3100>> backend\.env
    echo LOG_LEVEL=info>> backend\.env
)

if not exist "frontend\.env.local" (
    echo NEXT_PUBLIC_APP_NAME=Live Price Platform> frontend\.env.local
    echo NEXT_PUBLIC_APP_URL=http://localhost:3100>> frontend\.env.local
    echo NEXT_PUBLIC_API_URL=http://localhost:5100/api>> frontend\.env.local
)

echo.
echo ===============================================
echo    Installation Complete!
echo ===============================================
echo.
echo  Run launcher.bat to start the application.
echo.
pause
