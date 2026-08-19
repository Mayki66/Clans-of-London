@echo off
title Clans of London - Companion App
echo ====================================================
echo   Lancement de Vampire: The Masquerade - Clans of London
echo ====================================================
echo.
cd /d "%~dp0"
echo Verification des dependances...
if not exist "node_modules\" (
    echo Installation initiale des paquets...
    call npm install
)
echo Lancement du serveur local...
start http://localhost:5173
call npm run dev
pause
