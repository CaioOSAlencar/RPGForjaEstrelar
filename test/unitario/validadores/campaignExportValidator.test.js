import { validateExportCampaign, validateImportCampaign } from '../../../src/validadores/campaignExportValidator.js';

describe('campaignExportValidator', () => {
  describe('validateExportCampaign', () => {
    test('deve validar export válido', () => {
      const data = { campaignId: 1 };
      const result = validateExportCampaign(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar sem campaignId', () => {
      const data = {};
      const result = validateExportCampaign(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID da campanha é obrigatório');
    });
  });

  describe('validateImportCampaign', () => {
    test('deve validar import válido', () => {
      const data = { 
        campaignData: { 
          name: 'Test Campaign',
          scenes: [],
          characters: []
        }
      };
      const result = validateImportCampaign(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar sem dados da campanha', () => {
      const data = {};
      const result = validateImportCampaign(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Dados da campanha são obrigatórios');
    });
  });
});