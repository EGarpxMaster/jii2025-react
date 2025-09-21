import { executeQuerySingle } from '../config/database.js';

export class InscripcionesService {
  async getEstadoInscripcion(participanteId: number, actividadId: number): Promise<{inscrito: boolean, enCola: boolean}> {
    const query = `
      SELECT estado FROM inscripciones_workshop
      WHERE participante_id = ? AND actividad_id = ?
      ORDER BY creado DESC LIMIT 1
    `;
    const result = await executeQuerySingle(query, [participanteId, actividadId]);
    return {
      inscrito: result?.estado === 'inscrito',
      enCola: result?.estado === 'lista_espera'
    };
  }
}
