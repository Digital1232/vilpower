@echo off
title Push VilPower to GitHub
echo ==============================================
echo Pushing VilPower commits to GitHub (origin/main)...
echo ==============================================

set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%LOCALAPPDATA%\Programs\Git\ucrt64\bin;%PATH%"

cd /d "%~dp0"
git push origin main

echo.
echo ==============================================
if %ERRORLEVEL% EQU 0 (
    echo Successfully pushed to live!
) else (
    echo Push failed. Please check credentials above.
)
echo ==============================================
pause
