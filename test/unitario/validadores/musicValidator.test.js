import { validateCreateMusic, validateUpdateMusic, validateCreateSoundEffect } from '../../../src/validadores/musicValidator.js';

describe('musicValidator', () => {
  describe('validateCreateMusic', () => {
    test('deve validar música válida', () => {
      const data = { 
        name: 'Epic Battle Music',
        url: 'https://example.com/music.mp3',
        campaignId: 1,
        volume: 0.5
      };
      const result = validateCreateMusic(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com nome vazio', () => {
      const data = { name: '', url: 'https://example.com/music.mp3', campaignId: 1 };
      const result = validateCreateMusic(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome é obrigatório');
    });

    test('deve falhar com URL vazia', () => {
      const data = { name: 'Music', url: '', campaignId: 1 };
      const result = validateCreateMusic(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('URL é obrigatória');
    });

    test('deve falhar sem campaignId', () => {
      const data = { name: 'Music', url: 'https://example.com/music.mp3' };
      const result = validateCreateMusic(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID da campanha é obrigatório');
    });
  });

  describe('validateUpdateMusic', () => {
    test('deve validar atualização válida', () => {
      const data = { 
        volume: 0.7,
        isPlaying: true
      };
      const result = validateUpdateMusic(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com volume inválido', () => {
      const data = { volume: 1.5 };
      const result = validateUpdateMusic(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Volume deve ser um número entre 0 e 1');
    });
  });

  describe('validateCreateSoundEffect', () => {
    test('deve validar efeito sonoro válido', () => {
      const data = { 
        name: 'Sword Slash',
        url: 'https://example.com/slash.mp3',
        campaignId: 1,
        volume: 1.0
      };
      const result = validateCreateSoundEffect(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com nome vazio', () => {
      const data = { name: '', url: 'https://example.com/sound.mp3', campaignId: 1 };
      const result = validateCreateSoundEffect(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome é obrigatório');
    });
  });
});