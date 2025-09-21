#!/bin/bash

# ===============================================
# SCRIPT DE VERIFICACIÓN POST-DESPLIEGUE
# ===============================================

echo "🔍 VERIFICANDO DESPLIEGUE DEL SISTEMA JII 2025"
echo "=============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para verificar servicios
check_service() {
    local service=$1
    local name=$2
    
    if systemctl is-active --quiet $service; then
        echo -e "${GREEN}✅ $name está ejecutándose${NC}"
        return 0
    else
        echo -e "${RED}❌ $name NO está ejecutándose${NC}"
        return 1
    fi
}

# Función para verificar URLs
check_url() {
    local url=$1
    local name=$2
    local expected_code=${3:-200}
    
    echo -n "Verificando $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10)
    
    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✅ OK ($response)${NC}"
        return 0
    else
        echo -e "${RED}❌ FALLO ($response)${NC}"
        return 1
    fi
}

echo -e "${BLUE}1. VERIFICANDO SERVICIOS DEL SISTEMA${NC}"
echo "======================================"

# Verificar servicios
check_service "nginx" "Nginx"
check_service "mysql" "MySQL"

# Verificar PM2
echo -n "Verificando PM2 jii2025-api... "
if pm2 list | grep -q "jii2025-api.*online"; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FALLO${NC}"
fi

echo ""
echo -e "${BLUE}2. VERIFICANDO CONECTIVIDAD${NC}"
echo "============================"

# Verificar URLs
check_url "http://localhost:3001/health" "Backend Health Check"
check_url "https://jii2025.ucaribe.edu.mx" "Frontend Principal"
check_url "https://jii2025.ucaribe.edu.mx/api/health" "API Health Check"

echo ""
echo -e "${BLUE}3. VERIFICANDO BASE DE DATOS${NC}"
echo "============================="

# Verificar conexión a BD
echo -n "Verificando conexión MySQL... "
if mysql -u industrial -pp@ss4DB -h 192.168.200.212 -e "USE sistema_jornada; SELECT COUNT(*) FROM actividades;" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
    
    # Contar registros
    actividades=$(mysql -u industrial -pp@ss4DB -h 192.168.200.212 -e "USE sistema_jornada; SELECT COUNT(*) FROM actividades;" -N 2>/dev/null)
    ponentes=$(mysql -u industrial -pp@ss4DB -h 192.168.200.212 -e "USE sistema_jornada; SELECT COUNT(*) FROM ponentes;" -N 2>/dev/null)
    workshops=$(mysql -u industrial -pp@ss4DB -h 192.168.200.212 -e "USE sistema_jornada; SELECT COUNT(*) FROM workshops;" -N 2>/dev/null)
    
    echo "  - Actividades: $actividades"
    echo "  - Ponentes: $ponentes" 
    echo "  - Workshops: $workshops"
else
    echo -e "${RED}❌ FALLO${NC}"
fi

echo ""
echo -e "${BLUE}4. VERIFICANDO FUNCIONALIDADES ESPECÍFICAS${NC}"
echo "=========================================="

# Verificar bloqueo de registro
echo -n "Verificando bloqueo de registro... "
registro_response=$(curl -s "https://jii2025.ucaribe.edu.mx/api/participantes/registro/estado")
if echo "$registro_response" | grep -q "bloqueado\|blocked"; then
    echo -e "${GREEN}✅ Registro bloqueado correctamente${NC}"
else
    echo -e "${YELLOW}⚠️ Verificar estado del registro${NC}"
fi

# Verificar CORS
echo -n "Verificando configuración CORS... "
cors_response=$(curl -s -H "Origin: https://jii2025.ucaribe.edu.mx" -I "https://jii2025.ucaribe.edu.mx/api/health" | grep -i "access-control")
if [ ! -z "$cors_response" ]; then
    echo -e "${GREEN}✅ CORS configurado${NC}"
else
    echo -e "${YELLOW}⚠️ Verificar CORS${NC}"
fi

echo ""
echo -e "${BLUE}5. VERIFICANDO PERFORMANCE${NC}"
echo "=========================="

# Test de velocidad
echo -n "Midiendo tiempo de respuesta del frontend... "
frontend_time=$(curl -o /dev/null -s -w '%{time_total}' "https://jii2025.ucaribe.edu.mx")
if (( $(echo "$frontend_time < 3.0" | bc -l) )); then
    echo -e "${GREEN}✅ ${frontend_time}s (< 3s)${NC}"
else
    echo -e "${YELLOW}⚠️ ${frontend_time}s (> 3s)${NC}"
fi

echo -n "Midiendo tiempo de respuesta del API... "
api_time=$(curl -o /dev/null -s -w '%{time_total}' "https://jii2025.ucaribe.edu.mx/api/health")
if (( $(echo "$api_time < 0.5" | bc -l) )); then
    echo -e "${GREEN}✅ ${api_time}s (< 0.5s)${NC}"
else
    echo -e "${YELLOW}⚠️ ${api_time}s (> 0.5s)${NC}"
fi

echo ""
echo -e "${BLUE}6. INFORMACIÓN DEL SISTEMA${NC}"
echo "=========================="

echo "Fecha actual: $(date)"
echo "Uptime del servidor: $(uptime -p)"
echo "Uso de memoria:"
free -h | grep Mem
echo "Uso de disco:"
df -h /var/www/jii2025

echo ""
echo -e "${BLUE}7. LOGS RECIENTES${NC}"
echo "================="

echo "Últimos logs de PM2:"
pm2 logs jii2025-api --lines 5 --nostream

echo ""
echo "Últimos logs de Nginx:"
tail -5 /var/log/nginx/access.log

echo ""
echo -e "${GREEN}🎉 VERIFICACIÓN COMPLETADA${NC}"
echo "=========================="
echo "Si todos los checks están en verde, el sistema está funcionando correctamente."
echo "Para monitoring continuo, considera configurar herramientas como Grafana o New Relic."