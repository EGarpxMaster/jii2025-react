import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const payload = {
    ok: false,
    error: err.message || 'Error interno del servidor',
    code: err.code,
    field: err.field,
    details: err.details
  };
  res.status(status).json(payload);
}
