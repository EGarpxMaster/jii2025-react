import { Router, Request, Response } from 'express';
import { ConstanciaService } from '../services/constancias.service.js';
import { asyncHandler } from '../middleware/errors.js';
import { createApiResponse, createErrorResponse } from '../utils/helpers.js';

const router = Router();
const constanciaService = new ConstanciaService();

// GET /api/constancias/test-db - Endpoint temporal para verificar la base de datos
router.get('/test-db', asyncHandler(async (req: Request, res: Response) => {
  console.log('🧪 Probando conexión a base de datos...');
  
  try {
    const { executeQuery } = await import('../config/database.js');
    
    // Verificar que existen participantes
    const participantes = await executeQuery('SELECT COUNT(*) as total FROM participantes');
    console.log('📊 Total participantes:', participantes);
    
    // Verificar específicamente el email de Leslye
    const leslye = await executeQuery(
      'SELECT * FROM participantes WHERE email = ?', 
      ['lramirez@ucaribe.edu.mx']
    );
    console.log('👤 Datos de Leslye:', leslye);
    
    res.json({
      success: true,
      totalParticipantes: participantes[0],
      leslyeData: leslye[0] || null,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Error en test-db:', error);
    res.status(500).json({ error: error.message });
  }
}));

// GET /api/constancias/verificar?email=xxx - Verificar participante por email
router.get('/verificar', asyncHandler(async (req: Request, res: Response) => {
  console.log('🔍 Ruta /verificar llamada con query:', req.query);
  
  const { email } = req.query;
  
  if (!email || typeof email !== 'string') {
    console.log('❌ Email no válido:', email);
    return res.status(400).json(createErrorResponse('Email requerido'));
  }

  console.log('📧 Verificando email:', email);

  try {
    const resultado = await constanciaService.verificarParticipantePorEmail(email);
    console.log('✅ Resultado encontrado:', resultado);
    res.json(resultado); // Devolver directamente sin wrapper de API
  } catch (error: any) {
    console.log('❌ Error en verificación:', error.message, error.name);
    if (error.name === 'NotFoundError') {
      return res.status(404).json(createErrorResponse('Participante no encontrado'));
    }
    throw error;
  }
}));

// GET /api/constancias/elegibilidad/:participanteId - Verificar elegibilidad para constancia
router.get('/elegibilidad/:participanteId', asyncHandler(async (req: Request, res: Response) => {
  const participanteId = parseInt(req.params.participanteId);
  if (isNaN(participanteId)) {
    return res.status(400).json(createErrorResponse('ID de participante inválido'));
  }

  const elegibilidad = await constanciaService.verificarElegibilidad(participanteId);
  res.json(createApiResponse(elegibilidad));
}));

// GET /api/constancias/generar/:participanteId - Generar y descargar constancia PDF
router.get('/generar/:participanteId', asyncHandler(async (req: Request, res: Response) => {
  const participanteId = parseInt(req.params.participanteId);
  if (isNaN(participanteId)) {
    return res.status(400).json(createErrorResponse('ID de participante inválido'));
  }

  const pdfBuffer = await constanciaService.generarConstancia(participanteId);
  
  const fileName = `constancia_jii2025_${participanteId}_${Date.now()}.pdf`;
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Length', pdfBuffer.length.toString());
  
  res.send(pdfBuffer);
}));

// GET /api/constancias/generar-por-email?email=xxx - Generar constancia por email
router.get('/generar-por-email', asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.query;
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json(createErrorResponse('Email requerido'));
  }

  try {
    // Primero verificar el participante
    const verificacion = await constanciaService.verificarParticipantePorEmail(email);
    
    // Generar constancia usando el ID del participante
    const pdfBuffer = await constanciaService.generarConstancia(verificacion.participante.id);
    
    const fileName = `constancia_jii2025_${verificacion.participante.id}_${Date.now()}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    
    res.send(pdfBuffer);
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json(createErrorResponse('Participante no encontrado'));
    }
    if (error.name === 'BusinessLogicError') {
      return res.status(400).json(createErrorResponse(error.message));
    }
    throw error;
  }
}));

// GET /api/constancias/stats - Obtener estadísticas de constancias
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const stats = await constanciaService.getConstanciasStats();
  res.json(createApiResponse(stats));
}));

export { router as constanciasRoutes };