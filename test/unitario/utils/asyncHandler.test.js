import { asyncHandler } from '../../../src/utils/asyncHandler.js';

describe('asyncHandler', () => {
  test('deve ser uma função', () => {
    expect(typeof asyncHandler).toBe('function');
  });

  test('deve retornar uma função', () => {
    const mockFn = () => {};
    const result = asyncHandler(mockFn);
    
    expect(typeof result).toBe('function');
  });

  test('deve executar função assíncrona com sucesso', async () => {
    let called = false;
    const mockFn = async (req, res) => { 
      called = true;
      return res;
    };
    const wrappedFn = asyncHandler(mockFn);
    const mockReq = {};
    const mockRes = { status: () => mockRes, json: () => mockRes };
    const mockNext = () => {};

    await wrappedFn(mockReq, mockRes, mockNext);

    expect(called).toBe(true);
  });

  test('deve chamar ResponseHelper em caso de erro', async () => {
    const mockFn = async () => { 
      throw new Error('Test error'); 
    };
    const wrappedFn = asyncHandler(mockFn);
    const mockReq = {};
    let errorCaptured = false;
    const mockRes = { 
      status: () => mockRes, 
      json: () => { errorCaptured = true; return mockRes; }
    };
    const mockNext = () => {};

    await wrappedFn(mockReq, mockRes, mockNext);

    expect(errorCaptured).toBe(true);
  });
});