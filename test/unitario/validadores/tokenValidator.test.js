import { validateCreateToken, validateUpdateToken } from '../../../src/validadores/tokenValidator.js';

describe('tokenValidator', () => {
  describe('validateCreateToken', () => {
    test('deve validar token válido', () => {
      const data = { name: 'Goblin', sceneId: 1, x: 100, y: 100 };
      const result = validateCreateToken(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com nome vazio', () => {
      const data = { name: '', sceneId: 1, x: 100, y: 100 };
      const result = validateCreateToken(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome do token é obrigatório');
    });

    test('deve falhar sem sceneId', () => {
      const data = { name: 'Goblin', x: 100, y: 100 };
      const result = validateCreateToken(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID da cena é obrigatório');
    });
  });

  describe('validateUpdateToken', () => {
    test('deve validar atualização válida', () => {
      const data = { name: 'Updated Goblin', hp: 10, maxHp: 15 };
      const result = validateUpdateToken(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com HP negativo', () => {
      const data = { hp: -1 };
      const result = validateUpdateToken(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('HP deve ser um número positivo');
    });

    test('deve aceitar atualização parcial', () => {
      const data = { x: 100, y: 200 };
      const result = validateUpdateToken(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve validar rotação dentro do limite', () => {
      const data = { rotation: 180 };
      const result = validateUpdateToken(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});