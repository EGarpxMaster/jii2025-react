// =========================================
// ARCHIVO DE CONFIGURACIÓN PARA PRUEBAS DE ESTRÉS
// server/stress-test-config.ts
// =========================================
import express from 'express';
import { testDbConfig } from './src/config/test-database.js';
const app = express();
// =========================================
// MIDDLEWARE OPTIMIZADO PARA ALTA CARGA
// =========================================
// Aumentar límites para el parser de JSON
app.use(express.json({
    limit: '10mb',
    strict: true
}));
app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));
// CORS optimizado para test
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Pre-flight handling
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
// Rate limiting MUY RELAJADO para stress test
const rateLimit = {
    windowMs: 1000, // 1 segundo
    max: 1000, // 1000 requests por segundo por IP
    message: 'Too many requests',
    standardHeaders: true,
    legacyHeaders: false,
};
// Middleware de compresión para respuestas grandes
app.use((req, res, next) => {
    res.setHeader('Content-Encoding', 'gzip');
    next();
});
// =========================================
// CONFIGURACIONES DE RENDIMIENTO
// =========================================
// Disable X-Powered-By header
app.disable('x-powered-by');
// Trust proxy para load balancing
app.set('trust proxy', 1);
// Keep-alive connections
app.use((req, res, next) => {
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Keep-Alive', 'timeout=5, max=1000');
    next();
});
// =========================================
// VARIABLES DE ENTORNO PARA STRESS TEST
// =========================================
const STRESS_TEST_CONFIG = {
    PORT: process.env.STRESS_TEST_PORT || 4000,
    DB_CONFIG: testDbConfig,
    // Configuraciones específicas para pruebas
    DISABLE_AUTH: process.env.DISABLE_AUTH === 'true', // Desactivar auth en stress test
    DISABLE_TIME_WINDOWS: true, // Sin restricciones de tiempo
    LOG_LEVEL: 'error', // Solo errores críticos
    // Configuraciones de respuesta
    RESPONSE_CACHE_TTL: 0, // Sin cache durante test
    MAX_RESPONSE_SIZE: '50mb', // Respuestas grandes permitidas
    // Database específico
    USE_TEST_DB: true,
    TEST_DB_NAME: 'jornada_ii_test'
};
export { app, STRESS_TEST_CONFIG };
export default STRESS_TEST_CONFIG;
