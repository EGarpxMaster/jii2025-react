# 🚀 Guía de Despliegue - JII 2025

Esta guía te ayudará a desplegar la aplicación JII 2025 en un servidor dedicado de manera optimizada para producción.

## 📋 Prerrequisitos

### Software Requerido
- **Docker** (versión 20.10 o superior)
- **Docker Compose** (versión 2.0 o superior)
- **Git** para clonar el repositorio
- **Curl** para health checks

### Recursos del Servidor
- **RAM**: Mínimo 2GB, recomendado 4GB
- **Almacenamiento**: Mínimo 10GB libres
- **CPU**: 2 cores mínimo
- **Puertos**: 80, 443, 3001, 3306 disponibles

## 🔧 Configuración Inicial

### 1. Clonar el Repositorio
```bash
git clone https://github.com/EGarpxMaster/jii2025-react.git
cd jii2025-react
```

### 2. Configurar Variables de Entorno
```bash
# Copiar y editar archivo de variables de entorno
cp .env.docker .env

# Editar las variables según tu configuración
nano .env
```

**Variables importantes a configurar:**
```env
# Base de datos
DB_ROOT_PASSWORD=tu_password_root_muy_seguro
DB_PASSWORD=tu_password_db_seguro
DB_USER=jii2025_user
DB_DATABASE=jii2025_db

# Seguridad
JWT_SECRET=tu_jwt_secret_muy_largo_y_seguro_minimo_32_caracteres

# Dominios
ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com
VITE_API_URL=https://api.tu-dominio.com

# ReCAPTCHA
VITE_RECAPTCHA_SITE_KEY=tu_site_key_de_recaptcha
```

### 3. Configurar SSL (Opcional pero Recomendado)

#### Usando Let's Encrypt
```bash
# Instalar Certbot
sudo apt-get update
sudo apt-get install certbot

# Obtener certificados
sudo certbot certonly --standalone -d tu-dominio.com -d www.tu-dominio.com

# Copiar certificados a la carpeta del proyecto
sudo mkdir -p ssl
sudo cp /etc/letsencrypt/live/tu-dominio.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/tu-dominio.com/privkey.pem ssl/
sudo chown -R $USER:$USER ssl/
```

## 🚀 Despliegue

### Opción 1: Script Automático (Recomendado)

#### Linux/macOS:
```bash
chmod +x deploy.sh
./deploy.sh production
```

#### Windows:
```cmd
deploy.bat production
```

### Opción 2: Comandos Manuales

```bash
# Construir imágenes
docker-compose --env-file .env build --no-cache

# Iniciar servicios
docker-compose --env-file .env up -d

# Verificar estado
docker-compose --env-file .env ps
```

## 🔍 Verificación del Despliegue

### Health Checks
```bash
# Verificar backend
curl http://localhost:3001/health

# Verificar frontend
curl http://localhost:80

# Verificar base de datos
docker-compose --env-file .env exec database mysql -u root -p -e "SHOW DATABASES;"
```

### Ver Logs
```bash
# Logs de todos los servicios
docker-compose --env-file .env logs -f

# Logs específicos
docker-compose --env-file .env logs -f backend
docker-compose --env-file .env logs -f frontend
docker-compose --env-file .env logs -f database
```

## 🔧 Configuración de Nginx Reverse Proxy (Opcional)

Si quieres usar un proxy externo:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🛠 Mantenimiento

### Backup de Base de Datos
```bash
# Crear backup
docker-compose --env-file .env exec database mysqldump -u root -p jii2025_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker-compose --env-file .env exec -i database mysql -u root -p jii2025_db < backup.sql
```

### Actualizar la Aplicación
```bash
# Descargar cambios
git pull origin main

# Reconstruir y reiniciar
docker-compose --env-file .env down
docker-compose --env-file .env build --no-cache
docker-compose --env-file .env up -d
```

### Monitoreo
```bash
# Ver uso de recursos
docker stats

# Ver espacio en disco
df -h

# Ver logs en tiempo real
docker-compose --env-file .env logs -f --tail=100
```

## 🔒 Seguridad

### Configuraciones Recomendadas

1. **Firewall**: Abre solo los puertos necesarios
   ```bash
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

2. **Fail2Ban**: Protección contra ataques de fuerza bruta
   ```bash
   sudo apt-get install fail2ban
   ```

3. **Actualizaciones**: Mantén el sistema actualizado
   ```bash
   sudo apt-get update && sudo apt-get upgrade
   ```

## 📊 Monitoreo y Logs

### Ubicación de Logs
- **Nginx**: `/var/log/nginx/`
- **Aplicación**: `docker-compose logs`
- **Base de datos**: `docker-compose logs database`

### Métricas Importantes
- Uso de CPU y memoria
- Espacio en disco
- Tiempo de respuesta de la API
- Errores en logs

## 🆘 Solución de Problemas

### Problemas Comunes

#### Error: "Port already in use"
```bash
# Verificar qué proceso usa el puerto
sudo netstat -tulpn | grep :80

# Detener el proceso o cambiar puerto
sudo systemctl stop apache2  # si es Apache
```

#### Error: "Database connection failed"
```bash
# Verificar estado de la base de datos
docker-compose --env-file .env logs database

# Reiniciar solo la base de datos
docker-compose --env-file .env restart database
```

#### Error: "Permission denied"
```bash
# Ajustar permisos
sudo chown -R $USER:$USER .
chmod +x deploy.sh
```

## 📞 Soporte

Para soporte adicional:
1. Revisar logs detallados
2. Verificar configuración de variables de entorno
3. Consultar documentación de Docker
4. Contactar al equipo de desarrollo

---

## 🎉 ¡Despliegue Exitoso!

Una vez completado el despliegue:
- ✅ Frontend disponible en: `http://tu-dominio.com`
- ✅ API disponible en: `http://tu-dominio.com/api`
- ✅ Base de datos funcionando
- ✅ SSL configurado (si aplica)
- ✅ Backups configurados