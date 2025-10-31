import { messages, sendError, sendResponse } from '../../../src/utils/messages.js';

describe('messages', () => {
  test('deve ter códigos HTTP', () => {
    expect(messages.httpCodes[200]).toBeDefined();
    expect(messages.httpCodes[400]).toBeDefined();
    expect(messages.httpCodes[500]).toBeDefined();
  });

  test('deve ter mensagens de erro', () => {
    expect(messages.error.error).toBeDefined();
    expect(messages.error.serverError).toBeDefined();
  });

  test('deve ter funções de mensagem dinâmica', () => {
    expect(messages.auth.userNotFound(123)).toContain('123');
    expect(messages.auth.emailAlreadyExists('test@test.com')).toContain('test@test.com');
  });

  test('sendError deve funcionar com string', () => {
    let statusCalled = false;
    let jsonCalled = false;
    const mockRes = {
      status: (code) => { statusCalled = code; return mockRes; },
      json: (data) => { jsonCalled = true; }
    };
    
    sendError(mockRes, 400, 'Erro teste');
    
    expect(statusCalled).toBe(400);
    expect(jsonCalled).toBe(true);
  });

  test('sendResponse deve funcionar', () => {
    let statusCalled = false;
    let jsonCalled = false;
    const mockRes = {
      status: (code) => { statusCalled = code; return mockRes; },
      json: (data) => { jsonCalled = true; }
    };
    
    sendResponse(mockRes, 200, { data: [] });
    
    expect(statusCalled).toBe(200);
    expect(jsonCalled).toBe(true);
  });
});