import { validateCreateScene, validateUpdateScene } from '../../../src/validadores/sceneValidator.js';

describe('sceneValidator', () => {
  describe('validateCreateScene', () => {
    test('deve validar cena válida', () => {
      const data = { name: 'Test Scene', campaignId: 1 };
      const result = validateCreateScene(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com nome vazio', () => {
      const data = { name: '', campaignId: 1 };
      const result = validateCreateScene(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome da cena é obrigatório');
    });

    test('deve falhar com nome muito curto', () => {
      const data = { name: 'A', campaignId: 1 };
      const result = validateCreateScene(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome da cena deve ter pelo menos 2 caracteres');
    });

    test('deve falhar com nome muito longo', () => {
      const data = { name: 'A'.repeat(101), campaignId: 1 };
      const result = validateCreateScene(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome da cena deve ter no máximo 100 caracteres');
    });

    test('deve falhar sem campaignId', () => {
      const data = { name: 'Test Scene' };
      const result = validateCreateScene(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID da campanha é obrigatório');
    });
  });

  describe('validateUpdateScene', () => {
    test('deve validar atualização válida', () => {
      const data = { name: 'Updated Scene', gridSize: 30, gridColor: '#000000' };
      const result = validateUpdateScene(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com gridSize inválido', () => {
      const data = { gridSize: 5 };
      const result = validateUpdateScene(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Tamanho do grid deve ser entre 10 e 200 pixels');
    });

    test('deve falhar com cor inválida', () => {
      const data = { gridColor: 'invalid-color' };
      const result = validateUpdateScene(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Cor do grid deve estar no formato hexadecimal (#RRGGBB)');
    });

    test('deve falhar com snapToGrid inválido', () => {
      const data = { snapToGrid: 'invalid' };
      const result = validateUpdateScene(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Snap to grid deve ser verdadeiro ou falso');
    });
  });
});