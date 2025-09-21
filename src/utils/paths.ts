// Utility para manejar rutas de assets en GitHub Pages

/**
 * Genera la ruta correcta para assets (imágenes, archivos) 
 * dependiendo del entorno (desarrollo vs producción)
 */
export const getAssetPath = (path: string): string => {
  // Remover slash inicial si existe
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // En desarrollo, usar ruta relativa normal
  if (import.meta.env.DEV) {
    return `/${cleanPath}`;
  }
  
  // En producción, verificar si es para GitHub Pages o servidor propio
  const isGitHubPages = import.meta.env.VITE_DEPLOY_TARGET === 'github';
  const basename = isGitHubPages ? '/jii2025-react' : '';
  return `${basename}/${cleanPath}`;
};

/**
 * Genera la ruta correcta para imágenes en la carpeta public/assets/images
 */
export const getImagePath = (imageName: string): string => {
  return getAssetPath(`assets/images/${imageName}`);
};

/**
 * Genera la ruta correcta para logos
 */
export const getLogoPath = (logoName: string): string => {
  return getAssetPath(`assets/images/${logoName}`);
};

/**
 * Genera la ruta correcta para imágenes de staff
 */
export const getStaffImagePath = (imageName: string): string => {
  return getAssetPath(`assets/images/staff/${imageName}`);
};

/**
 * Genera la ruta correcta para imágenes de aliados
 */
export const getAliadosImagePath = (imageName: string): string => {
  return getAssetPath(`assets/images/aliados/${imageName}`);
};

/**
 * Genera la ruta correcta para imágenes de actividades
 */
export const getActividadesImagePath = (imageName: string): string => {
  return getAssetPath(`assets/images/actividades/${imageName}`);
};

/**
 * Genera la ruta correcta para imágenes del carousel
 */
export const getCarouselImagePath = (imageName: string): string => {
  return getAssetPath(`assets/images/carousel/${imageName}`);
};

/**
 * Genera la ruta correcta para imágenes del concurso
 */
export const getConcursoImagePath = (imageName: string): string => {
  return getAssetPath(`assets/images/concurso/${imageName}`);
};

/**
 * Genera la ruta correcta para cualquier archivo en public
 */
export const getPublicPath = (filePath: string): string => {
  return getAssetPath(filePath);
};

// Export por defecto del helper principal
export default getAssetPath;