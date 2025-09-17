import 'dotenv/config';
import express from 'express';
import pino from 'pino';
import { corsMw } from './middleware/cors.js';
import { errorHandler } from './middleware/errors.js';

import { participantes } from './routes/participantes.js';
import { actividades } from './routes/actividades.js';
import { asistencias } from './routes/asistencias.js';
import { workshops } from './routes/workshops.js';
import { equipos } from './routes/equipos.js';
import { constancias } from './routes/constancias.js';

const logger = pino({ name: 'api' });
const app = express();

app.use(express.json());
app.use(corsMw);

// Health
app.get('/health', (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'dev' }));

// Routes
app.use('/api/participantes', participantes);
app.use('/api/actividades', actividades);
app.use('/api/asistencias', asistencias);
app.use('/api/workshops', workshops);
app.use('/api/equipos', equipos);
app.use('/api/constancias', constancias);

// Errors
app.use(errorHandler);

const port = Number(process.env.PORT || 3001);
app.listen(port, () => logger.info(`API escuchando en http://localhost:${port}`));
