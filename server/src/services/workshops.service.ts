import { executeQuery, executeQuerySingle, executeTransaction } from '../config/database.js';
import type { 
  InscripcionWorkshop, 
  InscripcionWorkshopCreateDTO,
  WorkshopStats 
} from '../types/database.js';
import { ValidationError, NotFoundError, BusinessLogicError } from '../middleware/errors.js';
import { isInWorkshopWindow } from '../utils/validation.js';

export class WorkshopService {
  
  async getInscripcionesByParticipante(participanteId: number): Promise<any[]> {
    const query = `
      SELECT 
        iw.*,
        a.titulo,
        a.codigo,
        a.fecha_inicio,
        a.fecha_fin,
        a.lugar,
        a.ponente,
        a.cupo_maximo
      FROM inscripciones_workshop iw
      JOIN actividades a ON iw.actividad_id = a.id
      WHERE iw.participante_id = ?
      ORDER BY a.fecha_inicio ASC
    `;
    
    return executeQuery(query, [participanteId]);
  }

  async getInscripcionesByActividad(actividadId: number): Promise<any[]> {
    const query = `
      SELECT 
        iw.*,
        p.primer_nombre,
        p.segundo_nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.email,
        p.categoria,
        p.programa,
        p.brazalete
      FROM inscripciones_workshop iw
      JOIN participantes p ON iw.participante_id = p.id
      WHERE iw.actividad_id = ?
      ORDER BY iw.creado ASC
    `;
    
    return executeQuery(query, [actividadId]);
  }

  async inscribirParticipante(data: InscripcionWorkshopCreateDTO): Promise<InscripcionWorkshop> {
    // Validar ventana de inscripción
    const inWindow = await isInWorkshopWindow();
    if (!inWindow) {
      throw new BusinessLogicError('Fuera de la ventana de inscripción a workshops');
    }

    // Verificar que el participante existe
    const participante = await executeQuerySingle(
      'SELECT id FROM participantes WHERE id = ?',
      [data.participante_id]
    );
    if (!participante) {
      throw new NotFoundError('Participante no encontrado');
    }

    // Verificar que la actividad existe y es un workshop
    const actividad = await executeQuerySingle(
      'SELECT id, tipo, activa FROM actividades WHERE id = ? AND tipo = "Workshop"',
      [data.actividad_id]
    );
    if (!actividad) {
      throw new NotFoundError('Workshop no encontrado');
    }
    if (!actividad.activa) {
      throw new BusinessLogicError('El workshop no está activo');
    }

    // Verificar que el participante no tenga ya una inscripción activa
    const inscripcionExistente = await executeQuerySingle(
      `SELECT id FROM inscripciones_workshop 
       WHERE participante_id = ? AND estado IN ('inscrito', 'lista_espera')`,
      [data.participante_id]
    );
    if (inscripcionExistente) {
      throw new BusinessLogicError('Ya tienes una inscripción activa a un workshop');
    }

    // Verificar que no esté ya inscrito en esta actividad específica
    const inscripcionDuplicada = await executeQuerySingle(
      'SELECT id FROM inscripciones_workshop WHERE participante_id = ? AND actividad_id = ?',
      [data.participante_id, data.actividad_id]
    );
    if (inscripcionDuplicada) {
      throw new BusinessLogicError('Ya estás inscrito en este workshop');
    }

    const insertQuery = `
      INSERT INTO inscripciones_workshop (participante_id, actividad_id, estado)
      VALUES (?, ?, 'inscrito')
    `;

    return executeTransaction(async (connection) => {
      try {
        // Insertar la inscripción
        const [result] = await connection.execute(insertQuery, [data.participante_id, data.actividad_id]);
        const insertId = (result as any).insertId;
        
        if (!insertId) {
          throw new Error('No se pudo obtener el ID de la inscripción creada');
        }

        // Recuperar la inscripción usando la misma conexión de transacción
        const [rows] = await connection.execute(
          'SELECT * FROM inscripciones_workshop WHERE id = ?',
          [insertId]
        );
        
        const inscripcion = (rows as any[])[0] as InscripcionWorkshop;
        
        if (!inscripcion) {
          throw new Error(`Inscripción con ID ${insertId} no encontrada después de la inserción`);
        }
        
        return inscripcion;
        
      } catch (error) {
        // Log más detallado del error
        if (error instanceof Error) {
          console.error('Error en inscribirParticipante:', {
            error: error.message,
            participante_id: data.participante_id,
            actividad_id: data.actividad_id,
            stack: error.stack
          });
        } else {
          console.error('Error en inscribirParticipante:', {
            error,
            participante_id: data.participante_id,
            actividad_id: data.actividad_id
          });
        }
        
        // Re-lanzar el error para que la transacción se revierta
        throw error;
      }
    });
  }

  async cancelarInscripcion(participanteId: number, actividadId: number): Promise<boolean> {
    // Verificar que la inscripción existe
    const inscripcion = await executeQuerySingle(
      `SELECT id, estado FROM inscripciones_workshop 
       WHERE participante_id = ? AND actividad_id = ?`,
      [participanteId, actividadId]
    );
    
    if (!inscripcion) {
      throw new NotFoundError('Inscripción no encontrada');
    }

    if (inscripcion.estado === 'cancelado') {
      throw new BusinessLogicError('La inscripción ya está cancelada');
    }

    const query = `
      UPDATE inscripciones_workshop 
      SET estado = 'cancelado', actualizado = NOW()
      WHERE participante_id = ? AND actividad_id = ?
    `;

    return executeTransaction(async (connection) => {
      const [result] = await connection.execute(query, [participanteId, actividadId]);
      // El trigger se encargará de promover a alguien de la lista de espera si es necesario
      return (result as any).affectedRows > 0;
    });
  }

  async getEstadoInscripcion(participanteId: number, actividadId: number): Promise<any> {
    const query = `
      SELECT 
        iw.*,
        a.titulo,
        a.codigo,
        a.cupo_maximo,
        (SELECT COUNT(*) FROM inscripciones_workshop iw2 
         WHERE iw2.actividad_id = ? AND iw2.estado = 'inscrito') as inscritos_actuales
      FROM inscripciones_workshop iw
      JOIN actividades a ON iw.actividad_id = a.id
      WHERE iw.participante_id = ? AND iw.actividad_id = ?
    `;
    
    return executeQuerySingle(query, [actividadId, participanteId, actividadId]);
  }

  async getWorkshopsDisponibles(): Promise<WorkshopStats[]> {
    const query = `
      SELECT * FROM v_workshop_stats
      WHERE estado_cupo != 'LLENO'
      ORDER BY fecha_inicio ASC
    `;
    
    return executeQuery<WorkshopStats>(query);
  }

  async getListaEspera(actividadId: number): Promise<any[]> {
    const query = `
      SELECT 
        iw.*,
        p.primer_nombre,
        p.segundo_nombre,
        p.apellido_paterno,
        p.apellido_materno,
        p.email,
        p.categoria,
        p.programa
      FROM inscripciones_workshop iw
      JOIN participantes p ON iw.participante_id = p.id
      WHERE iw.actividad_id = ? AND iw.estado = 'lista_espera'
      ORDER BY iw.creado ASC
    `;
    
    return executeQuery(query, [actividadId]);
  }

  async getWorkshopStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(DISTINCT actividad_id) as workshops_disponibles,
        COUNT(*) as inscripciones_totales,
        SUM(CASE WHEN estado = 'inscrito' THEN 1 ELSE 0 END) as inscritos,
        SUM(CASE WHEN estado = 'lista_espera' THEN 1 ELSE 0 END) as en_lista_espera,
        SUM(CASE WHEN estado = 'cancelado' THEN 1 ELSE 0 END) as cancelados
      FROM inscripciones_workshop iw
      JOIN actividades a ON iw.actividad_id = a.id
      WHERE a.activa = TRUE
    `;
    
    return executeQuerySingle(query);
  }

  async getInscripcionById(id: number): Promise<InscripcionWorkshop | null> {
    const query = 'SELECT * FROM inscripciones_workshop WHERE id = ?';
    return executeQuerySingle<InscripcionWorkshop>(query, [id]);
  }
}