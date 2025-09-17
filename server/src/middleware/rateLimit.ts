import rateLimit from 'express-rate-limit';

// Rate limiter general para toda la API
export const rateLimitMw = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos por defecto
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // límite de 100 requests por IP por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { 
    ok: false, 
    error: 'Demasiadas solicitudes desde esta IP. Intenta de nuevo más tarde.',
    retryAfter: '15 minutos'
  },
  // Skip para health checks
  skip: (req) => req.path === '/health'
});

export const limiterAsistencias = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Demasiadas solicitudes, intenta más tarde.' }
});

export const limiterWorkshops = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Demasiadas solicitudes, intenta más tarde.' }
});
