@echo off
title Live Price Platform
chcp 65001 >nul
color 0A

:START
cls
echo.
echo  ============================================================
echo          LIVE PRICE PLATFORM - CONTROL PANEL
echo  ============================================================
echo.
echo    STATUS:
echo    ------------------------------------------------------------
echo      Frontend  : http://localhost:3100
echo      Backend   : http://localhost:5100
echo    ------------------------------------------------------------
echo.
echo    OPTIONS:
echo    ------------------------------------------------------------
echo      [1]  START    - Start all services
echo      [2]  STOP     - Stop all services
echo      [3]  STATUS   - Check service status
echo      [4]  OPEN     - Open website in browser
echo      [5]  INSTALL  - Install dependencies
echo      [0]  EXIT     - Exit
echo    ------------------------------------------------------------
echo.

set /p choice="  Enter choice: "

if "%choice%"=="1" goto START_SERVICES
if "%choice%"=="2" goto STOP_SERVICES
if "%choice%"=="3" goto CHECK_STATUS
if "%choice%"=="4" goto OPEN_BROWSER
if "%choice%"=="5" goto INSTALL
if "%choice%"=="0" goto EXIT

echo  Invalid choice!
timeout /t 2 >nul
goto START

:START_SERVICES
cls
echo.
echo  ============================================================
echo           STARTING SERVICES...
echo  ============================================================
echo.

echo  [1/2] Starting Backend on port 5100...
cd /d "%~dp0backend"
start "Backend" cmd /c "npx tsx src/index.ts"
cd /d "%~dp0"
timeout /t 3 >nul
echo  [OK] Backend started

echo  [2/2] Starting Frontend on port 3100...
cd /d "%~dp0frontend"
start "Frontend" cmd /c "npx next dev -p 3100"
cd /d "%~dp0"
timeout /t 5 >nul
echo  [OK] Frontend started

echo.
echo  ============================================================
echo           SERVICES STARTED SUCCESSFULLY
echo  ============================================================
echo.
echo    Frontend : http://localhost:3100
echo    Backend  : http://localhost:5100
echo    ------------------------------------------------------------
echo.

echo  Opening browser...
start http://localhost:3100

set /p cont="  Press Enter to return to menu..."
goto START

:STOP_SERVICES
cls
echo.
echo  ============================================================
echo           STOPPING SERVICES...
echo  ============================================================
echo.

echo  Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo  [OK] All services stopped

echo.
echo  ============================================================
echo           SERVICES STOPPED
echo  ============================================================
echo.

set /p cont="  Press Enter to return to menu..."
goto START

:CHECK_STATUS
cls
echo.
echo  ============================================================
echo           SERVICE STATUS
echo  ============================================================
echo.

echo  Checking ports...
echo.

echo  Frontend (Port 3100):
netstat -an | findstr ":3100" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo    Status: RUNNING
    echo    URL: http://localhost:3100
) else (
    echo    Status: STOPPED
)

echo.

echo  Backend (Port 5100):
netstat -an | findstr ":5100" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo    Status: RUNNING
    echo    URL: http://localhost:5100
) else (
    echo    Status: STOPPED
)

echo.

echo  MongoDB (Port 27017):
netstat -an | findstr ":27017" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo    Status: RUNNING
) else (
    echo    Status: STOPPED (Install MongoDB)
)

echo.

echo  Redis (Port 6379):
netstat -an | findstr ":6379" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo    Status: RUNNING
) else (
    echo    Status: STOPPED (Optional)
)

echo.
echo  ============================================================
echo.

set /p cont="  Press Enter to return to menu..."
goto START

:OPEN_BROWSER
cls
echo.
echo  ============================================================
echo           OPENING WEBSITES...
echo  ============================================================
echo.

echo  Opening Marketplace...
start http://localhost:3100/marketplace

echo  Opening Dashboard...
start http://localhost:3100/dashboard

echo  Opening Admin Panel...
start http://localhost:3100/admin

echo.
echo  [OK] All websites opened
echo.

set /p cont="  Press Enter to return to menu..."
goto START

:INSTALL
cls
echo.
echo  ============================================================
echo           INSTALLING DEPENDENCIES...
echo  ============================================================
echo.

echo  [1/3] Backend...
cd /d "%~dp0backend"
call npm install
cd /d "%~dp0"
echo  [OK] Backend done

echo  [2/3] Frontend...
cd /d "%~dp0frontend"
call npm install
cd /d "%~dp0"
echo  [OK] Frontend done

echo  [3/3] Launcher...
cd /d "%~dp0"
echo  [OK] Done

echo.
echo  ============================================================
echo           INSTALLATION COMPLETE
echo  ============================================================
echo.

set /p cont="  Press Enter to return to menu..."
goto START

:EXIT
cls
echo.
echo  ============================================================
echo           Goodbye!
echo  ============================================================
echo.
timeout /t 1 >nul
exit /b 0
