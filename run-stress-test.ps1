# Script de PowerShell para ejecutar prueba de estrés con Artillery
Write-Host "🚀 Iniciando prueba de estrés de 5 minutos para JII2025..." -ForegroundColor Green

# Verificar que Artillery esté instalado
try {
    artillery --version | Out-Null
    Write-Host "✅ Artillery está instalado" -ForegroundColor Green
} catch {
    Write-Host "❌ Artillery no está instalado. Instalando..." -ForegroundColor Red
    npm install -g artillery
}

# Verificar que el servidor esté corriendo
Write-Host "🔍 Verificando que el servidor esté disponible..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/participantes/stats" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Servidor disponible" -ForegroundColor Green
} catch {
    Write-Host "❌ El servidor no está disponible en http://localhost:3001" -ForegroundColor Red
    Write-Host "   Asegúrate de que el backend esté corriendo con:" -ForegroundColor Yellow
    Write-Host "   cd server && npm run dev" -ForegroundColor Yellow
    exit 1
}

# Crear directorio para resultados si no existe
if (-not (Test-Path "artillery-results")) {
    New-Item -ItemType Directory -Path "artillery-results" | Out-Null
}

# Obtener timestamp para el archivo de resultados
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$resultFile = "artillery-results/stress-test-$timestamp.json"

Write-Host ""
Write-Host "📊 Ejecutando prueba de estrés..." -ForegroundColor Cyan
Write-Host "   Duración: 5 minutos" -ForegroundColor White
Write-Host "   Fases: Calentamiento → Carga normal → Pico → Estrés máximo" -ForegroundColor White
Write-Host "   Resultados se guardarán en: $resultFile" -ForegroundColor White
Write-Host ""

# Ejecutar Artillery
artillery run load-test-artillery.yml --output $resultFile

# Generar reporte HTML
Write-Host ""
Write-Host "📈 Generando reporte HTML..." -ForegroundColor Cyan
$htmlReport = "artillery-results/report-$timestamp.html"
artillery report $resultFile --output $htmlReport

Write-Host ""
Write-Host "✅ Prueba de estrés completada!" -ForegroundColor Green
Write-Host "📊 Resultados JSON: $resultFile" -ForegroundColor White
Write-Host "📈 Reporte HTML: $htmlReport" -ForegroundColor White
Write-Host ""
Write-Host "Para ver el reporte:" -ForegroundColor Yellow
Write-Host "   - Abrir $htmlReport en el navegador" -ForegroundColor White
Write-Host "   - O usar: artillery report $resultFile" -ForegroundColor White

# Abrir automáticamente el reporte HTML
if (Test-Path $htmlReport) {
    Write-Host ""
    Write-Host "🌐 Abriendo reporte en el navegador..." -ForegroundColor Cyan
    Start-Process $htmlReport
}