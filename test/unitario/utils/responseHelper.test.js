import { ResponseHelper } from '../../../src/utils/responseHelper.js';

describe('ResponseHelper', () => {
  test('deve ter método success', () => {
    expect(typeof ResponseHelper.success).toBe('function');
  });

  test('deve ter método created', () => {
    expect(typeof ResponseHelper.created).toBe('function');
  });

  test('deve ter método noContent', () => {
    expect(typeof ResponseHelper.noContent).toBe('function');
  });

  test('deve ter método error', () => {
    expect(typeof ResponseHelper.error).toBe('function');
  });

  test('deve executar success sem erro', () => {
    const mockRes = {
      status: () => mockRes,
      json: () => {}
    };
    
    expect(() => ResponseHelper.success(mockRes, {}, 'Sucesso')).not.toThrow();
  });
});