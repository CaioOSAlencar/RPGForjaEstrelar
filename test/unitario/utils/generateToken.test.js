import { generateInviteToken, generateRoomCode } from '../../../src/utils/generateToken.js';

describe('generateToken', () => {
  describe('generateInviteToken', () => {
    test('deve gerar token válido', () => {
      const token = generateInviteToken();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBe(64);
    });

    test('deve gerar tokens diferentes', () => {
      const token1 = generateInviteToken();
      const token2 = generateInviteToken();
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('generateRoomCode', () => {
    test('deve gerar código de 6 caracteres', () => {
      const code = generateRoomCode();
      
      expect(code).toBeDefined();
      expect(typeof code).toBe('string');
      expect(code.length).toBe(6);
    });

    test('deve gerar códigos diferentes', () => {
      const code1 = generateRoomCode();
      const code2 = generateRoomCode();
      
      expect(code1).not.toBe(code2);
    });

    test('deve conter apenas caracteres alfanuméricos', () => {
      const code = generateRoomCode();
      expect(code).toMatch(/^[A-Z0-9]{6}$/);
    });
  });
});