import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { pool } from '../db/pool.js';
import { fail } from '../utils/reply.js';

export const constancias = Router();

/** GET /api/constancias/general?email=...  (>=2 presentes en C/F/W) */
constancias.get('/general', async (req, res, next) => {
  try {
    const email = String(req.query.email || '').toLowerCase();
    if (!email) return res.status(400).json(fail('Email requerido'));
    const [pRows] = await pool.query("SELECT * FROM participantes WHERE email = ?", [email]);
    if (!(pRows as any[]).length) return res.status(404).json(fail('Participante no encontrado'));
    const p = (pRows as any[])[0];

    const [aRows] = await pool.query(`
      SELECT COUNT(*) AS c
      FROM asistencias s
      INNER JOIN actividades a ON a.id = s.actividad_id
      WHERE s.participante_id = ? AND s.estado='presente'
    `, [p.id]);
    const total = Number((aRows as any[])[0]?.c ?? 0);
    if (total < 2) return res.status(403).json(fail('No cumple con el mínimo de asistencias (2)', 'REQUISITOS_INSUFICIENTES'));

    const nombre = `${p.primer_nombre} ${p.segundo_nombre ?? ''} ${p.apellido_paterno} ${p.apellido_materno}`.replace(/\s+/g,' ').trim();
    const filename = `Constancia_Gral_${nombre.replace(/[^A-Za-z0-9]/g,'')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.fontSize(20).text('CONSTANCIA DE PARTICIPACIÓN', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Se otorga la presente constancia a:`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(18).text(nombre, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Por su participación en la Jornada Académica.`, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(10).text(`Emitida automáticamente.`, { align: 'center' });
    doc.end();
    doc.pipe(res);
  } catch (err) { next(err); }
});

/** GET /api/constancias/workshop?email=...&actividadId=... (presente en ese workshop) */
constancias.get('/workshop', async (req, res, next) => {
  try {
    const email = String(req.query.email || '').toLowerCase();
    const actividadId = Number(req.query.actividadId || 0);
    if (!email || !actividadId) return res.status(400).json(fail('Parámetros inválidos'));

    const [pRows] = await pool.query("SELECT * FROM participantes WHERE email = ?", [email]);
    if (!(pRows as any[]).length) return res.status(404).json(fail('Participante no encontrado'));
    const p = (pRows as any[])[0];

    const [aRows] = await pool.query(`
      SELECT a.titulo
      FROM asistencias s
      INNER JOIN actividades a ON a.id = s.actividad_id
      WHERE s.participante_id = ? AND s.actividad_id = ? AND s.estado='presente' AND a.tipo_evento='Workshop'
      LIMIT 1
    `, [p.id, actividadId]);
    if (!(aRows as any[]).length) return res.status(403).json(fail('No cumple con asistencia al workshop', 'WS_SIN_ASISTENCIA'));

    const titulo: string = (aRows as any[])[0].titulo;
    const nombre = `${p.primer_nombre} ${p.segundo_nombre ?? ''} ${p.apellido_paterno} ${p.apellido_materno}`.replace(/\s+/g,' ').trim();
    const tipo = `Workshop_${titulo}`.replace(/[^A-Za-z0-9]/g,'');
    const filename = `Constancia_${tipo}_${nombre.replace(/[^A-Za-z0-9]/g,'')}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.fontSize(20).text('CONSTANCIA DE WORKSHOP', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Se otorga la presente constancia a:`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(18).text(nombre, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Por su participación en el workshop:`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).text(titulo, { align: 'center' });
    doc.moveDown(2);
    doc.fontSize(10).text(`Emitida automáticamente.`, { align: 'center' });
    doc.end();
    doc.pipe(res);
  } catch (err) { next(err); }
});
