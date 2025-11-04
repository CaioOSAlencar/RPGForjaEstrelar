import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://rpgforjaestrelar.onrender.com/api'
  : 'http://localhost:3000/api';

console.log('🌐 Ambiente:', process.env.NODE_ENV);
console.log('🔗 API URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 segundos
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
    console.error('❌ Erro na API:', error.message);
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
    
    if (error.code === 'ECONNABORTED') {
      alert('⏰ Timeout: Servidor demorou para responder. Tente novamente.');
    } else if (!error.response) {
      alert('🔌 Erro de conexão: Verifique sua internet ou tente mais tarde.');
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status >= 500) {
      alert('🚨 Erro no servidor. Tente novamente em alguns minutos.');
    }
    
    return Promise.reject(error);
  }
);