# Script de lanzamiento automático para la App de Triaje de Ropa (Servidor Backend + Frontend)
Write-Host "Iniciando servidor automático de TriajeRápido..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot'; node server.mjs"

Start-Sleep -Seconds 2

Start-Process "http://localhost:4000"

Write-Host "¡Servidor e Interfaz de Triaje iniciados en http://localhost:4000!" -ForegroundColor Green
