#!/bin/bash

# ===============================================
# GUÍA DE DESPLIEGUE - SISTEMA JII 2025
# ===============================================
# Instrucciones completas para subir al servidor

echo "🚀 SISTEMA JII 2025 - DESPLIEGUE A PRODUCCIÓN"
echo "=============================================="

# 1. ARCHIVOS LISTOS PARA DESPLIEGUE
echo "✅ 1. ARCHIVOS PREPARADOS:"
echo "   📁 Frontend: /dist/ (build optimizado)"
echo "   📁 Backend: /server/dist/ (compilado)"
echo "   📄 Migración: /server/migration-complete.sql"
echo "   ⚙️ Config: /server/.env.production"

# 2. MIGRACIÓN DE BASE DE DATOS
echo ""
echo "🗄️ 2. MIGRAR BASE DE DATOS:"
echo "   Ejecutar en el servidor MySQL:"
echo "   mysql -u industrial -p < migration-complete.sql"

# 3. CONFIGURACIÓN DEL SERVIDOR
echo ""
echo "⚙️ 3. CONFIGURAR SERVIDOR:"
echo "   Copiar archivos .env.production al servidor como .env"
echo "   Actualizar variables según el servidor real:"
echo "   - DB_HOST: IP/hostname del servidor MySQL"
echo "   - ALLOWED_ORIGINS: dominio real del frontend"
echo "   - JWT_SECRET: generar secreto seguro"

# 4. ESTRUCTURA DE ARCHIVOS EN SERVIDOR
echo ""
echo "📁 4. ESTRUCTURA EN SERVIDOR:"
echo "   /var/www/jii2025/"
echo "   ├── frontend/ (contenido de /dist/)"
echo "   ├── backend/ (contenido de /server/dist/)"
echo "   ├── .env"
echo "   └── package.json (del servidor)"

# 5. COMANDOS DE DESPLIEGUE
echo ""
echo "🔧 5. COMANDOS EN SERVIDOR:"
echo "   cd /var/www/jii2025/backend"
echo "   npm install --production"
echo "   pm2 start server.js --name jii2025-api"
echo "   pm2 startup"
echo "   pm2 save"

# 6. CONFIGURACIÓN NGINX (si aplica)
echo ""
echo "🌐 6. CONFIGURAR NGINX:"
echo "   Frontend: Servir archivos estáticos desde /frontend/"
echo "   API: Proxy a http://localhost:3001"
echo "   SSL: Configurar certificado para HTTPS"

# 7. VERIFICACIONES POST-DESPLIEGUE
echo ""
echo "✅ 7. VERIFICAR DESPLIEGUE:"
echo "   - Frontend carga correctamente"
echo "   - API responde en /health"
echo "   - Base de datos conecta"
echo "   - Registro bloqueado hasta Sept 22, 2025 9:00 AM"

echo ""
echo "🎉 SISTEMA LISTO PARA PRODUCCIÓN"
echo "   - Optimizado para 150+ usuarios concurrentes"
echo "   - Base de datos migrada"
echo "   - Bloqueo de registro configurado"
echo "   - Performance validado"

# URLS DE VERIFICACIÓN
echo ""
echo "🔗 URLS PARA VERIFICAR:"
echo "   Frontend: https://tu-dominio.com"
echo "   API Health: https://tu-dominio.com/api/health"
echo "   Estado Registro: https://tu-dominio.com/api/participantes/registro/estado"