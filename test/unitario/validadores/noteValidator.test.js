import { validateCreateNote, validateUpdateNote, validateSearchNotes } from '../../../src/validadores/noteValidator.js';

describe('noteValidator', () => {
  describe('validateCreateNote', () => {
    test('deve validar dados corretos', () => {
      const data = {
        title: 'Minha Nota',
        content: 'Conteúdo da nota em **Markdown**',
        campaignId: '1',
        isHandout: false
      };
      
      const result = validateCreateNote(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve rejeitar título vazio', () => {
      const data = {
        title: '',
        campaignId: '1'
      };
      
      const result = validateCreateNote(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Título é obrigatório');
    });

    test('deve rejeitar título muito longo', () => {
      const data = {
        title: 'a'.repeat(201),
        campaignId: '1'
      };
      
      const result = validateCreateNote(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Título deve ter no máximo 200 caracteres');
    });

    test('deve rejeitar conteúdo muito longo', () => {
      const data = {
        title: 'Título',
        content: 'a'.repeat(10001),
        campaignId: '1'
      };
      
      const result = validateCreateNote(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Conteúdo deve ter no máximo 10000 caracteres');
    });

    test('deve rejeitar campaignId inválido', () => {
      const data = {
        title: 'Título',
        campaignId: 'abc'
      };
      
      const result = validateCreateNote(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID da campanha deve ser um número válido');
    });
  });

  describe('validateUpdateNote', () => {
    test('deve validar atualização parcial', () => {
      const data = {
        title: 'Novo Título'
      };
      
      const result = validateUpdateNote(data);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve validar isHandout boolean', () => {
      const data = {
        isHandout: 'true'
      };
      
      const result = validateUpdateNote(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('isHandout deve ser verdadeiro ou falso');
    });
  });

  describe('validateSearchNotes', () => {
    test('deve validar query válida', () => {
      const query = { q: 'busca' };
      
      const result = validateSearchNotes(query);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('deve rejeitar query muito curta', () => {
      const query = { q: 'a' };
      
      const result = validateSearchNotes(query);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Query deve ter pelo menos 2 caracteres');
    });

    test('deve rejeitar query vazia', () => {
      const query = { q: '' };
      
      const result = validateSearchNotes(query);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Query de busca é obrigatória');
    });
  });
});