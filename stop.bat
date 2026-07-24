@echo off
title Stop Services

echo Stopping services...

taskkill /F /IM node.exe 2>nul

echo All services stopped.
timeout /t 2 >nul
