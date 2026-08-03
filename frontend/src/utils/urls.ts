const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function getBaseBackendUrl(): string {
  if (!API_URL) return '';
  try {
    const url = new URL(API_URL, typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000');
    return url.origin;
  } catch {
    return API_URL.replace(/\/api\/?$/, '');
  }
}

export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return '';

  const backendOrigin = getBaseBackendUrl();

  if (path.startsWith('http://') || path.startsWith('https://')) {
    if (backendOrigin && (path.includes('localhost:8000') || path.includes('127.0.0.1:8000'))) {
      try {
        const urlObj = new URL(path);
        return `${backendOrigin}${urlObj.pathname}${urlObj.search}`;
      } catch {
        return path;
      }
    }
    return path;
  }
  
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  if (backendOrigin) {
    return `${backendOrigin}${normalizedPath}`;
  }
  
  return normalizedPath;
}

export function getAdminUrl(): string {
  const backendOrigin = getBaseBackendUrl();
  return backendOrigin ? `${backendOrigin}/admin/` : '/admin/';
}
