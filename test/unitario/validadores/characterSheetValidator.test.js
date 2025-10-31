import { validateCreateSheet, validateUpdateSheet } from '../../../src/validadores/characterSheetValidator.js';

describe('characterSheetValidator', () => {
  describe('validateCreateSheet', () => {
    test('deve validar ficha válida', () => {
      const data = { 
        name: 'Aragorn', 
        campaignId: 1,
        data: JSON.stringify({ attributes: { strength: 16 }, skills: {}, inventory: {} })
      };
      const result = validateCreateSheet(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toBe(null);
    });

    test('deve falhar com nome vazio', () => {
      const data = { name: '', campaignId: 1, data: JSON.stringify({ attributes: {}, skills: {}, inventory: {} }) };
      const result = validateCreateSheet(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome do personagem é obrigatório');
    });

    test('deve falhar sem campaignId', () => {
      const data = { name: 'Aragorn', data: JSON.stringify({ attributes: {}, skills: {}, inventory: {} }) };
      const result = validateCreateSheet(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID da campanha é obrigatório');
    });
  });

  describe('validateUpdateSheet', () => {
    test('deve validar atualização válida', () => {
      const data = { 
        name: 'Updated Aragorn',
        data: JSON.stringify({ attributes: { strength: 18 }, skills: {}, inventory: {} })
      };
      const result = validateUpdateSheet(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toBe(null);
    });

    test('deve falhar com nome vazio', () => {
      const data = { name: '' };
      const result = validateUpdateSheet(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome do personagem não pode estar vazio');
    });
  });
});