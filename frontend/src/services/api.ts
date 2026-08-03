import axios from 'axios';

// Aponta direto para o PythonAnywhere se a variável da Vercel não existir
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://dce.pythonanywhere.com';

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache-busting seguro usando apenas a query string (?_v=timestamp)
// Isso impede o cache sem criar headers que quebram o CORS
api.interceptors.request.use((config) => {
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      _v: new Date().getTime(),
    };
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
