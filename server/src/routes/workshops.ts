import { Router } from 'express';
import { pool } from '../db/pool.js';
import { wsInscripcionSchema, wsCancelSchema } from '../schemas/workshops.js';
import { ok, fail } from '../utils/reply.js';
import { limiterWorkshops } from '../middleware/rateLimit.js';
import { contarInscritos, promoverUno } from '../services/workshops.service.js';

export const workshops = Router();

workshops.use('/inscripciones', limiterWorkshops);

/** GET /api/workshops/inscripciones?email=... */
workshops.get('/inscripciones', async (req, res, next) => {
  try {
    const email = String(req.query.email || '').toLowerCase();
    if (!email) return res.status(400).json(fail('Email requerido'));
    const [pRows] = await pool.query("SELECT id FROM participantes WHERE email = ?", [email]);
    if (!(pRows as any[]).length) return res.status(404).json(fail('Participante no encontrado'));
    const pid = (pRows as any[])[0].id;

    const [rows] = await pool.query(
      "SELECT actividad_id AS actividadId, estado, creado FROM inscripciones_workshop WHERE participante_id = ?",
      [pid]
    );
    res.json(rows);
  } catch (err) { next(err); }
});

/** POST /api/workshops/inscripciones { email, actividadId } */
workshops.post('/inscripciones', async (req, res, next) => {
  try {
    const parse = wsInscripcionSchema.safeParse(req.body);
    if (!parse.success) return res.status(422).json(fail('Datos inválidos','VALIDATION_ERROR', undefined, parse.error.issues));
    const { email, actividadId } = parse.data;

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [pRows] = await conn.query("SELECT id FROM participantes WHERE email = ? FOR UPDATE", [email.toLowerCase()]);
      if (!(pRows as any[]).length) { await conn.rollback(); conn.release(); return res.status(404).json(fail('Participante no encontrado')); }
      const pid = (pRows as any[])[0].id;

      const [aRows] = await conn.query("SELECT * FROM actividades WHERE id = ? AND tipo_evento='Workshop' FOR UPDATE", [actividadId]);
      if (!(aRows as any[]).length) { await conn.rollback(); conn.release(); return res.status(404).json(fail('Workshop no encontrado')); }
      const ws = (aRows as any[])[0];

      // Verificar ventana de inscripción
      const [ventanaRows] = await conn.query(
        "SELECT TIMESTAMPDIFF(MINUTE, CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '-05:00'), ?) AS mins_inicio, TIMESTAMPDIFF(MINUTE, CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '-05:00'), ?) AS mins_fin",
        [ws.fecha_inicio, ws.fecha_fin]
      );
      const ventana = (ventanaRows as any[])[0];
      const minsInicio = Number(ventana.mins_inicio ?? -1);
      const minsFin = Number(ventana.mins_fin ?? -1);

      // Solo permitir inscripción si estamos dentro de la ventana válida (antes del inicio pero después de que se abra la inscripción)
      if (minsInicio <= 0) {
        await conn.rollback(); conn.release();
        return res.status(403).json(fail('Fuera de horario de inscripción', 'WS_FUERA_HORARIO'));
      }

      // No permitir múltiples workshops activos (inscrito o espera) que se superpongan en horario
      const [overlap] = await conn.query(`
        SELECT iw.id
        FROM inscripciones_workshop iw
        INNER JOIN actividades a ON a.id = iw.actividad_id
        WHERE iw.participante_id = ?
          AND iw.estado IN ('inscrito','lista_espera')
          AND (
            (a.fecha_inicio <= ? AND a.fecha_fin >= ?) OR
            (a.fecha_inicio <  ? AND a.fecha_fin >= ?) OR
            (a.fecha_inicio >= ? AND a.fecha_inicio <= ?)
          )
        LIMIT 1
      `, [pid, ws.fecha_fin, ws.fecha_inicio, ws.fecha_inicio, ws.fecha_inicio, ws.fecha_inicio, ws.fecha_fin]);

      if ((overlap as any[]).length) {
        await conn.rollback(); conn.release();
        return res.status(409).json(fail('Ya estás inscrito o en espera de otro workshop en el mismo horario', 'WS_UNICO'));
      }

      // Calcular estado (inscrito/lista_espera)
      const inscritos = await contarInscritos(ws.id);
      const estado = inscritos < ws.cupo_maximo ? 'inscrito' : 'lista_espera';

      try {
        await conn.query(
          "INSERT INTO inscripciones_workshop (participante_id, actividad_id, estado) VALUES (?,?,?)",
          [pid, actividadId, estado]
        );
      } catch (e: any) {
        if (e?.code === 'ER_DUP_ENTRY') {
          await conn.rollback(); conn.release();
          return res.status(409).json(fail('Ya cuentas con registro en este workshop'));
        }
        throw e;
      }

      await conn.commit(); conn.release();
      res.json(ok({ actividadId, estado, creado: new Date().toISOString() }));
    } catch (e) { await conn.rollback(); conn.release(); throw e; }
  } catch (err) { next(err); }
});

/** DELETE /api/workshops/inscripciones { email, actividadId } */
workshops.delete('/inscripciones', async (req, res, next) => {
  try {
    const parse = wsCancelSchema.safeParse(req.body);
    if (!parse.success) return res.status(422).json(fail('Datos inválidos','VALIDATION_ERROR', undefined, parse.error.issues));
    const { email, actividadId } = parse.data;

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [pRows] = await conn.query("SELECT id FROM participantes WHERE email = ? FOR UPDATE", [email.toLowerCase()]);
      if (!(pRows as any[]).length) { await conn.rollback(); conn.release(); return res.status(404).json(fail('Participante no encontrado')); }
      const pid = (pRows as any[])[0].id;

      const [aRows] = await conn.query("SELECT * FROM actividades WHERE id = ? AND tipo_evento='Workshop' FOR UPDATE", [actividadId]);
      if (!(aRows as any[]).length) { await conn.rollback(); conn.release(); return res.status(404).json(fail('Workshop no encontrado')); }
      const ws = (aRows as any[])[0];

      // Sólo cancelar hasta el inicio
      const [diffRows] = await conn.query(
        "SELECT TIMESTAMPDIFF(MINUTE, CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '-05:00'), ?) AS mins",
        [ws.fecha_inicio]
        );

      const mins = Number((diffRows as any[])[0]?.mins ?? -1);
      if (mins < 0) {
        await conn.rollback(); conn.release();
        return res.status(403).json(fail('Ya no es posible cancelar este workshop', 'WS_CIERRE_CANCEL'));
      }

      const [del] = await conn.query(
        "DELETE FROM inscripciones_workshop WHERE participante_id=? AND actividad_id=?",
        [pid, actividadId]
      );
      if ((del as any).affectedRows === 0) {
        await conn.rollback(); conn.release();
        return res.status(404).json(fail('No tienes inscripción registrada'));
      }

      // Promover lista de espera si procede
      await promoverUno(actividadId);

      await conn.commit(); conn.release();
      res.json(ok({ actividadId, cancelado: true }));
    } catch (e) { await conn.rollback(); conn.release(); throw e; }
  } catch (err) { next(err); }
});
