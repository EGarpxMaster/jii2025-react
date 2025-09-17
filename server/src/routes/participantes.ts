import { Router } from 'express';
import { pool } from '../db/pool.js';
import { participanteCreateSchema, asignarBrazaleteSchema } from '../schemas/participantes.js';
import { ok, fail } from '../utils/reply.js';

export const participantes = Router();

/** POST /api/participantes */
participantes.post('/', async (req, res, next) => {
  try {
    const parse = participanteCreateSchema.safeParse(req.body);
    if (!parse.success) return res.status(422).json(fail('Datos inválidos', 'VALIDATION_ERROR', undefined, parse.error.issues));
    const d = parse.data;

    // email único
    const [ex] = await pool.query("SELECT id FROM participantes WHERE email = ?", [d.email.trim().toLowerCase()]);
    if ((ex as any[]).length) return res.status(409).json(fail('Este correo ya fue registrado', 'EMAIL_TAKEN', 'email'));

    const [r] = await pool.query(
      `INSERT INTO participantes 
       (apellido_paterno, apellido_materno, primer_nombre, segundo_nombre, email, telefono, categoria, programa) 
       VALUES (?,?,?,?,?,?,?,?)`,
      [
        d.apellidoPaterno.trim(),
        d.apellidoMaterno.trim(),
        d.primerNombre.trim(),
        d.segundoNombre || null,
        d.email.trim().toLowerCase(),
        d.telefono || null,
        d.categoria,
        d.categoria === 'Estudiante' ? d.programa! : null
      ]
    );
    const id = (r as any).insertId;
    const [row] = await pool.query("SELECT * FROM participantes WHERE id = ?", [id]);
    res.json(ok((row as any[])[0]));
  } catch (err) { next(err); }
});

/** GET /api/participantes?email=... */
participantes.get('/', async (req, res, next) => {
  try {
    const email = String(req.query.email || '').toLowerCase();
    if (!email) return res.status(400).json(fail('Email requerido'));
    const [rows] = await pool.query("SELECT * FROM participantes WHERE email = ?", [email]);
    if (!(rows as any[]).length) return res.status(404).json(fail('No encontrado'));
    res.json((rows as any[])[0]); // FE de Workshop/Asistencia esperan objeto directo
  } catch (err) { next(err); }
});

/** GET /api/participantes/check-email?email=... */
participantes.get('/check-email', async (req, res, next) => {
  try {
    const email = String(req.query.email || '').toLowerCase();
    if (!email) return res.json({ unique: false });
    const [rows] = await pool.query("SELECT 1 FROM participantes WHERE email = ? LIMIT 1", [email]);
    const unique = (rows as any[]).length === 0;
    res.json({ unique });
  } catch (err) { next(err); }
});

/** POST /api/participantes/brazalete { email, brazalete } */
participantes.post('/brazalete', async (req, res, next) => {
  try {
    const parse = asignarBrazaleteSchema.safeParse(req.body);
    if (!parse.success) return res.status(422).json(fail('Datos inválidos', 'VALIDATION_ERROR', undefined, parse.error.issues));
    const { email, brazalete } = parse.data;

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.query("SELECT id, brazalete FROM participantes WHERE email = ? FOR UPDATE", [email.toLowerCase()]);
      if (!(rows as any[]).length) {
        await conn.rollback(); conn.release();
        return res.status(404).json(fail('Participante no encontrado'));
      }
      const p = (rows as any[])[0];
      if (p.brazalete) {
        await conn.rollback(); conn.release();
        return res.status(409).json(fail('Ya tiene brazalete asignado', 'BRAZALETE_YA_ASIGNADO'));
      }
      // Verificar disponibilidad del brazalete
      const [b] = await conn.query("SELECT 1 FROM participantes WHERE brazalete = ? LIMIT 1", [brazalete]);
      if ((b as any[]).length) {
        await conn.rollback(); conn.release();
        return res.status(409).json(fail('Brazalete en uso', 'BRAZALETE_OCUPADO', 'brazalete'));
      }
      await conn.query("UPDATE participantes SET brazalete = ? WHERE id = ?", [brazalete, p.id]);
      await conn.commit(); conn.release();
      res.json(ok({ email, brazalete }));
    } catch (e) {
      await conn.rollback(); conn.release(); throw e;
    }
  } catch (err) { next(err); }
});

/** PATCH /api/participantes/asignar-brazalete { email, brazalete } */
participantes.patch('/asignar-brazalete', async (req, res, next) => {
  try {
    const parse = asignarBrazaleteSchema.safeParse(req.body);
    if (!parse.success) return res.status(422).json(fail('Datos inválidos', 'VALIDATION_ERROR', undefined, parse.error.issues));
    const { email, brazalete } = parse.data;

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.query("SELECT id, brazalete FROM participantes WHERE email = ? FOR UPDATE", [email.toLowerCase()]);
      if (!(rows as any[]).length) {
        await conn.rollback(); conn.release();
        return res.status(404).json(fail('Participante no encontrado'));
      }
      const p = (rows as any[])[0];
      if (p.brazalete) {
        await conn.rollback(); conn.release();
        return res.status(409).json(fail('Ya tiene brazalete asignado', 'BRAZALETE_YA_ASIGNADO'));
      }
      // Verificar disponibilidad del brazalete
      const [b] = await conn.query("SELECT 1 FROM participantes WHERE brazalete = ? LIMIT 1", [brazalete]);
      if ((b as any[]).length) {
        await conn.rollback(); conn.release();
        return res.status(409).json(fail('Brazalete en uso', 'BRAZALETE_OCUPADO', 'brazalete'));
      }
      await conn.query("UPDATE participantes SET brazalete = ? WHERE id = ?", [brazalete, p.id]);
      await conn.commit(); conn.release();
      res.json(ok({ email, brazalete }));
    } catch (e) {
      await conn.rollback(); conn.release(); throw e;
    }
  } catch (err) { next(err); }
});
