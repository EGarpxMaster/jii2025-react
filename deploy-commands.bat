@echo off
REM ===============================================
REM COMANDOS DE DESPLIEGUE - SISTEMA JII 2025
REM ===============================================

echo.
echo 🚀 SISTEMA JII 2025 - COMANDOS DE DESPLIEGUE
echo ============================================
echo.

echo 📋 ARCHIVOS LISTOS PARA SUBIR:
echo ✅ Frontend: dist\ (build optimizado)
echo ✅ Backend: server\dist\ (compilado TypeScript)
echo ✅ Base de datos: server\migration-complete.sql
echo ✅ Configuracion: server\.env.production
echo.

echo 🔧 COMANDOS PARA EJECUTAR EN EL SERVIDOR:
echo.
echo === 1. CREAR ESTRUCTURA DE DIRECTORIOS ===
echo sudo mkdir -p /var/www/jii2025/{frontend,backend}
echo sudo chown -R www-data:www-data /var/www/jii2025
echo.

echo === 2. SUBIR ARCHIVOS (desde tu PC) ===
echo scp -r dist/* usuario@192.168.200.212:/var/www/jii2025/frontend/
echo scp -r server/dist/* usuario@192.168.200.212:/var/www/jii2025/backend/
echo scp server/.env.production usuario@192.168.200.212:/var/www/jii2025/backend/.env
echo scp server/package.json usuario@192.168.200.212:/var/www/jii2025/backend/
echo scp server/migration-complete.sql usuario@192.168.200.212:/tmp/
echo.

echo === 3. MIGRAR BASE DE DATOS ===
echo mysql -u industrial -p sistema_jornada ^< /tmp/migration-complete.sql
echo.

echo === 4. INSTALAR Y EJECUTAR BACKEND ===
echo cd /var/www/jii2025/backend
echo npm install --production
echo pm2 start server.js --name jii2025-api
echo pm2 startup
echo pm2 save
echo.

echo === 5. CONFIGURAR NGINX ===
echo sudo nano /etc/nginx/sites-available/jii2025
echo sudo ln -s /etc/nginx/sites-available/jii2025 /etc/nginx/sites-enabled/
echo sudo nginx -t
echo sudo systemctl reload nginx
echo.

echo === 6. VERIFICAR DESPLIEGUE ===
echo curl http://localhost:3001/health
echo curl https://jii2025.ucaribe.edu.mx
echo.

echo 🎉 LISTO PARA DESPLEGAR!
echo.
pause