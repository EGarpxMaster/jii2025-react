import { executeQuerySingle } from '../config/database.js';

// Funciones para obtener configuraciones del sistema
export async function getSystemConfig(key: string): Promise<string | null> {
  try {
    const result = await executeQuerySingle<{ valor: string }>(
      'SELECT valor FROM configuracion_sistema WHERE clave = ?',
      [key]
    );
    return result?.valor || null;
  } catch (error) {
    console.error(`Error obteniendo configuración ${key}:`, error);
    return null;
  }
}

export async function getSystemConfigAsNumber(key: string): Promise<number | null> {
  const value = await getSystemConfig(key);
  if (value === null) return null;
  const num = parseInt(value);
  return isNaN(num) ? null : num;
}

export async function getSystemConfigAsDate(key: string): Promise<Date | null> {
  const value = await getSystemConfig(key);
  if (value === null) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

// Funciones de validación de ventanas de tiempo

export async function isInRegistrationWindow(): Promise<boolean> {
  try {
    const result = await executeQuerySingle<{ result: number }>(
      'SELECT fn_en_ventana_registro() as result'
    );
    return result?.result === 1;
  } catch (error) {
    console.error('Error verificando ventana de registro:', error);
    return false;
  }
}

export async function isInWorkshopWindow(): Promise<boolean> {
  try {
    const result = await executeQuerySingle<{ result: number }>(
      'SELECT fn_en_ventana_workshop() as result'
    );
    return result?.result === 1;
  } catch (error) {
    console.error('Error verificando ventana de workshop:', error);
    return false;
  }
}

export async function isInContestWindow(): Promise<boolean> {
  try {
    const result = await executeQuerySingle<{ result: number }>(
      'SELECT fn_en_ventana_concurso() as result'
    );
    return result?.result === 1;
  } catch (error) {
    console.error('Error verificando ventana de concurso:', error);
    return false;
  }
}

export async function isInAttendanceWindow(startDate: Date): Promise<boolean> {
  try {
    const result = await executeQuerySingle<{ result: number }>(
      'SELECT fn_en_ventana_marcaje(?) as result',
      [startDate]
    );
    return result?.result === 1;
  } catch (error) {
    console.error('Error verificando ventana de marcaje:', error);
    return false;
  }
}