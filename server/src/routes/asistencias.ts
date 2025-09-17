import { Router } from 'express';
import { pool } from '../db/pool.js';
import { asistenciaCreateSchema } from '../schemas/asistencias.js';
import { ok, fail } from '../utils/reply.js';
import { limiterAsistencias } from '../middleware/rateLimit.js';

export const asistencias = Router();

asistencias.use(limiterAsistencias);

/** GET /api/asistencias?email=... */
asistencias.get('/', async (req, res, next) => {
  try {
    const email = String(req.query.email || '').toLowerCase();
    if (!email) return res.status(400).json(fail('Email requerido'));
    const [pRows] = await pool.query("SELECT id FROM participantes WHERE email = ?", [email]);
    if (!(pRows as any[]).length) return res.status(404).json(fail('Participante no encontrado'));
    const pid = (pRows as any[])[0].id;

    const [rows] = await pool.query(
      "SELECT actividad_id AS actividadId, fecha_registro AS creado, modo FROM asistencias WHERE participante_id = ?",
      [pid]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

/** POST /api/asistencias { email, actividadId } */
asistencias.post('/', async (req, res, next) => {
  try {
    const parse = asistenciaCreateSchema.safeParse(req.body);
    if (!parse.success) return res.status(422).json(fail('Datos inválidos','VALIDATION_ERROR', undefined, parse.error.issues));
    const { email, actividadId } = parse.data;

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // participante
      const [pRows] = await conn.query("SELECT id, brazalete FROM participantes WHERE email = ? FOR UPDATE", [email.toLowerCase()]);
      if (!(pRows as any[]).length) { await conn.rollback(); conn.release(); return res.status(404).json(fail('Participante no encontrado')); }
      const participante = (pRows as any[])[0];
      if (!participante.brazalete) {
        await conn.rollback(); conn.release();
        return res.status(400).json(fail('Debe registrar su brazalete antes de marcar asistencia', 'BRAZALETE_REQUERIDO'));
      }

      // actividad
      const [aRows] = await conn.query("SELECT * FROM actividades WHERE id = ? FOR UPDATE", [actividadId]);
      if (!(aRows as any[]).length) { await conn.rollback(); conn.release(); return res.status(404).json(fail('Actividad no encontrada')); }
      const act = (aRows as any[])[0];

      // Ventana (-15, +30) desde inicio
      const [winRows] = await conn.query(
        `SELECT TIMESTAMPDIFF(
            MINUTE,
            a.fecha_inicio,
            CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '-05:00')
        ) AS diff
        FROM actividades a WHERE a.id = ?`,
        [actividadId]
        );

      const diff = Number((winRows as any[])[0]?.diff ?? 9999);
      if (diff < -15 || diff > 30) {
        await conn.rollback(); conn.release();
        return res.status(403).json(fail('Fuera de horario de marcaje', 'FUERA_DE_HORARIO'));
      }

      // Si es Workshop: debe estar inscrito (no en espera)
      if (act.tipo_evento === 'Workshop') {
        const [wRows] = await conn.query(
          "SELECT 1 FROM inscripciones_workshop WHERE participante_id=? AND actividad_id=? AND estado='inscrito' LIMIT 1",
          [participante.id, actividadId]
        );
        if (!(wRows as any[]).length) {
          await conn.rollback(); conn.release();
          return res.status(403).json(fail('Debes estar inscrito en el workshop para marcar asistencia', 'WS_NO_INSCRITO'));
        }
      }

      // Para Conferencia/Foro: limitar a cupo_maximo por 'presentes'
      if (act.tipo_evento === 'Conferencia' || act.tipo_evento === 'Foro') {
        const [cRows] = await conn.query(
          "SELECT COUNT(*) AS c FROM asistencias WHERE actividad_id=? AND estado='presente'",
          [actividadId]
        );
        const presentes = Number((cRows as any[])[0]?.c ?? 0);
        if (presentes >= act.cupo_maximo) {
          await conn.rollback(); conn.release();
          return res.status(403).json(fail('Cupo lleno para esta actividad', 'CUPO_LLENO'));
        }
      }

      // Upsert de asistencia
      try {
        await conn.query(
          "INSERT INTO asistencias (participante_id, actividad_id, estado, modo) VALUES (?,?, 'presente', 'self')",
          [participante.id, actividadId]
        );
      } catch (e: any) {
        // Duplicado => ya tenía asistencia
        if (e?.code === 'ER_DUP_ENTRY') {
          await conn.rollback(); conn.release();
          return res.status(409).json(fail('Ya tienes registrada la asistencia para esta actividad'));
        }
        throw e;
      }

      await conn.commit(); conn.release();
      res.json(ok({ actividadId, creado: new Date().toISOString(), modo: 'self' }));
    } catch (e) { await conn.rollback(); conn.release(); throw e; }
  } catch (err) { next(err); }
});
