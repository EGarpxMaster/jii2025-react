import type { ApiResponse } from '../types/database.js';

// Función para crear respuestas consistentes de la API
export function createApiResponse<T>(
  data?: T,
  message?: string,
  ok: boolean = true
): ApiResponse<T> {
  const response: ApiResponse<T> = { ok };
  
  if (data !== undefined) {
    response.data = data;
  }
  
  if (message) {
    response.message = message;
  }
  
  return response;
}

// Función para crear respuestas de error
export function createErrorResponse(
  error: string,
  code?: string
): ApiResponse {
  return {
    ok: false,
    error,
    code
  };
}

// Función para validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

// Función para validar formato de fecha ISO
export function isValidISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString.includes('T');
}

// Función para convertir Date a string MySQL
export function dateToMySQLString(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Función para crear nombre completo
export function createFullName(
  firstName: string,
  secondName: string | null | undefined,
  paternalSurname: string,
  maternalSurname: string
): string {
  const names = [firstName];
  if (secondName) {
    names.push(secondName);
  }
  names.push(paternalSurname, maternalSurname);
  return names.join(' ');
}

// Función para sanitizar strings
export function sanitizeString(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

// Función para generar código único
export function generateCode(prefix: string, id: number): string {
  return `${prefix}${id.toString().padStart(3, '0')}`;
}

// Función para validar rango de números
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}