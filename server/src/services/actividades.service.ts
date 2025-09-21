import { executeQuery, executeQuerySingle } from '../config/database.js';
import type { 
  Actividad, 
  WorkshopStats, 
  AsistenciasStats, 
  TipoActividad 
} from '../types/database.js';
import { NotFoundError } from '../middleware/errors.js';

export class ActividadService {
  
  async getAllActividades(): Promise<Actividad[]> {
    const query = `
      SELECT * FROM actividades 
      WHERE activa = TRUE
      ORDER BY fecha_inicio ASC
    `;
    
    return executeQuery<Actividad>(query);
  }

  async getActividadesByTipo(tipo: TipoActividad): Promise<Actividad[]> {
    const query = `
      SELECT * FROM actividades 
      WHERE tipo = ? AND activa = TRUE
      ORDER BY fecha_inicio ASC
    `;
    
    return executeQuery<Actividad>(query, [tipo]);
  }

  async getWorkshopsWithStats(): Promise<WorkshopStats[]> {
    const query = `
      SELECT * FROM v_workshop_stats
      ORDER BY fecha_inicio ASC
    `;
    
    return executeQuery<WorkshopStats>(query);
  }

  async getConferenciasForosWithStats(): Promise<AsistenciasStats[]> {
    const query = `
      SELECT * FROM v_asistencias_stats
      ORDER BY fecha_inicio ASC
    `;
    
    return executeQuery<AsistenciasStats>(query);
  }

  async getWorkshopsInWindow(): Promise<WorkshopStats[]> {
    // Solo workshops en ventana de inscripción
    const query = `
      SELECT ws.* FROM v_workshop_stats ws
      JOIN configuracion_sistema cs1 ON cs1.clave = 'workshop_inscripcion_inicio'
      JOIN configuracion_sistema cs2 ON cs2.clave = 'workshop_inscripcion_fin'
      WHERE NOW() >= STR_TO_DATE(cs1.valor, '%Y-%m-%d %H:%i:%s')
        AND NOW() <= STR_TO_DATE(cs2.valor, '%Y-%m-%d %H:%i:%s')
      ORDER BY ws.fecha_inicio ASC
    `;
    
    return executeQuery<WorkshopStats>(query);
  }

  async getActividadById(id: number): Promise<Actividad | null> {
    const query = `
      SELECT * FROM actividades 
      WHERE id = ? AND activa = TRUE
    `;
    
    return executeQuerySingle<Actividad>(query, [id]);
  }

  async getActividadByCodigo(codigo: string): Promise<Actividad | null> {
    const query = `
      SELECT * FROM actividades 
      WHERE codigo = ? AND activa = TRUE
    `;
    
    return executeQuerySingle<Actividad>(query, [codigo]);
  }

  async getWorkshopStatsById(id: number): Promise<WorkshopStats | null> {
    const query = `
      SELECT * FROM v_workshop_stats
      WHERE id = ?
    `;
    
    return executeQuerySingle<WorkshopStats>(query, [id]);
  }

  async getAsistenciasStatsById(id: number): Promise<AsistenciasStats | null> {
    const query = `
      SELECT * FROM v_asistencias_stats
      WHERE id = ?
    `;
    
    return executeQuerySingle<AsistenciasStats>(query, [id]);
  }

  async getActividadesParaAsistencia(participanteId?: number): Promise<any[]> {
    // Obtener actividades con información de asistencia del participante si se proporciona
    let query = `
      SELECT 
        a.*,
        a.fecha_inicio as fechaInicio,
        a.fecha_fin as fechaFin,
        a.cupo_maximo as cupoMaximo,
        CASE 
          WHEN a.tipo = 'Workshop' THEN (
            SELECT COUNT(*) FROM inscripciones_workshop iw 
            WHERE iw.actividad_id = a.id AND iw.estado = 'inscrito'
          )
          ELSE (
            SELECT COUNT(*) FROM asistencias ast 
            WHERE ast.actividad_id = a.id AND ast.estado IN ('registrado', 'presente')
          )
        END as inscritos
    `;

    const params: any[] = [];

    if (participanteId) {
      query += `,
        (SELECT COUNT(*) FROM asistencias ast2 
         WHERE ast2.actividad_id = a.id AND ast2.participante_id = ?) as asistente_registrado
      `;
      params.push(participanteId);
    }

    query += `
      FROM actividades a
      WHERE a.activa = TRUE
      ORDER BY a.fecha_inicio ASC
    `;

    return executeQuery(query, params);
  }

  async getActividadesStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_actividades,
        SUM(CASE WHEN tipo = 'Workshop' THEN 1 ELSE 0 END) as workshops,
        SUM(CASE WHEN tipo = 'Conferencia' THEN 1 ELSE 0 END) as conferencias,
        SUM(CASE WHEN tipo = 'Foro' THEN 1 ELSE 0 END) as foros,
        SUM(cupo_maximo) as cupo_total,
        (SELECT COUNT(*) FROM inscripciones_workshop WHERE estado = 'inscrito') as inscritos_workshops,
        (SELECT COUNT(*) FROM asistencias WHERE estado IN ('registrado', 'presente')) as asistencias_totales
      FROM actividades
      WHERE activa = TRUE
    `;
    
    return executeQuerySingle(query);
  }
}