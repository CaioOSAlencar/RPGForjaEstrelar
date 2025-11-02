import { validateImportCampaign } from '../../../src/validadores/campaignExportValidator.js';

describe('campaignExportValidator', () => {
  describe('validateImportCampaign', () => {
    test('deve validar import válido', () => {
      const data = { 
        name: 'Test Campaign',
        system: 'D&D 5e',
        description: 'Test description'
      };
      const result = validateImportCampaign(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar sem nome', () => {
      const data = { system: 'D&D 5e' };
      const result = validateImportCampaign(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome da campanha é obrigatório');
    });

    test('deve falhar sem sistema', () => {
      const data = { name: 'Test Campaign' };
      const result = validateImportCampaign(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Sistema é obrigatório');
    });

    test('deve validar arrays opcionais', () => {
      const data = { 
        name: 'Test Campaign',
        system: 'D&D 5e',
        scenes: [],
        notes: []
      };
      const result = validateImportCampaign(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com scenes não sendo array', () => {
      const data = { 
        name: 'Test Campaign',
        system: 'D&D 5e',
        scenes: 'invalid'
      };
      const result = validateImportCampaign(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Scenes deve ser um array');
    });
  });
});