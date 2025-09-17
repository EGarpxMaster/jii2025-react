import 'dotenv/config';
import express from 'express';
import pino from 'pino';
import { corsMw } from './middleware/cors.js';
import { errorHandler } from './middleware/errors.js';
import { rateLimitMw } from './middleware/rateLimit.js';

import { participantes } from './routes/participantes.js';
import { actividades } from './routes/actividades.js';
import { asistencias } from './routes/asistencias.js';
import { workshops } from './routes/workshops.js';
import { equipos } from './routes/equipos.js';
import { constancias } from './routes/constancias.js';

// Configurar logger basado en el ambiente
const isProduction = process.env.NODE_ENV === 'production';
const logger = pino({ 
  name: 'jii2025-api',
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  ...(isProduction && {
    redact: ['req.headers.authorization'],
    serializers: {
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
    }
  })
});

const app = express();

// Configuraciones de seguridad para producción
if (isProduction) {
  app.set('trust proxy', 1); // Confiar en el primer proxy
  app.disable('x-powered-by'); // Ocultar el header X-Powered-By
}

// Middleware de logging
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  }, 'Incoming request');
  next();
});

// Middleware básico
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS
app.use(corsMw);

// Rate limiting
app.use(rateLimitMw);

// Health check mejorado
app.get('/health', (_req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime()
  };
  
  logger.info('Health check requested');
  res.json(healthCheck);
});

// API Routes
app.use('/api/participantes', participantes);
app.use('/api/actividades', actividades);
app.use('/api/asistencias', asistencias);
app.use('/api/workshops', workshops);
app.use('/api/equipos', equipos);
app.use('/api/constancias', constancias);

// 404 handler - debe ir al final de todas las rutas
app.use((req, res, next) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl
  });
});

// Error handler
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully`);
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
  logger.info(`🚀 JII 2025 API listening on http://${host}:${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Database: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
});
