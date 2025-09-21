import { Request, Response, NextFunction } from 'express';

// RATE LIMITING DESHABILITADO PARA EL EVENTO JII2025
export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Pasar directamente sin restricciones
  next();
};