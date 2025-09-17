import rateLimit from 'express-rate-limit';

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
