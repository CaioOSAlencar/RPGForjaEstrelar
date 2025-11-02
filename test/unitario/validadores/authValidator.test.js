import { validateLogin, validateRegister, validateUpdateProfile } from '../../../src/validadores/authValidator.js';

describe('authValidator', () => {
  describe('validateLogin', () => {
    test('deve validar dados corretos', () => {
      const data = {
        email: 'test@gmail.com',
        password: 'MinhaSenh@123'
      };
      
      const result = validateLogin(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve rejeitar email inválido', () => {
      const data = {
        email: 'email-invalido',
        password: 'MinhaSenh@123'
      };
      
      const result = validateLogin(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email deve ter formato válido');
    });

    test('deve rejeitar campos vazios', () => {
      const data = {
        email: '',
        password: ''
      };
      
      const result = validateLogin(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email é obrigatório');
      expect(result.errors).toContain('Senha é obrigatória');
    });
  });

  describe('validateRegister', () => {
    test('deve validar dados corretos', () => {
      const data = {
        name: 'João Silva',
        email: 'joao@gmail.com',
        password: 'MinhaSenh@123'
      };
      
      const result = validateRegister(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve rejeitar senha fraca', () => {
      const data = {
        name: 'João Silva',
        email: 'joao@gmail.com',
        password: '123'
      };
      
      const result = validateRegister(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Senha deve ter pelo menos 8 caracteres');
      expect(result.errors).toContain('Senha deve conter pelo menos 1 letra maiúscula');
      expect(result.errors).toContain('Senha deve conter pelo menos 1 caractere especial (!@#$%^&*)');
    });

    test('deve rejeitar provedor de email inválido', () => {
      const data = {
        name: 'João Silva',
        email: 'joao@provedor-invalido.com',
        password: 'MinhaSenh@123'
      };
      
      const result = validateRegister(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email deve ser de um provedor válido (Gmail, Outlook, Yahoo, etc.)');
    });

    test('deve rejeitar nome muito curto', () => {
      const data = {
        name: 'A',
        email: 'joao@gmail.com',
        password: 'MinhaSenh@123'
      };
      
      const result = validateRegister(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome deve ter pelo menos 2 caracteres');
    });
  });

  describe('validateUpdateProfile', () => {
    test('deve validar atualização de nome', () => {
      const data = {
        name: 'João Silva Santos'
      };
      
      const result = validateUpdateProfile(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve validar atualização de senha', () => {
      const data = {
        password: 'NovaSenha@456'
      };
      
      const result = validateUpdateProfile(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve rejeitar dados vazios', () => {
      const data = {
        name: '',
        password: ''
      };
      
      const result = validateUpdateProfile(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Nome não pode ser vazio');
      expect(result.errors).toContain('Senha não pode ser vazia');
    });
  });
});