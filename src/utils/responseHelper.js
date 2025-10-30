import { sendResponse, sendError } from './messages.js';

export const ResponseHelper = {
  // Sucessos
  success: (res, data = [], message = null) => {
    return sendResponse(res, 200, { data, message });
  },

  created: (res, data = [], message = null) => {
    return sendResponse(res, 201, { data, message });
  },

  noContent: (res) => {
    return sendResponse(res, 204);
  },

  // Erros
  badRequest: (res, errors = [], message = null) => {
    return sendError(res, 400, errors);
  },

  unauthorized: (res, message = 'Token de acesso requerido') => {
    return sendError(res, 401, message);
  },

  forbidden: (res, message = 'Acesso negado') => {
    return sendError(res, 403, message);
  },

  notFound: (res, message = 'Recurso não encontrado') => {
    return sendError(res, 404, message);
  },

  conflict: (res, message = 'Conflito de dados') => {
    return sendError(res, 409, message);
  },

  internal: (res, message = 'Erro interno do servidor') => {
    return sendError(res, 500, message);
  }
};