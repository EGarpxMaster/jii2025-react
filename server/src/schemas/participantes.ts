import { z } from 'zod';

export const participanteCreateSchema = z.object({
  apellidoPaterno: z.string().min(1),
  apellidoMaterno: z.string().min(1),
  primerNombre: z.string().min(1),
  segundoNombre: z.string().optional().nullable(),
  email: z.string().email(),
  telefono: z.string().regex(/^\d{10}$/, 'Deben ser 10 dígitos').optional().or(z.literal('')),
  categoria: z.enum(['Estudiante','Ponente','Asistente externo']),
  programa: z.enum([
    'Ingeniería Industrial',
    'Ingeniería Ambiental',
    'Ingeniería en Datos e Inteligencia Organizacional',
    'Ingeniería en Logística y Cadena de Suministro',
    'Ingeniería en Inteligencia Artificial',
    'Ingeniería en Industrias Alimentarias'
  ]).optional()
}).refine((d) => d.categoria !== 'Estudiante' || !!d.programa, {
  message: 'Selecciona un programa',
  path: ['programa']
});

export const asignarBrazaleteSchema = z.object({
  email: z.string().email(),
  brazalete: z.number().int().min(1).max(500)
});
