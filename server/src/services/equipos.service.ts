import { pool } from '../db/pool.js';

export const CONCURSO_INICIO = new Date('2025-09-19T09:00:00-05:00'); // Cancún CDT
export const CONCURSO_FIN    = new Date('2025-09-20T23:59:00-05:00');

export async function equiposActivos() {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS c FROM concurso_equipos WHERE activo = TRUE"
  );
  return Number((rows as any[])[0]?.c ?? 0);
}

export async function participanteTieneEquipo(participanteId: number) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS c FROM concurso_miembros WHERE participante_id = ? AND activo = TRUE",
    [participanteId]
  );
  return Number((rows as any[])[0]?.c ?? 0) > 0;
}
