import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino';
// import rateLimit from 'express-rate-limit'; // REMOVIDO PARA JII2025

// Importar configuración
import { dbConfig } from './config/database.js';

// Importar middleware
import { corsMiddleware } from './middleware/cors.js';
import { errorMiddleware, asyncHandler } from './middleware/errors.js';
// import { rateLimitMiddleware } from './middleware/rateLimit.js'; // REMOVIDO PARA JII2025

// Importar rutas
import { participantesRoutes } from './routes/participantes.js';
import { actividadesRoutes } from './routes/actividades.js';
import { workshopsRoutes } from './routes/workshops.js';
import { asistenciasRoutes } from './routes/asistencias.js';
import { equiposRoutes } from './routes/equipos.js';
import { constanciasRoutes } from './routes/constancias.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  })
});

// Middleware básico
app.use(express.json({ limit: process.env.MAX_FILE_SIZE || '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware personalizado
app.use(corsMiddleware);
// app.use(rateLimitMiddleware); // DESHABILITADO PARA EL EVENTO JII2025

// Logging de requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Ruta raíz - información de la API
app.get('/', (req, res) => {
  res.json({
    name: 'Jornada de Ingeniería Industrial 2025 - API',
    version: '1.0.0',
    description: 'API REST para el manejo de participantes, actividades, workshops, asistencias y constancias',
    endpoints: {
      health: '/health',
      participantes: '/api/participantes',
      actividades: '/api/actividades',
      workshops: '/api/workshops',
      asistencias: '/api/asistencias',
      equipos: '/api/equipos',
      constancias: '/api/constancias',
      'estados-disponibles': '/api/estados-disponibles'
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas API
app.use('/api/participantes', participantesRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/workshops', workshopsRoutes);
app.use('/api/asistencias', asistenciasRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/constancias', constanciasRoutes);

// Ruta específica para estados disponibles del concurso
app.get('/api/estados-disponibles', async (req: Request, res: Response) => {
  console.log('🗺️ Llamada a /api/estados-disponibles');
  try {
    // Importar y usar el servicio de equipos directamente
    const { EquipoService } = await import('./services/equipos.service.js');
    const { createApiResponse } = await import('./utils/helpers.js');
    
    const equipoService = new EquipoService();
    const estados = await equipoService.getEstadosDisponibles();
    console.log('📊 Estados obtenidos:', estados?.length || 0, 'estados');
    
    res.json(createApiResponse(estados));
  } catch (error) {
    console.error('❌ Error en estados-disponibles:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorMiddleware);

// Ruta 404 - capturar todas las rutas no definidas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl 
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`Servidor corriendo en puerto ${PORT}`);
  logger.info(`Entorno: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Base de datos: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME || process.env.DB_DATABASE || 'jornada_ii'}`);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  logger.error({ error: error.message, stack: error.stack }, 'Uncaught Exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled Rejection');
  process.exit(1);
});

export default app;