import { getTemplateForSystem, getAvailableSystems } from '../../../src/utils/sheetTemplates.js';

describe('sheetTemplates', () => {
  describe('getAvailableSystems', () => {
    test('deve retornar lista de sistemas disponíveis', () => {
      const systems = getAvailableSystems();
      
      expect(Array.isArray(systems)).toBe(true);
      expect(systems.length).toBeGreaterThan(0);
      expect(systems).toContain('D&D 5e');
    });
  });

  describe('getTemplateForSystem', () => {
    test('deve retornar template D&D 5e', () => {
      const template = getTemplateForSystem('D&D 5e');
      
      expect(template).toBeDefined();
      expect(template.attributes).toBeDefined();
      expect(template.attributes.strength).toBeDefined();
      expect(template.skills).toBeDefined();
      expect(template.inventory).toBeDefined();
    });

    test('deve retornar template Call of Cthulhu', () => {
      const template = getTemplateForSystem('Call of Cthulhu');
      
      expect(template).toBeDefined();
      expect(template.attributes).toBeDefined();
      expect(template.skills).toBeDefined();
    });

    test('deve retornar template Cyberpunk RED', () => {
      const template = getTemplateForSystem('Cyberpunk RED');
      
      expect(template).toBeDefined();
      expect(template.attributes).toBeDefined();
      expect(template.skills).toBeDefined();
    });

    test('deve retornar Custom para sistema inexistente', () => {
      const template = getTemplateForSystem('invalid');
      expect(template).toBeDefined();
      expect(template.attributes).toEqual({});
    });
  });
});