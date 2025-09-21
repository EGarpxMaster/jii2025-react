// Tipos base para las tablas de la base de datos

export type CategoriaParticipante = 
  | 'Estudiante' 
  | 'Docente' 
  | 'Staff' 
  | 'Ponente' 
  | 'Asistente Externo';

export type ProgramaIngenieria = 
  | 'Ingeniería Industrial'
  | 'Ingeniería Ambiental'
  | 'Ingeniería en Datos e Inteligencia Organizacional'
  | 'Ingeniería en Logística y Cadena de Suministro'
  | 'Ingeniería en Inteligencia Artificial'
  | 'Ingeniería en Industrias Alimentarias';

export type TipoActividad = 'Workshop' | 'Conferencia' | 'Foro';

export type EstadoInscripcion = 'inscrito' | 'lista_espera' | 'cancelado';

export type EstadoAsistencia = 'registrado' | 'presente' | 'ausente';

export type ModoAsistencia = 'self' | 'staff' | 'qr';

export type EstadoRegistroEquipo = 'pendiente' | 'confirmado' | 'cancelado';

export type RegionMexico = 'Norte' | 'Centro' | 'Sur' | 'Sureste';

export type TipoConfiguracion = 'fecha' | 'numero' | 'texto' | 'booleano';

// Interfaces para las tablas

export interface Participante {
  id: number;
  apellido_paterno: string;
  apellido_materno: string;
  primer_nombre: string;
  segundo_nombre?: string | null;
  email: string;
  telefono?: string | null;
  categoria: CategoriaParticipante;
  programa?: ProgramaIngenieria | null;
  brazalete?: number | null;
  creado: Date;
  actualizado: Date;
}

export interface Actividad {
  id: number;
  codigo?: string | null;
  titulo: string;
  ponente?: string | null;
  institucion?: string | null;
  bio_ponente?: string | null;
  descripcion?: string | null;
  imagen_ponente?: string | null;
  banner?: string | null;
  fecha_inicio: Date;
  fecha_fin: Date;
  lugar?: string | null;
  tipo: TipoActividad;
  cupo_maximo: number;
  activa: boolean;
  creado: Date;
  actualizado: Date;
}

export interface InscripcionWorkshop {
  id: number;
  participante_id: number;
  actividad_id: number;
  estado: EstadoInscripcion;
  creado: Date;
  actualizado: Date;
}

export interface Asistencia {
  id: number;
  participante_id: number;
  actividad_id: number;
  estado: EstadoAsistencia;
  modo_asistencia: ModoAsistencia;
  fecha_asistencia: Date;
  notas?: string | null;
}

export interface EstadoMexico {
  id: number;
  nombre: string;
  codigo: string;
  region: RegionMexico;
  disponible: boolean;
  creado: Date;
  actualizado: Date;
}

export interface EquipoConcurso {
  id: number;
  nombre_equipo: string;
  estado_id: number;
  email_capitan: string;
  email_miembro_1: string;
  email_miembro_2: string;
  email_miembro_3: string;
  email_miembro_4: string;
  email_miembro_5: string;
  estado_registro: EstadoRegistroEquipo;
  activo: boolean;
  activo_concurso: boolean;
  fecha_registro: Date;
  fecha_confirmacion?: Date | null;
  actualizado: Date;
}

export interface ConfiguracionSistema {
  id: number;
  clave: string;
  valor: string;
  descripcion?: string | null;
  tipo: TipoConfiguracion;
  creado: Date;
  actualizado: Date;
}

// Tipos para las vistas

export interface WorkshopStats {
  id: number;
  codigo?: string | null;
  titulo: string;
  ponente?: string | null;
  institucion?: string | null;
  bio_ponente?: string | null;
  descripcion?: string | null;
  imagen_ponente?: string | null;
  banner?: string | null;
  fecha_inicio: Date;
  fecha_fin: Date;
  lugar?: string | null;
  tipo: TipoActividad;
  cupo_maximo: number;
  inscritos: number;
  cupo_disponible: number;
  porcentaje_ocupado: number;
  porcentaje_disponible: number;
  umbral_verde: number;
  umbral_amarillo: number;
  color_cupo: 'green' | 'yellow' | 'red';
  estado_cupo: 'DISPONIBLE' | 'CASI_LLENO' | 'LLENO';
  activa: boolean;
}

export interface ParticipanteCompleto extends Participante {
  nombre_completo: string;
}

export interface AsistenciasStats {
  id: number;
  codigo?: string | null;
  titulo: string;
  tipo: TipoActividad;
  cupo_maximo: number;
  asistentes: number;
  cupo_disponible: number;
  porcentaje_asistencia: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  lugar?: string | null;
  ponente?: string | null;
  activa: boolean;
}

// DTOs para las APIs

export interface ParticipanteCreateDTO {
  apellido_paterno: string;
  apellido_materno: string;
  primer_nombre: string;
  segundo_nombre?: string;
  email: string;
  telefono?: string;
  categoria: CategoriaParticipante;
  programa?: ProgramaIngenieria;
  brazalete?: number;
}

export interface ParticipanteUpdateDTO {
  apellido_paterno?: string;
  apellido_materno?: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  telefono?: string;
  categoria?: CategoriaParticipante;
  programa?: ProgramaIngenieria;
  brazalete?: number;
}

export interface ActividadCreateDTO {
  codigo?: string;
  titulo: string;
  ponente?: string;
  institucion?: string;
  bio_ponente?: string;
  descripcion?: string;
  imagen_ponente?: string;
  banner?: string;
  fecha_inicio: string; // ISO string
  fecha_fin: string; // ISO string
  lugar?: string;
  tipo: TipoActividad;
  cupo_maximo: number;
}

export interface InscripcionWorkshopCreateDTO {
  participante_id: number;
  actividad_id: number;
}

export interface AsistenciaCreateDTO {
  participante_id: number;
  actividad_id: number;
  modo_asistencia?: ModoAsistencia;
  notas?: string;
}

export interface EquipoConcursoCreateDTO {
  nombre_equipo: string;
  estado_id: number;
  email_capitan: string;
  email_miembro_1: string;
  email_miembro_2: string;
  email_miembro_3: string;
  email_miembro_4: string;
  email_miembro_5: string;
}

// Tipos de respuesta de la API
export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}