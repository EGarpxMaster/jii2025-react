import { pool } from '../db/pool.js';

export async function contarInscritos(actividadId: number) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS c FROM inscripciones_workshop WHERE actividad_id = ? AND estado = 'inscrito'",
    [actividadId]
  );
  const c = (rows as any[])[0]?.c ?? 0;
  return Number(c);
}

export async function firstInWaitlist(actividadId: number) {
  const [rows] = await pool.query(
    "SELECT id, participante_id FROM inscripciones_workshop WHERE actividad_id = ? AND estado = 'lista_espera' ORDER BY creado ASC LIMIT 1",
    [actividadId]
  );
  return (rows as any[])[0] || null;
}

export async function promoverUno(actividadId: number) {
  const next = await firstInWaitlist(actividadId);
  if (!next) return null;
  await pool.query(
    "UPDATE inscripciones_workshop SET estado = 'inscrito' WHERE id = ?",
    [next.id]
  );
  return next.participante_id as number;
}
