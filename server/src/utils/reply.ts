export const ok = <T>(data: T) => ({ ok: true, data });
export const fail = (error: string, code?: string, field?: string, details?: any[]) =>
  ({ ok: false, error, code, field, details });
