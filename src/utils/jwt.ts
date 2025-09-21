// Utilidad para obtener el JWT del localStorage (o de cookies si lo prefieres)
export function getJWT() {
  return localStorage.getItem('token') || '';
}
