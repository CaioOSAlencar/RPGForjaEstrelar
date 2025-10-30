import { ResponseHelper } from './responseHelper.js';
import { ApiError } from './ApiError.js';

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error('Erro capturado:', error);
      
      // Se é um ApiError customizado
      if (error instanceof ApiError) {
        return ResponseHelper.badRequest(res, error.errors, error.message);
      }
      
      // Se é um erro de validação do Prisma
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        return ResponseHelper.badRequest(res, errors, 'Dados inválidos');
      }
      
      // Se é um erro de ObjectId inválido
      if (error.name === 'CastError') {
        return ResponseHelper.badRequest(res, [{ 
          field: error.path, 
          message: 'ID deve ser válido' 
        }]);
      }
      
      // Erro genérico
      return ResponseHelper.internal(res, 'Erro interno do servidor');
    });
  };
};