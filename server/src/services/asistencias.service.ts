import { executeQuery, executeQuerySingle, executeTransaction } from '../config/database.js';
import type { 
  Asistencia, 
  AsistenciaCreateDTO,
  ModoAsistencia 
} from '../types/database.js';
import { ValidationError, NotFoundError, BusinessLogicError } from '../middleware/errors.js';
import { isInAttendanceWindow } from '../utils/validation.js';

export class AsistenciaService {
  
  async marcarAsistencia(data: AsistenciaCreateDTO): Promise<Asistencia> {
    // Método simplificado que delega a registrarAsistenciaPorEmail
    return this.registrarAsistenciaPorEmail('', data.actividad_id);
  }

  async registrarAsistencia(data: AsistenciaCreateDTO): Promise<Asistencia> {
    // Método simplificado que delega a registrarAsistenciaPorEmail
    return this.registrarAsistenciaPorEmail('', data.actividad_id);
  }

  async registrarAsistenciaPorEmail(email: string, actividadId: number): Promise<Asistencia> {
    // Buscar participante por email
    const participante = await executeQuerySingle(
      'SELECT id FROM participantes WHERE LOWER(email) = LOWER(?)',
      [email]
    );
    if (!participante) {
      throw new NotFoundError('Participante no encontrado');
    }

    // Verificar que la actividad existe
    const actividad = await executeQuerySingle(
      'SELECT id, titulo, fecha_inicio, activa FROM actividades WHERE id = ?',
      [actividadId]
    );
    if (!actividad) {
      throw new NotFoundError('Actividad no encontrada');
    }
    if (!actividad.activa) {
      throw new BusinessLogicError('La actividad no está activa');
    }

    // Verificar ventana de marcaje (15 min antes - 15 min después del inicio)
    const inWindow = await isInAttendanceWindow(new Date(actividad.fecha_inicio));
    if (!inWindow) {
      throw new BusinessLogicError(`Fuera de la ventana de inscripción a ${actividad.titulo}`);
    }

    // Verificar si ya tiene asistencias
    const asistenciaExistente = await executeQuerySingle(
      'SELECT id FROM asistencias WHERE participante_id = ? AND actividad_id = ?',
      [participante.id, actividadId]
    );
    
    if (asistenciaExistente) {
      throw new BusinessLogicError('Ya tienes una asistencia registrada para esta actividad');
    }

    const query = `
      INSERT INTO asistencias (participante_id, actividad_id, estado, modo_asistencia, notas)
      VALUES (?, ?, 'registrado', 'self', NULL)
    `;

    return executeTransaction(async (connection) => {
      const [result] = await connection.execute(query, [participante.id, actividadId]);
      const insertId = (result as any).insertId;
      
      const [rows] = await connection.execute(
        'SELECT * FROM asistencias WHERE id = ?',
        [insertId]
      );
      
      const asistencia = (rows as any[])[0];
      if (!asistencia) {
        throw new Error('Error al recuperar la asistencia creada');
      }
      
      return asistencia;
    });
  }

  async getAsistenciasByParticipante(participanteId: number): Promise<Asistencia[]> {
    const query = `
      SELECT a.*, act.titulo as actividad_titulo, act.fecha_inicio, act.fecha_fin
      FROM asistencias a
      JOIN actividades act ON a.actividad_id = act.id
      WHERE a.participante_id = ?
      ORDER BY act.fecha_inicio DESC
    `;
    
    return executeQuery<Asistencia>(query, [participanteId]);
  }

  async getAsistenciasByActividad(actividadId: number): Promise<Asistencia[]> {
    const query = `
      SELECT a.*, 
             CONCAT(p.primer_nombre, ' ', p.apellido_paterno, ' ', p.apellido_materno) as participante_nombre,
             p.email as participante_email,
             p.brazalete
      FROM asistencias a
      JOIN participantes p ON a.participante_id = p.id
      WHERE a.actividad_id = ?
      ORDER BY a.creado DESC
    `;
    
    return executeQuery<Asistencia>(query, [actividadId]);
  }

  async getEstadoAsistencia(participanteId: number, actividadId: number): Promise<Asistencia | null> {
    const query = `
      SELECT * FROM asistencias 
      WHERE participante_id = ? AND actividad_id = ?
    `;
    
    return executeQuerySingle<Asistencia>(query, [participanteId, actividadId]);
  }

  async getAsistenciasParaConstancia(participanteId: number): Promise<Asistencia[]> {
    const query = `
      SELECT a.*, act.titulo, act.fecha_inicio, act.fecha_fin, act.tipo
      FROM asistencias a
      JOIN actividades act ON a.actividad_id = act.id
      WHERE a.participante_id = ? AND a.estado = 'presente'
      ORDER BY act.fecha_inicio
    `;
    
    return executeQuery<Asistencia>(query, [participanteId]);
  }

  async verificarElegibilidadConstancia(participanteId: number): Promise<{ elegible: boolean; asistencias: number; requeridas: number }> {
    const asistencias = await this.getAsistenciasParaConstancia(participanteId);
    const requeridas = 3; // Mínimo de asistencias requeridas
    
    return {
      elegible: asistencias.length >= requeridas,
      asistencias: asistencias.length,
      requeridas
    };
  }

  async getAsistenciasStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_asistencias,
        COUNT(CASE WHEN estado = 'presente' THEN 1 END) as presentes,
        COUNT(CASE WHEN estado = 'registrado' THEN 1 END) as registrados,
        COUNT(CASE WHEN estado = 'ausente' THEN 1 END) as ausentes
      FROM asistencias
    `;
    
    return executeQuerySingle(query);
  }

  async getAsistenciaById(id: number): Promise<Asistencia | null> {
    const query = 'SELECT * FROM asistencias WHERE id = ?';
    return executeQuerySingle<Asistencia>(query, [id]);
  }
}
