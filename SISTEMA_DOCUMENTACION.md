# 📋 SISTEMA DE GESTIÓN - JORNADA DE INGENIERÍA INDUSTRIAL 2025

## 🎯 **DESCRIPCIÓN GENERAL**
Sistema web completo para la gestión de la Jornada de Ingeniería Industrial 2025, que permite registro de participantes, inscripción a workshops, marcaje de asistencias, y registro al concurso estudiantil.

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **Frontend**
- **Tecnología**: React + TypeScript + Vite
- **Estilos**: CSS personalizado + Tailwind CSS
- **Componentes**: Modulares y reutilizables
- **Estado**: React Hooks + Context API

### **Backend**
- **Tecnología**: Node.js + Express + TypeScript
- **Base de Datos**: MySQL 8.4
- **ORM**: MySQL2 (conexiones directas)
- **Validación**: Zod schemas
- **Proceso**: PM2 (producción)

### **Infraestructura**
- **Servidor**: FreeBSD (192.168.200.212)
- **Web Server**: Nginx (proxy reverso)
- **Puerto Backend**: 3001
- **Puerto Frontend**: 80

---

## 📅 **VENTANAS DE TIEMPO**

### **Registro General**
- **Inicio**: 22 de Septiembre 2025 - 09:00 hrs
- **Fin**: 26 de Septiembre 2025 - 23:59 hrs

### **Inscripción Workshops**
- **Inicio**: 22 de Septiembre 2025 - 09:00 hrs  
- **Fin**: 23 de Septiembre 2025 - 23:59 hrs

### **Inscripción Concurso**
- **Inicio**: 22 de Septiembre 2025 - 09:00 hrs
- **Fin**: 23 de Septiembre 2025 - 23:59 hrs

### **Marcaje de Asistencias**
- **Ventana**: 15 minutos antes del inicio de cada actividad hasta 15 minutos después del inicio

---

## 🔧 **MÓDULOS DEL SISTEMA**

## 1️⃣ **REGISTRO GENERAL**

### **Objetivo**
Permitir el registro inicial de participantes en el sistema.

### **Campos Obligatorios**
- Apellido Paterno
- Apellido Materno  
- Primer Nombre
- Correo Electrónico (único)
- Teléfono (10 dígitos)
- Categoría
- Programa Académico (solo para estudiantes)

### **Campos Opcionales**
- Segundo Nombre

### **Categorías Disponibles**
- Estudiante
- Docente
- Staff
- Ponente
- Asistente Externo

### **Programas Académicos**
- Ingeniería Industrial
- Ingeniería Ambiental
- Ingeniería en Datos e Inteligencia Organizacional
- Ingeniería en Logística y Cadena de Suministro
- Ingeniería en Inteligencia Artificial
- Ingeniería en Industrias Alimentarias

### **Validaciones**
- Email único en el sistema
- Formato de email válido
- Teléfono exactamente 10 dígitos
- Programa obligatorio solo para categoría "Estudiante"

---

## 2️⃣ **WORKSHOPS**

### **Objetivo**
Gestionar inscripciones a talleres especializados con control de cupo y lista de espera.

### **Características**
- **Horario**: Todos los workshops de 11:00 a 14:00 hrs
- **Fecha**: 25 de Septiembre 2025
- **Restricción**: 1 workshop por participante
- **Sistema**: Lista de espera automática cuando se llena

### **Estados de Workshop**
- **Registrado**: Usuario inscrito con cupo confirmado
- **Lista de Espera**: Usuario en cola esperando cupo
- **Cancelado**: Inscripción cancelada por el usuario

### **Funcionalidades**
- Ver todos los workshops disponibles
- Inscribirse si hay cupo
- Entrar a lista de espera si está lleno
- Cancelar inscripción (libera cupo para siguiente en lista)
- Visualización en tiempo real de cupos disponibles

### **Workshops Disponibles**
1. **W1** - Introducción a la teoría de inventarios (40 cupos)
2. **W2** - Manufactura aditiva e impresión 3D (22 cupos)
3. **W3** - Ingeniería de empaque y embalaje (30 cupos)
4. **W4** - Propiedades de arenas de moldeo (24 cupos)
5. **W5** - Modelado 3D con iPhone Pro y JigSpace (25 cupos)
6. **W6** - Circuitos eléctricos en Corriente Alterna (20 cupos)

---

## 3️⃣ **ASISTENCIAS**

### **Objetivo**
Controlar y registrar la asistencia a conferencias, foros y workshops inscritos.

### **Requisitos**
- Usuario registrado en el sistema
- Número de brazalete asignado
- Estar dentro de la ventana de marcaje

### **Actividades Disponibles**
- **Conferencias**: Todas las conferencias programadas
- **Foros**: Todos los foros programados  
- **Workshops**: Solo el workshop en el que el usuario está inscrito

### **Estados de Cupo (Badges)**
- 🟢 **Verde (DISPONIBLE)**: 100% - 30% de cupos disponibles
- 🟡 **Amarillo (CASI_LLENO)**: 29% - 10% de cupos disponibles  
- 🔴 **Rojo (LLENO)**: Menos del 10% de cupos disponibles

### **Funcionalidades**
- Verificación automática de brazalete
- Registro de brazalete si no lo tiene
- Marcaje de asistencia dentro de ventana horaria
- Visualización de estado en tiempo real
- Historial de asistencias confirmadas

### **Conferencias y Foros**
- **C1-C5**: 5 Conferencias magistrales (150 cupos c/u)
- **F1-F3**: 3 Foros estudiantiles (150 cupos c/u)

---

## 4️⃣ **CONCURSO ESTUDIANTIL**

### **Objetivo**
Gestionar el registro de equipos para el concurso inter-estados.

### **Configuración**
- **Equipos**: Máximo 16 equipos
- **Integrantes**: Exactamente 6 por equipo (1 capitán + 5 miembros)
- **Representación**: 1 estado de la República Mexicana por equipo
- **Nombre**: Nombre del estado que representan

### **Validaciones**
- Nombre de equipo único (estado de la república)
- Todos los integrantes deben estar registrados
- No se puede repetir email en diferentes equipos
- Capitán es fijo (no se puede cambiar)
- Todos los campos de email obligatorios

### **Estados Disponibles**
- Gestión automática de estados disponibles
- Reserva de estado al confirmar equipo
- Liberación automática si no se completa registro

---

## 5️⃣ **CONSTANCIAS**

### **Objetivo**
Generar constancias de participación basadas en asistencias registradas.

### **Criterios**
- Usuario debe tener asistencias confirmadas
- Validación automática de elegibilidad
- Generación de PDF personalizado

---

## 🔄 **CARACTERÍSTICAS TÉCNICAS**

### **Tiempo Real**
- Actualización automática de cupos
- Badges de estado dinámicos
- Sincronización entre usuarios

### **Seguridad**
- Validación de datos en frontend y backend
- Sanitización de inputs
- Control de acceso por sesiones
- Rate limiting en APIs

### **Optimización**
- Caching de consultas frecuentes
- Índices en base de datos
- Compresión de respuestas
- Lazy loading de componentes

### **Responsividad**
- Diseño mobile-first
- Adaptación a diferentes dispositivos
- Touch-friendly interfaces

---

## 📊 **MÉTRICAS Y REPORTES**

### **Dashboard Administrativo**
- Total de registros por categoría
- Ocupación de workshops en tiempo real
- Asistencias por actividad
- Equipos registrados para concurso

### **Exportación**
- Listas de participantes
- Reportes de asistencia
- Estadísticas de uso del sistema

---

## 🛠️ **MANTENIMIENTO**

### **Logs**
- Registro de errores automático
- Auditoría de cambios importantes
- Monitoreo de performance

### **Backup**
- Respaldo automático de base de datos
- Versionado de código en Git
- Documentación actualizada

---

**Versión**: 1.0.0  
**Fecha**: Septiembre 2025  
**Desarrollado para**: Universidad del Caribe - Jornada de Ingeniería Industrial