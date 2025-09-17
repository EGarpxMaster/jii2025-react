import { Router } from 'express';
import { pool } from '../db/pool.js';
import { equipoCreateSchema } from '../schemas/equipos.js';
import { ok, fail } from '../utils/reply.js';
import { equiposActivos, participanteTieneEquipo, CONCURSO_INICIO, CONCURSO_FIN } from '../services/equipos.service.js';

export const equipos = Router();

/** GET /api/equipos/check-name?nombre=... */
equipos.get('/check-name', async (req, res, next) => {
  try {
    const nombre = String(req.query.nombre || '').trim();
    if (!nombre) return res.json({ available: false });
    const [rows] = await pool.query("SELECT 1 FROM concurso_equipos WHERE nombre_equipo = ? LIMIT 1", [nombre]);
    res.json({ available: (rows as any[]).length === 0 });
  } catch (err) { next(err); }
});

/** GET /api/equipos/check-participant?email=... */
equipos.get('/check-participant', async (req, res, next) => {
  try {
    const email = String(req.query.email || '').toLowerCase();
    if (!email) return res.status(400).json(fail('Email requerido'));

    const [pRows] = await pool.query("SELECT * FROM participantes WHERE email = ?", [email]);
    if (!(pRows as any[]).length) return res.json({ valid: false, error: 'No encontrado', participante: null });

    const p = (pRows as any[])[0];
    const ya = await participanteTieneEquipo(p.id);
    if (ya) return res.json({ valid: false, error: 'Este participante ya pertenece a un equipo', participante: p });

    return res.json({ valid: true, participante: p });
  } catch (err) { next(err); }
});

/** POST /api/equipos */
equipos.post('/', async (req, res, next) => {
  try {
    const parse = equipoCreateSchema.safeParse(req.body);
    if (!parse.success) return res.status(422).json(fail('Datos inválidos','VALIDATION_ERROR', undefined, parse.error.issues));
    const { nombreEquipo, emailCapitan, emailsMiembros } = parse.data;

    // Rango de ventana
    const now = new Date();
    if (now < CONCURSO_INICIO || now > CONCURSO_FIN) {
      return res.status(403).json(fail('Registro fuera de ventana', 'FUERA_DE_VENTANA'));
    }

    // Capacidad 16 equipos
    const total = await equiposActivos();
    if (total >= 16) return res.status(409).json(fail('Concurso lleno', 'CONCURSO_LLENO'));

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Unicidad nombre (case-insensitive por collation)
      const nombre = nombreEquipo.trim();
      const [nRows] = await conn.query("SELECT 1 FROM concurso_equipos WHERE nombre_equipo = ? LIMIT 1", [nombre]);
      if ((nRows as any[]).length) {
        await conn.rollback(); conn.release();
        return res.status(409).json(fail('Nombre de equipo en uso', 'NOMBRE_TOMADO'));
      }

      // Participantes (capitán + 5)
      const emails = [emailCapitan, ...emailsMiembros].map(e => e.toLowerCase());
      const [pRows] = await conn.query(
        `SELECT * FROM participantes WHERE email IN (${emails.map(()=>'?').join(',')})`,
        emails
      );
      if ((pRows as any[]).length !== 6) {
        await conn.rollback(); conn.release();
        return res.status(400).json(fail('Todos los integrantes deben existir y estar registrados previamente', 'INTEGRANTES_INVALIDOS'));
      }

      const participantes = (pRows as any[]).map(r => r as any);
      const byEmail = Object.fromEntries(participantes.map((p:any)=>[p.email, p]));
      const cap = byEmail[emailCapitan.toLowerCase()];
      if (!cap) { await conn.rollback(); conn.release(); return res.status(400).json(fail('Capitán no válido', 'CAPITAN_INVALIDO')); }

      // Un equipo por persona
      const ids = participantes.map((p:any)=>p.id);
      const [yaRows] = await conn.query(
        `SELECT participante_id FROM concurso_miembros WHERE participante_id IN (${ids.map(()=>'?').join(',')}) AND activo = TRUE`,
        ids
      );
      if ((yaRows as any[]).length) {
        await conn.rollback(); conn.release();
        return res.status(409).json(fail('Alguno de los integrantes ya pertenece a un equipo', 'MIEMBRO_YA_EN_EQUIPO'));
      }

      // Crear equipo
      const [ins] = await conn.query(
        "INSERT INTO concurso_equipos (nombre_equipo, capitan_id, activo) VALUES (?,?, TRUE)",
        [nombre, cap.id]
      );
      const equipoId = (ins as any).insertId;

      // Miembros (incluye capitán)
      const values: any[] = [];
      for (const p of participantes) {
        const esCap = p.id === cap.id;
        values.push([equipoId, p.id, esCap]);
      }
      await conn.query(
        "INSERT INTO concurso_miembros (equipo_id, participante_id, es_capitan) VALUES " +
        values.map(()=>"(?,?,?)").join(","),
        values.flat()
      );

      await conn.commit(); conn.release();
      res.json(ok({ equipoId, nombreEquipo: nombre }));
    } catch (e) { await conn.rollback(); conn.release(); throw e; }
  } catch (err) { next(err); }
});
