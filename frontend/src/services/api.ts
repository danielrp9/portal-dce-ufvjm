import axios from 'axios';

// Detecta se estamos rodando no navegador (client-side) para usar URL relativa.
// Se estiver no build estático ou no servidor, mantém a URL absoluta como fallback.
const isClient = typeof window !== 'undefined';

const baseURL = isClient 
  ? '/api/' 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/');

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; 