@echo off
title CodeStudio - Online IDE
echo ========================================
echo        CodeStudio - Online IDE v1.0
echo ========================================
echo.
echo Installing dependencies...
call npm install --silent
echo.
echo Starting server...
echo Opening browser...
start http://localhost:5173
echo.
echo ========================================
echo  Server: http://localhost:5173
echo  Press Ctrl+C to stop
echo ========================================
echo.
npm run dev
