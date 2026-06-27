@echo off
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed on this system.
    echo Please install Node.js [v18 or above] first.
    echo Official Download URL: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

node "%~dp0src\interactive.js"
pause
