// =========================================
// CONFIGURACIÓN OPTIMIZADA PARA PRUEBAS DE ESTRÉS
// c:\Users\20030\Documents\GitHub\jii2025-react\server\src\config\test-database.ts
// =========================================

export const testDbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'jornada_ii_test', // ← Base de datos de prueba
  port: parseInt(process.env.DB_PORT || '3306'),
  ssl: process.env.DB_SSL === 'true',
  timezone: 'Z',
  dateStrings: true,
  
  // =========================================
  // CONFIGURACIÓN OPTIMIZADA PARA ALTA CARGA
  // =========================================
  acquireTimeout: 60000,        // 60 segundos para obtener conexión
  timeout: 30000,               // 30 segundos timeout por query
  reconnect: true,              // Reconexión automática
  
  // Pool de conexiones optimizado para stress test
  connectionLimit: 50,          // Máximo 50 conexiones concurrentes
  queueLimit: 100,             // Cola de hasta 100 requests
  createConnection: {
    timeout: 60000
  },
  
  // Configuraciones de rendimiento
  supportBigNumbers: true,
  bigNumberStrings: false,
  multipleStatements: false,    // Seguridad
  trace: false,                 // Desactivar trace en producción
  debug: false,                 // Desactivar debug
  
  // Configuraciones MySQL específicas para alta carga
  flags: [
    'COMPRESS',
    'PROTOCOL_41',
    'TRANSACTIONS'
  ]
};

export default testDbConfig;