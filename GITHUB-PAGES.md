# 🚀 Deploy en GitHub Pages - JII 2025

Guía completa para desplegar la aplicación JII 2025 en GitHub Pages.

## ⚠️ **Limitaciones de GitHub Pages**

GitHub Pages **solo sirve contenido estático**, esto significa:
- ✅ **Frontend React**: Funciona perfectamente
- ❌ **Backend Node.js**: No puede ejecutarse
- ❌ **Base de datos**: No disponible

## 🎯 **Opciones de Deploy**

### **Opción 1: Frontend + API Externa (Recomendado)**
Desplegar el frontend en GitHub Pages y hospedar la API en un servicio externo.

**Servicios recomendados para la API:**
- [Railway](https://railway.app) - Gratis con límites
- [Render](https://render.com) - Gratis con límites  
- [Heroku](https://heroku.com) - Planes pagos
- [Vercel](https://vercel.com) - Gratis para APIs simples
- [Netlify Functions](https://netlify.com) - Serverless

### **Opción 2: Modo Demo (Sin Backend)**
Funcionalidad limitada usando datos simulados (mock).

## 🔧 **Configuración para GitHub Pages**

### **1. Configurar Repository Settings**

1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. Source: **GitHub Actions**
4. Guarda la configuración

### **2. Configurar Variables de Entorno (Secrets)**

En GitHub → Settings → Secrets and variables → Actions:

```
VITE_API_URL = https://tu-api-externa.com
VITE_RECAPTCHA_SITE_KEY = tu_recaptcha_site_key
```

### **3. Deploy Automático**

El workflow ya está configurado en `.github/workflows/deploy.yml`:

```bash
# Se ejecuta automáticamente en cada push a main
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### **4. Deploy Manual**

```bash
# Instalar dependencias
npm install

# Build para GitHub Pages
npm run build:gh-pages

# Deploy manual (opcional)
npm run deploy:gh-pages
```

## 🌐 **URLs después del Deploy**

- **Frontend**: `https://egarpxmaster.github.io/jii2025-react/`
- **Repository**: `https://github.com/EGarpxMaster/jii2025-react`

## 🎭 **Modo Demo (Sin API)**

Si no tienes API externa, puedes usar el modo demo:

### **Configurar Modo Demo:**

1. **Editar `.env.github-pages`:**
   ```env
   VITE_API_URL=mock
   VITE_DEMO_MODE=true
   VITE_APP_TITLE=JII 2025 - Demo
   ```

2. **En GitHub Secrets:**
   ```
   VITE_API_URL = mock
   ```

### **Funcionalidades en Modo Demo:**
- ✅ **Navegación completa**
- ✅ **Formularios (simulados)**
- ✅ **Datos de ejemplo**
- ✅ **UI/UX completa**
- ⚠️ **Sin persistencia de datos**

## 🔗 **Opciones para la API Externa**

### **Railway (Recomendado - Gratis)**

1. **Crear cuenta en [Railway](https://railway.app)**
2. **Conectar tu repositorio**
3. **Configurar variables de entorno:**
   ```env
   NODE_ENV=production
   DB_HOST=tu_db_host
   DB_USER=tu_db_user
   DB_PASSWORD=tu_db_password
   PORT=3001
   ```
4. **Deploy automático desde GitHub**

### **Render (Alternativa gratuita)**

1. **Crear cuenta en [Render](https://render.com)**
2. **Crear Web Service desde GitHub**
3. **Configurar:**
   - Build Command: `npm --prefix server run build`
   - Start Command: `npm --prefix server start`
   - Environment: `Node`

### **Vercel (Para APIs simples)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy desde la carpeta server/
cd server
vercel --prod
```

## 📦 **Estructura de Deploy**

```
GitHub Pages (Frontend)
├── https://egarpxmaster.github.io/jii2025-react/
├── Archivos estáticos (HTML, CSS, JS)
├── Assets optimizados
└── Configuración para SPA routing

API Externa (Backend)
├── https://tu-api.railway.app
├── Endpoints REST
├── Base de datos
└── Autenticación
```

## ⚙️ **Configuración Avanzada**

### **Custom Domain (Opcional)**

1. **Agregar archivo `CNAME` en `/public/`:**
   ```
   tu-dominio.com
   ```

2. **Configurar DNS:**
   ```
   CNAME @ egarpxmaster.github.io
   ```

### **HTTPS y Seguridad**

GitHub Pages incluye HTTPS automáticamente:
- ✅ **Certificado SSL gratuito**
- ✅ **Forced HTTPS**
- ✅ **CDN global**

## 🔍 **Troubleshooting**

### **Error: "Failed to load resource"**
- Verificar `VITE_API_URL` en GitHub Secrets
- Confirmar que la API externa esté funcionando
- Revisar CORS en el backend

### **Error: "404 on page refresh"**
- GitHub Pages configurado correctamente
- Archivo `_redirects` o `.nojekyll` si es necesario

### **Modo Demo no funciona**
- Verificar `VITE_API_URL=mock` en Secrets
- Revisar consola del navegador para errores

## 📊 **Comparación de Opciones**

| Característica | GitHub Pages + API Externa | Solo GitHub Pages (Demo) |
|---------------|----------------------------|--------------------------|
| **Costo** | Gratis + API (~$5-10/mes) | Completamente gratis |
| **Funcionalidad** | 100% completa | Limitada (sin BD) |
| **Mantenimiento** | Medio | Bajo |
| **Escalabilidad** | Alta | Baja |
| **Datos reales** | ✅ | ❌ |
| **Formularios** | ✅ Funcionales | ✅ Simulados |

## 🚀 **Pasos Siguientes**

### **Para producción real:**
1. Configurar API en Railway/Render
2. Configurar base de datos
3. Actualizar `VITE_API_URL` en GitHub Secrets
4. Deploy automático

### **Para demo/portafolio:**
1. Usar modo demo
2. Deploy directo en GitHub Pages
3. Mostrar funcionalidad UI/UX

---

## 🎉 **¡Listo para Deploy!**

Tu aplicación está configurada para desplegarse en GitHub Pages con:
- ✅ **Workflow automático**
- ✅ **Modo demo incluido**
- ✅ **Optimizaciones de performance**
- ✅ **Documentación completa**

**Deploy ahora:**
```bash
git add .
git commit -m "Ready for GitHub Pages"
git push origin main
```

¡En unos minutos estará disponible en tu URL de GitHub Pages! 🚀