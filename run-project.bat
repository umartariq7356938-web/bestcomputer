@echo off
echo ====================================================
echo Starting Best Computer Portal...
echo ====================================================

:: Set explicit path for Node just in case the system wasn't restarted
set PATH=C:\Program Files\nodejs;%PATH%

:: Start Backend Server
echo [1] Starting Backend Server...
cd server
start "Backend Server" cmd /k "npm install && node server.js"

:: Start Frontend Server
cd ..
echo [2] Starting Frontend Web App...
start "Frontend Vite App" cmd /k "npm run dev"

echo ====================================================
echo Both servers are starting in new windows!
echo Please wait a few seconds for the Vite server to say "ready".
echo Then refresh your browser at:
echo http://localhost:5173
echo ====================================================
pause
