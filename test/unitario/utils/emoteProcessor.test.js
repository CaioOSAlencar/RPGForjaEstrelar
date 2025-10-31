import { processEmoteCommand, isEmoteCommand } from '../../../src/utils/emoteProcessor.js';

describe('emoteProcessor', () => {
  describe('isEmoteCommand', () => {
    test('deve identificar comando /me válido', () => {
      expect(isEmoteCommand('/me ataca')).toBe(true);
      expect(isEmoteCommand('/me corre rapidamente')).toBe(true);
    });

    test('deve rejeitar comando inválido', () => {
      expect(isEmoteCommand('mensagem normal')).toBe(false);
      expect(isEmoteCommand('/me')).toBe(false);
    });
  });

  describe('processEmoteCommand', () => {
    test('deve processar comando /me corretamente', () => {
      const result = processEmoteCommand('/me ataca com espada', 'João');
      expect(result.formattedContent).toBe('*João ataca com espada*');
      expect(result.isEmote).toBe(true);
    });

    test('deve processar comando /me com espaços extras', () => {
      const result = processEmoteCommand('/me   corre rapidamente  ', 'Maria');
      expect(result.formattedContent).toBe('*Maria corre rapidamente*');
    });

    test('deve retornar null para comando inválido', () => {
      const result = processEmoteCommand('mensagem normal', 'João');
      expect(result).toBeNull();
    });
  });
});