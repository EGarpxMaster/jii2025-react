import type { Request, Response, NextFunction } from 'express';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

export class ValidationError extends Error {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  code = 'NOT_FOUND';
  
  constructor(message: string = 'Recurso no encontrado') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends Error {
  statusCode = 500;
  code = 'DATABASE_ERROR';
  
  constructor(message: string = 'Error en la base de datos') {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class BusinessLogicError extends Error {
  statusCode = 422;
  code = 'BUSINESS_LOGIC_ERROR';
  
  constructor(message: string) {
    super(message);
    this.name = 'BusinessLogicError';
  }
}

export const errorMiddleware = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';
  const code = error.code || 'INTERNAL_ERROR';

  // Log del error
  logger.error({
    error: {
      message: error.message,
      stack: error.stack,
      code,
      statusCode
    },
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip
    }
  });

  // Respuesta al cliente
  res.status(statusCode).json({
    error: {
      message,
      code,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
};

// Wrapper para manejar errores async
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};