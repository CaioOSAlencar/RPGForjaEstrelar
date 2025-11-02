import { ApiError } from '../../../src/utils/ApiError.js';

describe('ApiError', () => {
  test('deve criar erro badRequest', () => {
    const error = ApiError.badRequest('Dados inválidos');
    
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Dados inválidos');
  });

  test('deve criar erro unauthorized', () => {
    const error = ApiError.unauthorized('Não autorizado');
    
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe('Não autorizado');
  });

  test('deve criar erro notFound', () => {
    const error = ApiError.notFound('Não encontrado');
    
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Não encontrado');
  });

  test('deve criar erro conflict', () => {
    const error = ApiError.conflict('Conflito');
    
    expect(error.statusCode).toBe(409);
    expect(error.message).toBe('Conflito');
  });

  test('deve criar erro internal', () => {
    const error = ApiError.internal('Erro interno');
    
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Erro interno');
  });
});