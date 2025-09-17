import { Router } from 'express';
import { pool } from '../db/pool.js';
import { ok } from '../utils/reply.js';

export const actividades = Router();

/** GET /api/actividades?tipo=Workshop&activa=true
 *  GET /api/actividades?ventana=ahora
 */
actividades.get('/', async (req, res, next) => {
  try {
    const { tipo, activa, ventana } = req.query as any;

    if (ventana === 'ahora') {
      // Actividades donde NOW() está entre (inicio-15m, inicio+30m) en TZ Cancún
      const [rows] = await pool.query(`
        SELECT a.*
        FROM actividades a
        WHERE a.activo = 1
        AND TIMESTAMPDIFF(
            MINUTE,
            a.fecha_inicio,
            CONVERT_TZ(UTC_TIMESTAMP(), '+00:00', '-05:00')
        ) BETWEEN -15 AND 30
        ORDER BY a.fecha_inicio ASC
      `);
      const mapped = (rows as any[]).map(r => ({
        id: r.id,
        titulo: r.titulo,
        tipo: r.tipo_evento,
        fechaInicio: r.fecha_inicio,
        fechaFin: r.fecha_fin,
        lugar: r.lugar
      }));
      return res.json(mapped);
    }

    if (ventana === 'disponibles') {
      const { email } = req.query as any;
      // Actividades disponibles para asistencia (del 25 al 27 de septiembre)
      let baseQuery = `
        SELECT a.*, 
               CASE 
                 WHEN a.tipo_evento IN ('Conferencia','Foro') THEN (
                   SELECT COUNT(*) FROM asistencias ast 
                   WHERE ast.actividad_id = a.id AND ast.estado = 'presente'
                 )
                 WHEN a.tipo_evento = 'Workshop' THEN (
                   SELECT COUNT(*) FROM inscripciones_workshop iw 
                   WHERE iw.actividad_id = a.id AND iw.estado = 'inscrito'
                 )
                 ELSE 0
               END AS ocupados
        FROM actividades a
        WHERE a.activo = 1
        AND a.fecha_inicio >= '2025-09-25 00:00:00'
        AND a.fecha_inicio <= '2025-09-27 23:59:59'`;

      // Si se proporciona email, filtrar workshops solo para los que está inscrito o en espera
      if (email) {
        baseQuery += `
        AND (
          a.tipo_evento IN ('Conferencia', 'Foro')
          OR (
            a.tipo_evento = 'Workshop' 
            AND EXISTS (
              SELECT 1 FROM inscripciones_workshop iw 
              JOIN participantes p ON p.id = iw.participante_id 
              WHERE iw.actividad_id = a.id 
              AND p.email = ?
              AND iw.estado IN ('inscrito', 'espera')
            )
          )
        )`;
      }

      baseQuery += ` ORDER BY a.fecha_inicio ASC`;

      const params = email ? [email.toLowerCase()] : [];
      const [rows] = await pool.query(baseQuery, params);
      
      const mapped = (rows as any[]).map(r => {
        const ocupados = Number(r.ocupados || 0);
        const disponibles = Math.max(0, r.cupo_maximo - ocupados);
        let estadoCupo = 'DISPONIBLE';
        if (disponibles <= 0) {
          estadoCupo = 'LLENO';
        } else if (disponibles <= Math.ceil(r.cupo_maximo * 0.2)) {
          estadoCupo = 'CASI_LLENO';
        }
        
        return {
          id: r.id,
          titulo: r.titulo,
          ponente: r.ponente_id, // Necesitamos obtener el nombre del ponente
          tipo: r.tipo_evento,
          fechaInicio: r.fecha_inicio,
          fechaFin: r.fecha_fin,
          lugar: r.lugar,
          cupoMaximo: r.cupo_maximo,
          ocupados,
          disponibles,
          estadoCupo
        };
      });
      return res.json(mapped);
    }

    if (ventana === 'workshops') {
      // Vista completa de workshops para la sección de workshops (sin filtrar por inscripción)
      const [rows] = await pool.query(`
        SELECT a.*, 
               (SELECT COUNT(*) FROM inscripciones_workshop iw 
                WHERE iw.actividad_id = a.id AND iw.estado = 'inscrito') AS ocupados
        FROM actividades a
        WHERE a.activo = 1
        AND a.tipo_evento = 'Workshop'
        AND a.fecha_inicio >= '2025-09-25 00:00:00'
        AND a.fecha_inicio <= '2025-09-27 23:59:59'
        ORDER BY a.fecha_inicio ASC
      `);
      const mapped = (rows as any[]).map(r => {
        const ocupados = Number(r.ocupados || 0);
        const disponibles = Math.max(0, r.cupo_maximo - ocupados);
        let estadoCupo = 'DISPONIBLE';
        if (disponibles <= 0) {
          estadoCupo = 'LLENO';
        } else if (disponibles <= Math.ceil(r.cupo_maximo * 0.2)) {
          estadoCupo = 'CASI_LLENO';
        }
        
        return {
          id: r.id,
          titulo: r.titulo,
          ponente: r.ponente_id,
          tipo: r.tipo_evento,
          fechaInicio: r.fecha_inicio,
          fechaFin: r.fecha_fin,
          lugar: r.lugar,
          cupoMaximo: r.cupo_maximo,
          ocupados,
          disponibles,
          estadoCupo
        };
      });
      return res.json(mapped);
    }

    // Ventana de inscripción para workshops: 22 septiembre 9:00 a 23 septiembre 23:59
    // Pero los workshops se realizan del 25-27 septiembre
    const eventInicio = '2025-09-25 00:00:00';
    const eventFin = '2025-09-27 23:59:59';

    // Filtro general (workshops list)
    let sql = `
      SELECT a.*
      FROM actividades a
      WHERE a.activo = 1
      AND a.tipo_evento = 'Workshop'
      AND a.fecha_inicio >= ? 
      AND a.fecha_inicio <= ? 
      ORDER BY a.fecha_inicio ASC
    `;
    const params = [eventInicio, eventFin];

    const [rows] = await pool.query(sql, params);

    const ids = (rows as any[]).map(r => r.id);
    let inscritosMap: Record<number, number> = {};
    if (ids.length) {
      const [insRows] = await pool.query(`
        SELECT actividad_id, COUNT(*) c
        FROM inscripciones_workshop
        WHERE actividad_id IN (${ids.map(() => '?').join(',')}) AND estado='inscrito'
        GROUP BY actividad_id
      `, ids);
      inscritosMap = Object.fromEntries((insRows as any[]).map(r => [r.actividad_id, Number(r.c)]));
    }

    const mapped = (rows as any[]).map(r => {
      const inscritos = inscritosMap[r.id] || 0;
      const disponibles = Math.max(0, r.cupo_maximo - inscritos);
      let estadoCupo = 'DISPONIBLE';
      if (disponibles <= 0) {
        estadoCupo = 'LLENO';
      } else if (disponibles <= Math.ceil(r.cupo_maximo * 0.2)) {
        estadoCupo = 'CASI_LLENO';
      }
      
      return {
        id: r.id,
        titulo: r.titulo,
        ponente: r.ponente_id,
        tipo: r.tipo_evento,
        fechaInicio: r.fecha_inicio,
        fechaFin: r.fecha_fin,
        lugar: r.lugar,
        cupoMaximo: r.cupo_maximo,
        ocupados: inscritos,
        disponibles,
        estadoCupo
      };
    });

    res.json(mapped);
  } catch (err) { next(err); }
});
