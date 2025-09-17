import 'dotenv/config';
import mysql from 'mysql2/promise';
import pino from 'pino';

const logger = pino({ name: 'db' });

const {
  DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME,
  DB_CONN_LIMIT = '10', DB_CONNECT_TIMEOUT = '15000'
} = process.env;

export const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: Number(DB_CONN_LIMIT),
  connectTimeout: Number(DB_CONNECT_TIMEOUT),
  waitForConnections: true,
  queueLimit: 0
});

logger.info('MySQL pool inicializado');
