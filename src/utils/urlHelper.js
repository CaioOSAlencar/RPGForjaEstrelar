/**
 * Utilitário para gerar URLs do frontend de forma dinâmica
 */

/**
 * Obtém a URL base do frontend baseada no ambiente
 * @returns {string} URL base do frontend
 */
export const getFrontendBaseUrl = () => {
  // Detectar automaticamente baseado no ambiente
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // Em produção, usar a URL definida ou padrão
    return process.env.FRONTEND_PRODUCTION_URL || process.env.FRONTEND_URL || 'https://rpg-forja-estrelar.netlify.app';
  } else {
    // Em desenvolvimento, priorizar variáveis específicas
    return process.env.FRONTEND_DEV_URL || process.env.FRONTEND_URL || 'http://localhost:3001';
  }
};

/**
 * Detecta automaticamente a porta do frontend em desenvolvimento
 * Verifica portas comuns do Vite: 3001, 5173, 3000
 * @returns {Promise<string>} URL detectada ou padrão
 */
export const detectFrontendUrl = async () => {
  const commonPorts = [3001, 5173, 3000, 3100];
  const baseHost = 'http://localhost';
  
  // Se já tiver definido no .env, usar essa
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL;
  }
  
  // Em produção, não tentar detectar
  if (process.env.NODE_ENV === 'production') {
    return getFrontendBaseUrl();
  }
  
  // Tentar detectar qual porta está ativa (simplificado)
  // Por enquanto, usar a configuração padrão
  return getFrontendBaseUrl();
};

/**
 * Gera URL completa para convite por token
 * @param {string} token - Token do convite
 * @returns {string} URL completa do convite
 */
export const generateInviteUrl = (token) => {
  const baseUrl = getFrontendBaseUrl();
  return `${baseUrl}/invite/${token}`;
};

/**
 * Gera URL completa para entrar por código de sala
 * @param {string} roomCode - Código da sala
 * @returns {string} URL completa para entrar na campanha
 */
export const generateJoinUrl = (roomCode) => {
  const baseUrl = getFrontendBaseUrl();
  return `${baseUrl}/join/${roomCode}`;
};

/**
 * Log da configuração atual de URLs (para debug)
 */
export const logUrlConfig = () => {
  console.log('🔗 Configuração de URLs:');
  console.log('  NODE_ENV:', process.env.NODE_ENV);
  console.log('  FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('  FRONTEND_DEV_URL:', process.env.FRONTEND_DEV_URL);
  console.log('  FRONTEND_PRODUCTION_URL:', process.env.FRONTEND_PRODUCTION_URL);
  console.log('  URL Base Detectada:', getFrontendBaseUrl());
};

/**
 * Gera URL completa para qualquer rota do frontend
 * @param {string} path - Caminho da rota (ex: '/campaigns/123')
 * @returns {string} URL completa
 */
export const generateFrontendUrl = (path) => {
  const baseUrl = getFrontendBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};