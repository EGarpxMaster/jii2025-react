import PDFDocument from 'pdfkit';
import { executeQuerySingle } from '../config/database.js';
import { AsistenciaService } from './asistencias.service.js';
import { ParticipanteService } from './participantes.service.js';
import { ValidationError, NotFoundError, BusinessLogicError } from '../middleware/errors.js';
import { createFullName } from '../utils/helpers.js';
import fs from 'fs';
import path from 'path';

export class ConstanciaService {
  private asistenciaService: AsistenciaService;
  private participanteService: ParticipanteService;

  constructor() {
    this.asistenciaService = new AsistenciaService();
    this.participanteService = new ParticipanteService();
  }

  async generarConstancia(participanteId: number): Promise<Buffer> {
    // Verificar que el participante existe
    const participante = await this.participanteService.getParticipanteById(participanteId);
    if (!participante) {
      throw new NotFoundError('Participante no encontrado');
    }

    // Verificar elegibilidad (mínimo 2 asistencias)
    const elegibilidad = await this.asistenciaService.verificarElegibilidadConstancia(participanteId);
    if (!elegibilidad.elegible) {
      throw new BusinessLogicError(`Necesitas al menos 2 asistencias para generar la constancia. Tienes ${elegibilidad.asistencias}`);
    }

    // Obtener asistencias del participante
    const asistencias = await this.asistenciaService.getAsistenciasParaConstancia(participanteId);

    // Generar PDF
    return this.crearPDF(participante, asistencias);
  }

  private async crearPDF(participante: any, asistencias: any[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Configurar fuentes
        doc.font('Helvetica-Bold');

        // Encabezado
        doc.fontSize(20)
           .text('UNIVERSIDAD DEL CARIBE', { align: 'center' })
           .moveDown(0.5);

        doc.fontSize(16)
           .text('CONSTANCIA DE PARTICIPACIÓN', { align: 'center' })
           .moveDown(0.5);

        doc.fontSize(14)
           .text('JORNADA DE INGENIERÍA INDUSTRIAL 2025', { align: 'center' })
           .moveDown(2);

        // Cuerpo de la constancia
        doc.font('Helvetica')
           .fontSize(12)
           .text('Por medio de la presente se hace constar que:', { align: 'justify' })
           .moveDown(1);

        doc.font('Helvetica-Bold')
           .fontSize(14)
           .text(participante.nombre_completo.toUpperCase(), { align: 'center' })
           .moveDown(1);

        doc.font('Helvetica')
           .fontSize(12);

        // Texto personalizado según la categoría
        let textoParticipacion = '';
        switch (participante.categoria) {
          case 'Estudiante':
            textoParticipacion = 'participó como estudiante en las actividades de la';
            break;
          case 'Docente':
            textoParticipacion = 'participó como docente en las actividades de la';
            break;
          case 'Ponente':
            textoParticipacion = 'participó como ponente en la';
            break;
          case 'Staff':
            textoParticipacion = 'participó como personal de apoyo en la';
            break;
          default:
            textoParticipacion = 'participó en las actividades de la';
        }

        doc.text(`${textoParticipacion} Jornada de Ingeniería Industrial 2025, `, { continued: true })
           .text('realizada los días 25 y 26 de septiembre de 2025 en las instalaciones de la Universidad del Caribe, ')
           .text('habiendo asistido a las siguientes actividades:')
           .moveDown(1);

        // Lista de actividades
        asistencias.forEach((asistencia, index) => {
          const fecha = new Date(asistencia.fecha_inicio).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
          
          doc.text(`${index + 1}. ${asistencia.titulo}`, { indent: 20 })
             .text(`   Fecha: ${fecha}`, { indent: 30 })
             .text(`   Ponente: ${asistencia.ponente || 'No especificado'}`, { indent: 30 })
             .moveDown(0.5);
        });

        doc.moveDown(1);

        // Texto de cierre
        doc.text('Se extiende la presente constancia para los fines que al interesado convengan.')
           .moveDown(2);

        // Fecha y lugar
        const fechaActual = new Date().toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        doc.text(`Cancún, Quintana Roo, a ${fechaActual}`, { align: 'right' })
           .moveDown(3);

        // Firma (espacio)
        doc.text('_________________________________', { align: 'center' })
           .moveDown(0.5)
           .font('Helvetica-Bold')
           .text('COORDINACIÓN ACADÉMICA', { align: 'center' })
           .text('INGENIERÍA INDUSTRIAL', { align: 'center' })
           .moveDown(2);

        // Pie de página
        doc.font('Helvetica')
           .fontSize(10)
           .text('Universidad del Caribe | SM 78 Mza 1 Lote 1, Cancún, Q. Roo, México', { align: 'center' })
           .text('Tel: (998) 881 4400 | www.ucaribe.edu.mx', { align: 'center' });

        // Finalizar documento
        doc.end();

      } catch (error) {
        reject(error);
      }
    });
  }

  async verificarElegibilidad(participanteId: number): Promise<{ elegible: boolean, asistencias: number, mensaje: string }> {
    const participante = await this.participanteService.getParticipanteById(participanteId);
    if (!participante) {
      throw new NotFoundError('Participante no encontrado');
    }

    const elegibilidad = await this.asistenciaService.verificarElegibilidadConstancia(participanteId);
    
    let mensaje = '';
    if (elegibilidad.elegible) {
      mensaje = `Puedes generar tu constancia. Tienes ${elegibilidad.asistencias} asistencias registradas.`;
    } else {
      mensaje = `Necesitas al menos 2 asistencias para generar la constancia. Actualmente tienes ${elegibilidad.asistencias}.`;
    }

    return {
      elegible: elegibilidad.elegible,
      asistencias: elegibilidad.asistencias,
      mensaje
    };
  }

  async verificarParticipantePorEmail(email: string): Promise<any> {
    if (!email || typeof email !== 'string') {
      throw new ValidationError('Email requerido');
    }

    const participante = await this.participanteService.getParticipanteByEmail(email);
    if (!participante) {
      throw new NotFoundError('Participante no encontrado');
    }

    // Verificar elegibilidad para constancia
    const elegibilidad = await this.verificarElegibilidad(participante.id);
    
    // Obtener asistencias para constancia
    const asistencias = await this.asistenciaService.getAsistenciasParaConstancia(participante.id);
    
    return {
      participante: {
        id: participante.id,
        apellidoPaterno: participante.apellido_paterno,
        apellidoMaterno: participante.apellido_materno,
        primerNombre: participante.primer_nombre,
        segundoNombre: participante.segundo_nombre,
        email: participante.email,
        telefono: participante.telefono || '',
        categoria: participante.categoria,
        programa: participante.programa
      },
      asistencias: asistencias.map((asistencia: any) => ({
        titulo: asistencia.titulo,
        ponente: asistencia.ponente,
        fecha: asistencia.fecha_inicio,
        lugar: asistencia.lugar,
        fechaAsistencia: asistencia.fecha_asistencia
      })),
      puedeObtenerConstancia: elegibilidad.elegible
    };
  }

  async getConstanciasStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(DISTINCT a.participante_id) as participantes_con_asistencias,
        COUNT(DISTINCT CASE WHEN asistencias_count.total >= 2 THEN a.participante_id END) as elegibles_constancia,
        AVG(asistencias_count.total) as promedio_asistencias
      FROM asistencias a
      JOIN (
        SELECT 
          participante_id, 
          COUNT(*) as total 
        FROM asistencias 
        WHERE estado = 'presente' 
        GROUP BY participante_id
      ) asistencias_count ON a.participante_id = asistencias_count.participante_id
      WHERE a.estado = 'presente'
    `;
    
    return executeQuerySingle(query);
  }
}