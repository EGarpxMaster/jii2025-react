#!/bin/bash

# Script para ejecutar prueba de estrés con Artillery
echo "🚀 Iniciando prueba de estrés de 5 minutos para JII2025..."

# Verificar que Artillery esté instalado
if ! command -v artillery &> /dev/null; then
    echo "❌ Artillery no está instalado. Instalando..."
    npm install -g artillery
fi

# Verificar que el servidor esté corriendo
echo "🔍 Verificando que el servidor esté disponible..."
curl -s http://localhost:3001/api/participantes/stats > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ El servidor no está disponible en http://localhost:3001"
    echo "   Asegúrate de que el backend esté corriendo con:"
    echo "   cd server && npm run dev"
    exit 1
fi

echo "✅ Servidor disponible"

# Crear directorio para resultados si no existe
mkdir -p artillery-results

# Obtener timestamp para el archivo de resultados
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RESULT_FILE="artillery-results/stress-test-$TIMESTAMP.json"

echo "📊 Ejecutando prueba de estrés..."
echo "   Duración: 5 minutos"
echo "   Fases: Calentamiento → Carga normal → Pico → Estrés máximo"
echo "   Resultados se guardarán en: $RESULT_FILE"
echo ""

# Ejecutar Artillery
artillery run load-test-artillery.yml --output $RESULT_FILE

# Generar reporte HTML
echo ""
echo "📈 Generando reporte HTML..."
HTML_REPORT="artillery-results/report-$TIMESTAMP.html"
artillery report $RESULT_FILE --output $HTML_REPORT

echo ""
echo "✅ Prueba de estrés completada!"
echo "📊 Resultados JSON: $RESULT_FILE"
echo "📈 Reporte HTML: $HTML_REPORT"
echo ""
echo "Para ver el reporte:"
echo "   - Abrir $HTML_REPORT en el navegador"
echo "   - O usar: artillery report $RESULT_FILE"