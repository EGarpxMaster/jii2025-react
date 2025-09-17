import cors from 'cors';

export const corsMw = cors({
  origin: process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || '*',
  credentials: true
});
