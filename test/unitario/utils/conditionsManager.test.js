import { getAllConditions, getConditionById, validateConditions, processConditionsForDisplay } from '../../../src/utils/conditionsManager.js';

describe('conditionsManager', () => {
  describe('getAllConditions', () => {
    test('deve retornar lista de condições disponíveis', () => {
      const conditions = getAllConditions();
      
      expect(Array.isArray(conditions)).toBe(true);
      expect(conditions.length).toBeGreaterThan(0);
      expect(conditions[0]).toHaveProperty('id');
      expect(conditions[0]).toHaveProperty('name');
    });
  });

  describe('getConditionById', () => {
    test('deve encontrar condição por ID', () => {
      const condition = getConditionById('blinded');
      
      expect(condition).toBeDefined();
      expect(condition.id).toBe('blinded');
      expect(condition.name).toBe('Cego');
    });

    test('deve retornar undefined para ID inválido', () => {
      const condition = getConditionById('invalid');
      expect(condition).toBeUndefined();
    });
  });

  describe('validateConditions', () => {
    test('deve validar array de condições válidas', () => {
      const result = validateConditions(['blinded', 'poisoned']);
      expect(result.isValid).toBe(true);
    });

    test('deve rejeitar condição inválida', () => {
      const result = validateConditions(['invalid']);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('não é válida');
    });
  });

  describe('processConditionsForDisplay', () => {
    test('deve processar condições para exibição', () => {
      const conditions = ['blinded', 'poisoned'];
      const processed = processConditionsForDisplay(conditions);
      
      expect(Array.isArray(processed)).toBe(true);
      expect(processed.length).toBe(2);
      expect(processed[0]).toHaveProperty('icon');
      expect(processed[0]).toHaveProperty('color');
    });

    test('deve lidar com array vazio', () => {
      const processed = processConditionsForDisplay([]);
      expect(processed).toEqual([]);
    });
  });
});