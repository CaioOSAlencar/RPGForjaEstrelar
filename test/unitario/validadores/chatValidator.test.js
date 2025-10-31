import { validateSendMessage, validateGetMessages } from '../../../src/validadores/chatValidator.js';

describe('chatValidator', () => {
  describe('validateSendMessage', () => {
    test('deve validar mensagem válida', () => {
      const data = { content: 'Hello world', campaignId: 1 };
      const result = validateSendMessage(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com conteúdo vazio', () => {
      const data = { content: '', campaignId: 1 };
      const result = validateSendMessage(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Conteúdo da mensagem é obrigatório');
    });

    test('deve falhar com mensagem muito longa', () => {
      const data = { content: 'A'.repeat(1001), campaignId: 1 };
      const result = validateSendMessage(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Mensagem deve ter no máximo 1000 caracteres');
    });

    test('deve falhar sem campaignId', () => {
      const data = { content: 'Hello' };
      const result = validateSendMessage(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID da campanha é obrigatório');
    });

    test('deve falhar com campaignId inválido', () => {
      const data = { content: 'Hello', campaignId: 'invalid' };
      const result = validateSendMessage(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID da campanha deve ser um número válido');
    });
  });

  describe('validateGetMessages', () => {
    test('deve validar parâmetros válidos', () => {
      const data = { campaignId: 1, limit: 50, offset: 0 };
      const result = validateGetMessages(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com limit inválido', () => {
      const data = { campaignId: 1, limit: 101 };
      const result = validateGetMessages(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Limite deve ser entre 1 e 100');
    });

    test('deve falhar com offset negativo', () => {
      const data = { campaignId: 1, offset: -1 };
      const result = validateGetMessages(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Offset deve ser maior ou igual a 0');
    });
  });
});