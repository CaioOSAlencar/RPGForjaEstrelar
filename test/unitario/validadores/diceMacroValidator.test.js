import { validateCreateMacro, validateUpdateMacro } from '../../../src/validadores/diceMacroValidator.js';

describe('diceMacroValidator', () => {
  describe('validateCreateMacro', () => {
    test('deve validar macro válido', () => {
      const data = { 
        name: 'Attack Roll',
        expression: '1d20+5',
        characterSheetId: 1
      };
      const result = validateCreateMacro(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com nome vazio', () => {
      const data = { name: '', expression: '1d20+5', characterSheetId: 1 };
      const result = validateCreateMacro(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome do macro é obrigatório');
    });

    test('deve falhar sem characterSheetId', () => {
      const data = { name: 'Attack', expression: '1d20+5' };
      const result = validateCreateMacro(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID da ficha é obrigatório');
    });
  });

  describe('validateUpdateMacro', () => {
    test('deve validar atualização válida', () => {
      const data = { 
        name: 'Updated Attack',
        expression: '1d20+6'
      };
      const result = validateUpdateMacro(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com nome vazio', () => {
      const data = { name: '' };
      const result = validateUpdateMacro(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome do macro não pode estar vazio');
    });
  });
});