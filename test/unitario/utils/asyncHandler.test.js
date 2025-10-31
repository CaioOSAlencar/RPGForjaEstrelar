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

  test('deve executar função sem erro', async () => {
    let called = false;
    const mockFn = async () => { called = true; };
    const wrappedFn = asyncHandler(mockFn);
    const mockNext = () => {};

    await wrappedFn({}, {}, mockNext);

    expect(called).toBe(true);
  });

  test('deve capturar erro', async () => {
    const error = new Error('Test error');
    const mockFn = async () => { throw error; };
    const wrappedFn = asyncHandler(mockFn);
    let capturedError = null;
    const mockNext = (err) => { capturedError = err; };

    await wrappedFn({}, {}, mockNext);

    expect(capturedError).toBe(error);
  });
});