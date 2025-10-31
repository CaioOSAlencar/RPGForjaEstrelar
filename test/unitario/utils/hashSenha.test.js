import HashSenha from '../../../src/utils/hashSenha.js';

describe('hashSenha Utils', () => {
  describe('criarHashSenha', () => {
    test('deve criar hash da senha', async () => {
      const senha = 'MinhaSenh@123';
      const hash = await HashSenha.criarHashSenha(senha);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(senha);
      expect(hash.length).toBeGreaterThan(50);
    });

    test('deve criar hashes diferentes para mesma senha', async () => {
      const senha = 'MinhaSenh@123';
      const hash1 = await HashSenha.criarHashSenha(senha);
      const hash2 = await HashSenha.criarHashSenha(senha);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('compararSenha', () => {
    test('deve validar senha correta', async () => {
      const senha = 'MinhaSenh@123';
      const hash = await HashSenha.criarHashSenha(senha);
      const resultado = await HashSenha.compararSenha(senha, hash);
      
      expect(resultado).toBe(true);
    });

    test('deve rejeitar senha incorreta', async () => {
      const senha = 'MinhaSenh@123';
      const senhaErrada = 'SenhaErrada123';
      const hash = await HashSenha.criarHashSenha(senha);
      const resultado = await HashSenha.compararSenha(senhaErrada, hash);
      
      expect(resultado).toBe(false);
    });
  });
});