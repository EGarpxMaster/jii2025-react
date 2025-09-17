#!/bin/bash

# Script de despliegue para servidor dedicado
# Uso: ./deploy.sh [environment]
# Ejemplo: ./deploy.sh production

set -e

ENVIRONMENT=${1:-production}
PROJECT_NAME="jii2025"

echo "🚀 Iniciando despliegue para ambiente: $ENVIRONMENT"

# Verificar que Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Verificar archivos de configuración
if [ ! -f ".env.docker" ]; then
    echo "❌ Archivo .env.docker no encontrado. Copia .env.docker.example y configura las variables."
    exit 1
fi

# Crear directorio para logs si no existe
mkdir -p logs

# Construir imágenes
echo "🔨 Construyendo imágenes Docker..."
docker-compose --env-file .env.docker build --no-cache

# Detener servicios existentes
echo "🛑 Deteniendo servicios existentes..."
docker-compose --env-file .env.docker down

# Iniciar servicios
echo "▶️  Iniciando servicios..."
docker-compose --env-file .env.docker up -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado de los servicios
echo "🔍 Verificando estado de los servicios..."
docker-compose --env-file .env.docker ps

# Health checks
echo "🏥 Realizando health checks..."

# Verificar backend
if curl -f http://localhost:3001/health &> /dev/null; then
    echo "✅ Backend está funcionando correctamente"
else
    echo "❌ Backend no responde. Verificando logs..."
    docker-compose --env-file .env.docker logs backend
    exit 1
fi

# Verificar frontend
if curl -f http://localhost:80 &> /dev/null; then
    echo "✅ Frontend está funcionando correctamente"
else
    echo "❌ Frontend no responde. Verificando logs..."
    docker-compose --env-file .env.docker logs frontend
    exit 1
fi

echo "🎉 Despliegue completado exitosamente!"
echo "🌐 Frontend disponible en: http://localhost"
echo "🔗 API disponible en: http://localhost:3001"
echo "📊 Para ver logs: docker-compose --env-file .env.docker logs -f [service_name]"