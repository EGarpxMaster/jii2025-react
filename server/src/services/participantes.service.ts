import { executeQuery, executeQuerySingle, executeTransaction } from '../config/database.js';
import type { 
  Participante, 
  ParticipanteCompleto, 
  ParticipanteCreateDTO, 
  ParticipanteUpdateDTO 
} from '../types/database.js';
import { ValidationError, NotFoundError, BusinessLogicError } from '../middleware/errors.js';
import { isValidEmail, sanitizeString, createFullName } from '../utils/helpers.js';
import { isInRegistrationWindow } from '../utils/validation.js';

export class ParticipanteService {
  
  async getAllParticipantes(): Promise<ParticipanteCompleto[]> {
    const query = `
      SELECT 
        p.*,
        CONCAT(
          p.primer_nombre,
          CASE WHEN p.segundo_nombre IS NOT NULL THEN CONCAT(' ', p.segundo_nombre) ELSE '' END,
          ' ', p.apellido_paterno, ' ', p.apellido_materno
        ) AS nombre_completo
      FROM participantes p
      ORDER BY p.apellido_paterno, p.apellido_materno, p.primer_nombre
    `;
    
    return executeQuery<ParticipanteCompleto>(query);
  }

  async getParticipanteById(id: number): Promise<ParticipanteCompleto | null> {
    const query = `
      SELECT 
        p.*,
        CONCAT(
          p.primer_nombre,
          CASE WHEN p.segundo_nombre IS NOT NULL THEN CONCAT(' ', p.segundo_nombre) ELSE '' END,
          ' ', p.apellido_paterno, ' ', p.apellido_materno
        ) AS nombre_completo
      FROM participantes p
      WHERE p.id = ?
    `;
    
    return executeQuerySingle<ParticipanteCompleto>(query, [id]);
  }

  async getParticipanteByEmail(email: string): Promise<ParticipanteCompleto | null> {
    console.log('🔍 Buscando participante por email:', email);
    
    const query = `
      SELECT 
        p.*,
        CONCAT(
          p.primer_nombre,
          CASE WHEN p.segundo_nombre IS NOT NULL THEN CONCAT(' ', p.segundo_nombre) ELSE '' END,
          ' ', p.apellido_paterno, ' ', p.apellido_materno
        ) AS nombre_completo
      FROM participantes p
      WHERE LOWER(p.email) = LOWER(?)
    `;
    
    console.log('📋 Query ejecutada:', query);
    console.log('📋 Parámetros:', [email]);
    
    const resultado = await executeQuerySingle<ParticipanteCompleto>(query, [email]);
    console.log('📊 Resultado de la consulta:', resultado);
    
    return resultado;
  }

  async createParticipante(data: ParticipanteCreateDTO): Promise<Participante> {
    // Validar ventana de inscripción
    const inWindow = await isInRegistrationWindow();
    if (!inWindow) {
      throw new BusinessLogicError('El período de inscripción ha finalizado o aún no ha comenzado');
    }

    // Validaciones básicas
    this.validateParticipanteData(data);

    // Verificar email único
    const existingParticipante = await this.getParticipanteByEmail(data.email);
    if (existingParticipante) {
      throw new ValidationError('El email ya está registrado');
    }

    // Verificar brazalete único si se proporciona
    if (data.brazalete) {
      const existingBrazalete = await this.getParticipanteByBrazalete(data.brazalete);
      if (existingBrazalete) {
        throw new ValidationError('El número de brazalete ya está asignado');
      }
    }

    const query = `
      INSERT INTO participantes (
        apellido_paterno, apellido_materno, primer_nombre, segundo_nombre,
        email, telefono, categoria, programa, brazalete
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      sanitizeString(data.apellido_paterno),
      sanitizeString(data.apellido_materno),
      sanitizeString(data.primer_nombre),
      data.segundo_nombre ? sanitizeString(data.segundo_nombre) : null,
      data.email.toLowerCase().trim(),
      data.telefono ? sanitizeString(data.telefono) : null,
      data.categoria,
      data.programa || null,
      data.brazalete || null
    ];

    return executeTransaction(async (connection) => {
      const [result] = await connection.execute(query, params);
      const insertId = (result as any).insertId;
      
      // Buscar el participante recién creado usando la misma conexión de la transacción
      const selectQuery = `
        SELECT 
          p.*,
          CONCAT(
            p.primer_nombre,
            CASE WHEN p.segundo_nombre IS NOT NULL THEN CONCAT(' ', p.segundo_nombre) ELSE '' END,
            ' ', p.apellido_paterno, ' ', p.apellido_materno
          ) AS nombre_completo
        FROM participantes p
        WHERE p.id = ?
      `;
      
      const [rows] = await connection.execute(selectQuery, [insertId]);
      const newParticipante = (rows as any[])[0];
      
      if (!newParticipante) {
        throw new Error('Error al recuperar el participante creado');
      }
      
      return newParticipante;
    });
  }

  async updateParticipante(id: number, data: ParticipanteUpdateDTO): Promise<Participante> {
    const existingParticipante = await this.getParticipanteById(id);
    if (!existingParticipante) {
      throw new NotFoundError('Participante no encontrado');
    }

    // Validar brazalete único si se está actualizando
    if (data.brazalete && data.brazalete !== existingParticipante.brazalete) {
      const existingBrazalete = await this.getParticipanteByBrazalete(data.brazalete);
      if (existingBrazalete) {
        throw new ValidationError('El número de brazalete ya está asignado');
      }
    }

    const updateFields: string[] = [];
    const params: any[] = [];

    if (data.apellido_paterno !== undefined) {
      updateFields.push('apellido_paterno = ?');
      params.push(sanitizeString(data.apellido_paterno));
    }
    if (data.apellido_materno !== undefined) {
      updateFields.push('apellido_materno = ?');
      params.push(sanitizeString(data.apellido_materno));
    }
    if (data.primer_nombre !== undefined) {
      updateFields.push('primer_nombre = ?');
      params.push(sanitizeString(data.primer_nombre));
    }
    if (data.segundo_nombre !== undefined) {
      updateFields.push('segundo_nombre = ?');
      params.push(data.segundo_nombre ? sanitizeString(data.segundo_nombre) : null);
    }
    if (data.telefono !== undefined) {
      updateFields.push('telefono = ?');
      params.push(data.telefono ? sanitizeString(data.telefono) : null);
    }
    if (data.categoria !== undefined) {
      updateFields.push('categoria = ?');
      params.push(data.categoria);
    }
    if (data.programa !== undefined) {
      updateFields.push('programa = ?');
      params.push(data.programa || null);
    }
    if (data.brazalete !== undefined) {
      updateFields.push('brazalete = ?');
      params.push(data.brazalete || null);
    }

    if (updateFields.length === 0) {
      return existingParticipante;
    }

    updateFields.push('actualizado = NOW()');
    params.push(id);

    const query = `
      UPDATE participantes 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    return executeTransaction(async (connection) => {
      await connection.execute(query, params);
      
      const updatedParticipante = await this.getParticipanteById(id);
      if (!updatedParticipante) {
        throw new Error('Error al recuperar el participante actualizado');
      }
      
      return updatedParticipante;
    });
  }

  async asignarBrazalete(email: string, brazalete: number): Promise<Participante> {
    // Buscar participante por email
    const participante = await this.getParticipanteByEmail(email);
    if (!participante) {
      throw new NotFoundError('Participante no encontrado');
    }

    // Verificar que el brazalete no esté en uso
    const existingBrazalete = await this.getParticipanteByBrazalete(brazalete);
    if (existingBrazalete && existingBrazalete.id !== participante.id) {
      throw new ValidationError('El número de brazalete ya está asignado');
    }

    // Actualizar el brazalete
    return this.updateParticipante(participante.id, { brazalete });
  }

  async deleteParticipante(id: number): Promise<boolean> {
    const existingParticipante = await this.getParticipanteById(id);
    if (!existingParticipante) {
      throw new NotFoundError('Participante no encontrado');
    }

    const query = 'DELETE FROM participantes WHERE id = ?';
    
    return executeTransaction(async (connection) => {
      const [result] = await connection.execute(query, [id]);
      return (result as any).affectedRows > 0;
    });
  }

  private async getParticipanteByBrazalete(brazalete: number): Promise<Participante | null> {
    const query = 'SELECT * FROM participantes WHERE brazalete = ?';
    return executeQuerySingle<Participante>(query, [brazalete]);
  }

  private validateParticipanteData(data: ParticipanteCreateDTO): void {
    if (!data.apellido_paterno?.trim()) {
      throw new ValidationError('Apellido paterno es requerido');
    }
    if (!data.apellido_materno?.trim()) {
      throw new ValidationError('Apellido materno es requerido');
    }
    if (!data.primer_nombre?.trim()) {
      throw new ValidationError('Primer nombre es requerido');
    }
    if (!data.email?.trim()) {
      throw new ValidationError('Email es requerido');
    }
    if (!isValidEmail(data.email)) {
      throw new ValidationError('Email inválido');
    }
    if (!data.categoria) {
      throw new ValidationError('Categoría es requerida');
    }
    if (data.brazalete && (data.brazalete < 1 || data.brazalete > 500)) {
      throw new ValidationError('El brazalete debe estar entre 1 y 500');
    }
  }

  async getParticipantesStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN categoria = 'Estudiante' THEN 1 ELSE 0 END) as estudiantes,
        SUM(CASE WHEN categoria = 'Docente' THEN 1 ELSE 0 END) as docentes,
        SUM(CASE WHEN categoria = 'Staff' THEN 1 ELSE 0 END) as staff,
        SUM(CASE WHEN categoria = 'Ponente' THEN 1 ELSE 0 END) as ponentes,
        SUM(CASE WHEN categoria = 'Asistente Externo' THEN 1 ELSE 0 END) as externos,
        SUM(CASE WHEN brazalete IS NOT NULL THEN 1 ELSE 0 END) as con_brazalete
      FROM participantes
    `;
    
    return executeQuerySingle(query);
  }
}