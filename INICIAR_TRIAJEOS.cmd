@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js/npm. Instala Node.js y vuelve a intentarlo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Instalando dependencias por primera vez...
  call npm install
  if errorlevel 1 (
    echo La instalacion ha fallado.
    pause
    exit /b 1
  )
)

echo.
echo TriajeOS se abrira en http://localhost:3000
echo Para detenerlo, vuelve a esta ventana y pulsa Ctrl+C.
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"
call npm run dev -- --hostname 127.0.0.1 --port 3000

endlocal
