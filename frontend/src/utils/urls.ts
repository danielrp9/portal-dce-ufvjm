const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Garantimos que o caminho comece com barra para ser relativo à raiz do domínio atual
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return normalizedPath;
}
