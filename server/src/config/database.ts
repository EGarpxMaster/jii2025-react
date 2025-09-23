import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
  host: process.env.DB_HOST || '192.168.200.212',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'industrial',
  password: process.env.DB_PASSWORD || 'p@ss4DB',
  database: process.env.DB_NAME || process.env.DB_DATABASE || 'jornada_ii',
  charset: 'utf8mb4',
  timezone: 'Z', // UTC para evitar problemas de serialización
  connectionLimit: 10,
  multipleStatements: false,
  dateStrings: true, // Las fechas vendrán como strings 'YYYY-MM-DD HH:mm:ss'
};

// Pool de conexiones
export const pool = mysql.createPool(dbConfig);

// Función para probar la conexión
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Conexión a la base de datos exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    return false;
  }
}

// Función helper para ejecutar queries
export async function executeQuery<T = any>(
  query: string, 
  params: any[] = []
): Promise<T[]> {
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('Error ejecutando query:', error);
    throw error;
  }
}

// Función helper para ejecutar query que retorna un solo resultado
export async function executeQuerySingle<T = any>(
  query: string, 
  params: any[] = []
): Promise<T | null> {
  const results = await executeQuery<T>(query, params);
  return results.length > 0 ? results[0] : null;
}

// Función para transacciones
export async function executeTransaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}