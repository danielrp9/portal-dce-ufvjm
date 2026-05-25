import axios from 'axios';

// Utiliza a variável de ambiente do Next.js ou adota o fallback do localhost
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/';

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;