@echo off
REM Add MinGW to PATH and use -mconsole so the linker uses console subsystem.
set "PATH=C:\msys64\mingw64\bin;%PATH%"
cd /d "%~dp0"

REM Compile: -mconsole selects console subsystem (main) instead of GUI (WinMain).
g++ -mconsole first.cpp -o first.exe
if errorlevel 1 (
  echo Build failed.
  exit /b 1
)

echo Build succeeded. Running first.exe ...
echo.
first.exe
echo.
echo Exit code: %ERRORLEVEL%
pause
