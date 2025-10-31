import { validatePlayMusic, validateCreatePlaylist } from '../../../src/validadores/musicValidator.js';

describe('musicValidator', () => {
  describe('validatePlayMusic', () => {
    test('deve validar música válida', () => {
      const data = { 
        url: 'https://example.com/music.mp3',
        campaignId: 1,
        volume: 0.5
      };
      const result = validatePlayMusic(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com URL vazia', () => {
      const data = { url: '', campaignId: 1 };
      const result = validatePlayMusic(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('URL da música é obrigatória');
    });

    test('deve falhar sem campaignId', () => {
      const data = { url: 'https://example.com/music.mp3' };
      const result = validatePlayMusic(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID da campanha é obrigatório');
    });
  });

  describe('validateCreatePlaylist', () => {
    test('deve validar playlist válida', () => {
      const data = { 
        name: 'Battle Music',
        campaignId: 1,
        tracks: ['track1.mp3', 'track2.mp3']
      };
      const result = validateCreatePlaylist(data);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve falhar com nome vazio', () => {
      const data = { name: '', campaignId: 1 };
      const result = validateCreatePlaylist(data);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome da playlist é obrigatório');
    });
  });
});