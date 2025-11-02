import { validateCreateCampaign, validateInviteByEmail, validateJoinByCode } from '../../../src/validadores/campaignValidator.js';

describe('campaignValidator', () => {
  describe('validateCreateCampaign', () => {
    test('deve validar campanha válida', () => {
      const data = { name: 'Test Campaign', system: 'D&D 5e', description: 'Test description' };
      const result = validateCreateCampaign(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com nome vazio', () => {
      const data = { name: '', system: 'D&D 5e' };
      const result = validateCreateCampaign(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome da campanha é obrigatório');
    });

    test('deve falhar com nome muito curto', () => {
      const data = { name: 'AB' };
      const result = validateCreateCampaign(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome da campanha deve ter pelo menos 3 caracteres');
    });

    test('deve falhar com nome muito longo', () => {
      const data = { name: 'A'.repeat(101) };
      const result = validateCreateCampaign(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome da campanha deve ter no máximo 100 caracteres');
    });

    test('deve falhar com sistema muito longo', () => {
      const data = { name: 'Test Campaign', system: 'A'.repeat(51) };
      const result = validateCreateCampaign(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Sistema deve ter no máximo 50 caracteres');
    });

    test('deve falhar com descrição muito longa', () => {
      const data = { name: 'Test Campaign', description: 'A'.repeat(501) };
      const result = validateCreateCampaign(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Descrição deve ter no máximo 500 caracteres');
    });
  });

  describe('validateInviteByEmail', () => {
    test('deve validar email válido', () => {
      const data = { email: 'test@test.com' };
      const result = validateInviteByEmail(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com email vazio', () => {
      const data = { email: '' };
      const result = validateInviteByEmail(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email é obrigatório');
    });

    test('deve falhar com email inválido', () => {
      const data = { email: 'invalid-email' };
      const result = validateInviteByEmail(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email deve ter formato válido');
    });
  });

  describe('validateJoinByCode', () => {
    test('deve validar código válido', () => {
      const data = { roomCode: 'ABC123' };
      const result = validateJoinByCode(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com código vazio', () => {
      const data = { roomCode: '' };
      const result = validateJoinByCode(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Código da sala é obrigatório');
    });

    test('deve falhar com código de tamanho incorreto', () => {
      const data = { roomCode: 'ABC12' };
      const result = validateJoinByCode(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Código da sala deve ter 6 caracteres');
    });
  });
});