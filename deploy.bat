@echo off
REM Script de despliegue para Windows
REM Uso: deploy.bat [environment]
REM Ejemplo: deploy.bat production

setlocal enabledelayedexpansion

set "ENVIRONMENT=%~1"
if "%ENVIRONMENT%"=="" set "ENVIRONMENT=production"

set "PROJECT_NAME=jii2025"

echo 🚀 Iniciando despliegue para ambiente: %ENVIRONMENT%

REM Verificar que Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker no está instalado. Por favor instala Docker primero.
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose no está instalado. Por favor instala Docker Compose primero.
    exit /b 1
)

REM Verificar archivos de configuración
if not exist ".env.docker" (
    echo ❌ Archivo .env.docker no encontrado. Copia .env.docker.example y configura las variables.
    exit /b 1
)

REM Crear directorio para logs si no existe
if not exist "logs" mkdir logs

REM Construir imágenes
echo 🔨 Construyendo imágenes Docker...
docker-compose --env-file .env.docker build --no-cache

REM Detener servicios existentes
echo 🛑 Deteniendo servicios existentes...
docker-compose --env-file .env.docker down

REM Iniciar servicios
echo ▶️  Iniciando servicios...
docker-compose --env-file .env.docker up -d

REM Esperar a que los servicios estén listos
echo ⏳ Esperando a que los servicios estén listos...
timeout /t 10 /nobreak >nul

REM Verificar estado de los servicios
echo 🔍 Verificando estado de los servicios...
docker-compose --env-file .env.docker ps

REM Health checks
echo 🏥 Realizando health checks...

REM Verificar backend
curl -f http://localhost:3001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend está funcionando correctamente
) else (
    echo ❌ Backend no responde. Verificando logs...
    docker-compose --env-file .env.docker logs backend
    exit /b 1
)

REM Verificar frontend
curl -f http://localhost:80 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend está funcionando correctamente
) else (
    echo ❌ Frontend no responde. Verificando logs...
    docker-compose --env-file .env.docker logs frontend
    exit /b 1
)

echo 🎉 Despliegue completado exitosamente!
echo 🌐 Frontend disponible en: http://localhost
echo 🔗 API disponible en: http://localhost:3001
echo 📊 Para ver logs: docker-compose --env-file .env.docker logs -f [service_name]

endlocal