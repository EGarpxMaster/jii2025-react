# 🔄 Routing actualizado para GitHub Pages

## ✅ Cambios realizados:

### **1. Configuración de Routing de React Router**
- ✅ **Basename configurado** para GitHub Pages (`/jii2025-react`)
- ✅ **Detección automática** de entorno (desarrollo vs producción)
- ✅ **BrowserRouter optimizado** para sub-directorios

### **2. Sistema de Rutas de Assets**
- ✅ **Helper `utils/paths.ts`** creado para gestionar rutas
- ✅ **Funciones específicas** para cada tipo de asset:
  - `getImagePath()` - Imágenes generales
  - `getLogoPath()` - Logos institucionales  
  - `getStaffImagePath()` - Fotos de staff
  - `getAliadosImagePath()` - Logos de aliados
  - `getCarouselImagePath()` - Imágenes del carousel
  - `getConcursoImagePath()` - Imágenes del concurso
  - `getActividadesImagePath()` - Imágenes de actividades

### **3. Componentes Actualizados**
- ✅ **Navbar**: Logo con ruta correcta
- ✅ **Aliados**: Todos los logos actualizados
- ✅ **App.tsx**: Routing configurado para GitHub Pages

### **4. Configuración SPA para GitHub Pages**
- ✅ **404.html**: Maneja rutas no encontradas
- ✅ **index.html**: Script de redirección para SPA
- ✅ **.nojekyll**: Evita procesamiento de Jekyll
- ✅ **Vite config**: Base path configurado

## 🚀 Cómo usar:

### **Desarrollo local:**
```bash
npm run dev:frontend
# Rutas: http://localhost:5173/ruta
```

### **Producción (GitHub Pages):**
```bash
npm run deploy:gh-pages
# Rutas: https://egarpxmaster.github.io/jii2025-react/ruta
```

## 📁 Estructura de rutas resultante:

```
GitHub Pages URL: https://egarpxmaster.github.io/jii2025-react/

Rutas de la app:
├── / (Home)
├── /historia
├── /galeria  
├── /actividades
├── /concurso
├── /staff
├── /aliados
└── /registro

Assets:
├── /jii2025-react/assets/images/logos/
├── /jii2025-react/assets/images/staff/
├── /jii2025-react/assets/images/aliados/
├── /jii2025-react/assets/images/carousel/
├── /jii2025-react/assets/images/concurso/
└── /jii2025-react/assets/images/actividades/
```

## 🛠 Componentes que necesitan actualización:

Para actualizar más componentes que usen imágenes, sigue este patrón:

```tsx
// ❌ Antes
<img src="/assets/images/staff/persona.jpg" />

// ✅ Después  
import { getStaffImagePath } from '../utils/paths';
<img src={getStaffImagePath("persona.jpg")} />
```

## 🔗 Links internos:

Para navegación interna, React Router maneja automáticamente el basename:

```tsx
// ✅ Correcto (no cambiar)
<Link to="/historia">Historia</Link>
<Navigate to="/registro" />
```

## ⚠️ Notas importantes:

1. **Assets automáticos**: Las rutas se ajustan automáticamente según el entorno
2. **Hot reload**: En desarrollo funciona normalmente  
3. **Build optimizado**: En producción incluye el prefijo correcto
4. **SEO friendly**: URLs limpias y navegables
5. **Fallback 404**: Redirecciona correctamente las rutas SPA

¡El routing está completamente configurado para GitHub Pages! 🎉