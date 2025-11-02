import axios from 'axios';

const API_BASE_URL = 'https://rpg-forja-estrelar.vercel.app/api';

console.log('🌐 Usando API da Vercel');
console.log('🔗 API URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token encontrado:', token ? 'Sim' : 'Não');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Fazendo requisição para:', config.url, 'com dados:', config.data);
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);