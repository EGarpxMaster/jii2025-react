import { executeQuery, executeQuerySingle, executeTransaction } from '../config/database.js';
import type { 
  EquipoConcurso, 
  EquipoConcursoCreateDTO,
  EstadoMexico 
} from '../types/database.js';
import { ValidationError, NotFoundError, BusinessLogicError } from '../middleware/errors.js';
import { isInContestWindow } from '../utils/validation.js';
import { sanitizeString, isValidEmail } from '../utils/helpers.js';

export class EquipoService {
  
  async getAllEquipos(): Promise<any[]> {
    const query = `
      SELECT 
        e.*,
        est.nombre as estado_nombre,
        est.codigo as estado_codigo,
        est.region as estado_region
      FROM equipos_concurso e
      JOIN estados_mexico est ON e.estado_id = est.id
      ORDER BY e.fecha_registro DESC
    `;
    
    return executeQuery(query);
  }

  async getEquipoById(id: number): Promise<any | null> {
    const query = `
      SELECT 
        e.*,
        est.nombre as estado_nombre,
        est.codigo as estado_codigo,
        est.region as estado_region
      FROM equipos_concurso e
      JOIN estados_mexico est ON e.estado_id = est.id
      WHERE e.id = ?
    `;
    
    return executeQuerySingle(query, [id]);
  }

  async getEquipoByNombre(nombre: string): Promise<EquipoConcurso | null> {
    const query = 'SELECT * FROM equipos_concurso WHERE nombre_equipo = ?';
    return executeQuerySingle<EquipoConcurso>(query, [nombre]);
  }

  async getEstadosDisponibles(): Promise<EstadoMexico[]> {
    const query = `
      SELECT * FROM estados_mexico 
      WHERE disponible = TRUE
      ORDER BY nombre ASC
    `;
    
    return executeQuery<EstadoMexico>(query);
  }

  async getEstadoById(id: number): Promise<EstadoMexico | null> {
    const query = 'SELECT * FROM estados_mexico WHERE id = ?';
    return executeQuerySingle<EstadoMexico>(query, [id]);
  }

  async crearEquipo(data: EquipoConcursoCreateDTO): Promise<EquipoConcurso> {
    // VALIDACIÓN DE VENTANA DESHABILITADA PARA PRUEBAS
    // const inWindow = await isInContestWindow();
    // if (!inWindow) {
    //   throw new BusinessLogicError('Fuera de la ventana de inscripción al concurso');
    // }

    // Validaciones básicas
    this.validateEquipoData(data);

    return executeTransaction(async (connection) => {
      // Verificar que el estado existe y está disponible DENTRO de la transacción
      const [estadoRows] = await connection.execute(
        'SELECT * FROM estados_mexico WHERE id = ? FOR UPDATE',
        [data.estado_id]
      );
      const estado = (estadoRows as any[])[0];
      
      if (!estado) {
        throw new NotFoundError('Estado no encontrado');
      }
      if (!estado.disponible) {
        throw new BusinessLogicError('El estado seleccionado ya no está disponible');
      }

      // Verificar que no existe otro equipo con este estado (doble verificación)
      const [equipoExistenteRows] = await connection.execute(
        'SELECT COUNT(*) as count FROM equipos_concurso WHERE estado_id = ? AND estado_registro IN (?, ?)',
        [data.estado_id, 'pendiente', 'confirmado']
      );
      const equipoExistente = (equipoExistenteRows as any[])[0];
      
      if (equipoExistente.count > 0) {
        throw new BusinessLogicError('Ya existe un equipo registrado para este estado');
      }

      // Verificar que todos los emails existen en participantes
      const emails = [
        data.email_capitan,
        data.email_miembro_1,
        data.email_miembro_2,
        data.email_miembro_3,
        data.email_miembro_4,
        data.email_miembro_5
      ];

      await this.validateEmailsExistInTransaction(connection, emails);
      await this.validateEmailsNotInOtherTeamsInTransaction(connection, emails);

      // Crear el equipo
      const equipoQuery = `
        INSERT INTO equipos_concurso (
          estado_id,
          email_capitan, email_miembro_1, email_miembro_2,
          email_miembro_3, email_miembro_4, email_miembro_5,
          estado_registro
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pendiente')
      `;

      const equipoParams = [
        data.estado_id,
        data.email_capitan.toLowerCase().trim(),
        data.email_miembro_1.toLowerCase().trim(),
        data.email_miembro_2.toLowerCase().trim(),
        data.email_miembro_3.toLowerCase().trim(),
        data.email_miembro_4.toLowerCase().trim(),
        data.email_miembro_5.toLowerCase().trim()
      ];

      const [equipoResult] = await connection.execute(equipoQuery, equipoParams);
      const insertId = (equipoResult as any).insertId;

      // Generar nombre del equipo
      const nombreEquipo = `Equipo ${estado.nombre}`;
      
      // Actualizar el nombre del equipo
      await connection.execute(
        'UPDATE equipos_concurso SET nombre_equipo = ? WHERE id = ?',
        [nombreEquipo, insertId]
      );

      // Marcar el estado como no disponible inmediatamente
      const updateResult = await connection.execute(
        'UPDATE estados_mexico SET disponible = FALSE WHERE id = ?',
        [data.estado_id]
      );

      console.log(`Estado ${data.estado_id} marcado como no disponible. Filas afectadas:`, (updateResult[0] as any).affectedRows);
      
      // Buscar el equipo recién creado
      const [equipoRows] = await connection.execute(
        'SELECT * FROM equipos_concurso WHERE id = ?',
        [insertId]
      );
      const equipo = (equipoRows as any[])[0];
      
      if (!equipo) {
        throw new Error('Error al recuperar el equipo creado');
      }
      
      return equipo;
    });
  }

  async confirmarEquipo(id: number): Promise<EquipoConcurso> {
    const equipo = await executeQuerySingle<EquipoConcurso>(
      'SELECT * FROM equipos_concurso WHERE id = ?',
      [id]
    );
    
    if (!equipo) {
      throw new NotFoundError('Equipo no encontrado');
    }

    if (equipo.estado_registro === 'confirmado') {
      throw new BusinessLogicError('El equipo ya está confirmado');
    }

    if (equipo.estado_registro === 'cancelado') {
      throw new BusinessLogicError('No se puede confirmar un equipo cancelado');
    }

    const query = `
      UPDATE equipos_concurso 
      SET estado_registro = 'confirmado', fecha_confirmacion = NOW(), actualizado = NOW()
      WHERE id = ?
    `;

    return executeTransaction(async (connection) => {
      await connection.execute(query, [id]);
      
      // Asegurar que el estado esté marcado como no disponible
      await connection.execute(
        'UPDATE estados_mexico SET disponible = FALSE WHERE id = ?',
        [equipo.estado_id]
      );
      
      const [equipoRows] = await connection.execute(
        'SELECT * FROM equipos_concurso WHERE id = ?',
        [id]
      );
      const equipoActualizado = (equipoRows as any[])[0];
      
      if (!equipoActualizado) {
        throw new Error('Error al recuperar el equipo actualizado');
      }
      
      return equipoActualizado;
    });
  }

  async cancelarEquipo(id: number): Promise<EquipoConcurso> {
    const equipo = await executeQuerySingle<EquipoConcurso>(
      'SELECT * FROM equipos_concurso WHERE id = ?',
      [id]
    );
    
    if (!equipo) {
      throw new NotFoundError('Equipo no encontrado');
    }

    if (equipo.estado_registro === 'cancelado') {
      throw new BusinessLogicError('El equipo ya está cancelado');
    }

    const query = `
      UPDATE equipos_concurso 
      SET estado_registro = 'cancelado', actualizado = NOW()
      WHERE id = ?
    `;

    return executeTransaction(async (connection) => {
      await connection.execute(query, [id]);
      
      // Liberar el estado para que vuelva a estar disponible
      await connection.execute(
        'UPDATE estados_mexico SET disponible = TRUE WHERE id = ?',
        [equipo.estado_id]
      );
      
      const [equipoRows] = await connection.execute(
        'SELECT * FROM equipos_concurso WHERE id = ?',
        [id]
      );
      const equipoActualizado = (equipoRows as any[])[0];
      
      if (!equipoActualizado) {
        throw new Error('Error al recuperar el equipo actualizado');
      }
      
      return equipoActualizado;
    });
  }

  // Método auxiliar para validar emails en transacción
  private async validateEmailsExistInTransaction(connection: any, emails: string[]): Promise<void> {
    const placeholders = emails.map(() => '?').join(',');
    const query = `SELECT COUNT(*) as count FROM participantes WHERE email IN (${placeholders})`;
    
    const [rows] = await connection.execute(query, emails);
    const result = (rows as any[])[0];
    
    if (result?.count !== emails.length) {
      throw new ValidationError('Todos los correos deben existir como participantes registrados');
    }
  }

  // Método auxiliar para validar que emails no estén en otros equipos en transacción
  private async validateEmailsNotInOtherTeamsInTransaction(connection: any, emails: string[]): Promise<void> {
    const query = `
      SELECT COUNT(*) as count 
      FROM equipos_concurso 
      WHERE estado_registro IN ('pendiente', 'confirmado')
        AND (
          email_capitan IN (${emails.map(() => '?').join(',')}) OR
          email_miembro_1 IN (${emails.map(() => '?').join(',')}) OR
          email_miembro_2 IN (${emails.map(() => '?').join(',')}) OR
          email_miembro_3 IN (${emails.map(() => '?').join(',')}) OR
          email_miembro_4 IN (${emails.map(() => '?').join(',')}) OR
          email_miembro_5 IN (${emails.map(() => '?').join(',')})
        )
    `;
    
    const params = Array(6).fill(emails).flat();
    const [rows] = await connection.execute(query, params);
    const result = (rows as any[])[0];
    
    if (result && result.count > 0) {
      throw new ValidationError('Uno o más correos ya están registrados en otro equipo');
    }
  }

  private async validateEmailsExist(emails: string[]): Promise<void> {
    const placeholders = emails.map(() => '?').join(',');
    const query = `SELECT COUNT(*) as count FROM participantes WHERE email IN (${placeholders})`;
    
    const result = await executeQuerySingle<{ count: number }>(query, emails);
    
    if (result?.count !== emails.length) {
      throw new ValidationError('Todos los correos deben existir como participantes registrados');
    }
  }

  private async validateEmailsNotInOtherTeams(emails: string[]): Promise<void> {
    const query = `
      SELECT COUNT(*) as count 
      FROM equipos_concurso 
      WHERE estado_registro IN ('pendiente', 'confirmado')
        AND (
          email_capitan IN (${emails.map(() => '?').join(',')}) OR
          email_miembro_1 IN (${emails.map(() => '?').join(',')}) OR
          email_miembro_2 IN (${emails.map(() => '?').join(',')}) OR
          email_miembro_3 IN (${emails.map(() => '?').join(',')}) OR
          email_miembro_4 IN (${emails.map(() => '?').join(',')}) OR
          email_miembro_5 IN (${emails.map(() => '?').join(',')})
        )
    `;
    
    const params = Array(6).fill(emails).flat();
    const result = await executeQuerySingle<{ count: number }>(query, params);
    
    if (result && result.count > 0) {
      throw new ValidationError('Uno o más correos ya están registrados en otro equipo');
    }
  }

  private validateEquipoData(data: EquipoConcursoCreateDTO): void {
    if (!data.estado_id) {
      throw new ValidationError('Estado es requerido');
    }

    const emails = [
      data.email_capitan,
      data.email_miembro_1,
      data.email_miembro_2,
      data.email_miembro_3,
      data.email_miembro_4,
      data.email_miembro_5
    ];

    // Validar que el capitán es requerido
    if (!data.email_capitan?.trim()) {
      throw new ValidationError('Email del capitán es requerido');
    }

    // Validar emails (solo los que no están vacíos)
    emails.forEach((email, index) => {
      if (email && email.trim()) {
        if (!isValidEmail(email)) {
          throw new ValidationError(`Email ${index === 0 ? 'del capitán' : `del miembro ${index}`} inválido`);
        }
      }
    });

    // Verificar que no hay emails duplicados (solo entre los emails válidos)
    const validEmails = emails.filter(e => e && e.trim()).map(e => e.toLowerCase().trim());
    const uniqueEmails = new Set(validEmails);
    if (uniqueEmails.size !== validEmails.length) {
      throw new ValidationError('No puede haber correos duplicados en el equipo');
    }
  }

  async getEquiposStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_equipos,
        SUM(CASE WHEN estado_registro = 'pendiente' THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN estado_registro = 'confirmado' THEN 1 ELSE 0 END) as confirmados,
        SUM(CASE WHEN estado_registro = 'cancelado' THEN 1 ELSE 0 END) as cancelados,
        (SELECT COUNT(*) FROM estados_mexico WHERE disponible = FALSE) as estados_ocupados,
        (SELECT COUNT(*) FROM estados_mexico WHERE disponible = TRUE) as estados_disponibles
      FROM equipos_concurso
    `;
    
    return executeQuerySingle(query);
  }

  async getEquiposByEstado(estadoId: number): Promise<any[]> {
    const query = `
      SELECT 
        e.*,
        est.nombre as estado_nombre,
        est.codigo as estado_codigo
      FROM equipos_concurso e
      JOIN estados_mexico est ON e.estado_id = est.id
      WHERE e.estado_id = ?
      ORDER BY e.fecha_registro DESC
    `;
    
    return executeQuery(query, [estadoId]);
  }

  async checkParticipanteExists(email: string): Promise<any | null> {
    if (!email || !isValidEmail(email)) {
      throw new ValidationError('Email inválido');
    }

    const query = `
      SELECT 
        id,
        primer_nombre,
        segundo_nombre,
        apellido_paterno,
        apellido_materno,
        email,
        categoria,
        programa
      FROM participantes 
      WHERE LOWER(email) = LOWER(?)
    `;
    
    return executeQuerySingle(query, [email]);
  }
}