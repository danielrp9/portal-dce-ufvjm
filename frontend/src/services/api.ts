import axios from 'axios';

// Como o build é 'export' (estático), o frontend roda de forma independente.
const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api/';

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// INTERCEPTOR DE CACHE-BUSTING EXTREMO:
api.interceptors.request.use((config) => {
  const timestamp = new Date().getTime();
  
  // 1. Adiciona timestamp na query string para bypassar proxies e browser
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _v: timestamp, 
    };
  }
  
  // 2. Adiciona headers customizados que quebram o cache de CDNs e navegadores modernos
  config.headers['X-Control-Cache'] = timestamp.toString();
  config.headers['If-Modified-Since'] = '0';
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
