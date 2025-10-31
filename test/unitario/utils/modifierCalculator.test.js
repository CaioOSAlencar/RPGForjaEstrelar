import { calculateD5eModifier, calculateCoCModifier, calculateAllModifiers, addModifiersToSheet } from '../../../src/utils/modifierCalculator.js';

describe('modifierCalculator', () => {
  describe('calculateD5eModifier', () => {
    test('deve calcular modificador D&D 5e corretamente', () => {
      expect(calculateD5eModifier(10)).toBe(0);
      expect(calculateD5eModifier(16)).toBe(3);
      expect(calculateD5eModifier(8)).toBe(-1);
      expect(calculateD5eModifier(20)).toBe(5);
    });
  });

  describe('calculateCoCModifier', () => {
    test('deve calcular modificador Call of Cthulhu', () => {
      expect(calculateCoCModifier(50)).toBe(10);
      expect(calculateCoCModifier(75)).toBe(15);
      expect(calculateCoCModifier(25)).toBe(5);
    });
  });

  describe('calculateAllModifiers', () => {
    test('deve calcular modificadores para D&D 5e', () => {
      const sheet = {
        attributes: {
          STR: 16,
          DEX: 14,
          CON: 12
        }
      };

      const modifiers = calculateAllModifiers(sheet, 'D&D 5e');
      
      expect(modifiers.STR).toBe(3);
      expect(modifiers.DEX).toBe(2);
      expect(modifiers.CON).toBe(1);
    });

    test('deve calcular modificadores para Call of Cthulhu', () => {
      const sheet = {
        attributes: {
          STR: 50,
          DEX: 75
        }
      };

      const modifiers = calculateAllModifiers(sheet, 'Call of Cthulhu');
      
      expect(modifiers.STR).toBe(10);
      expect(modifiers.DEX).toBe(15);
    });
  });

  describe('addModifiersToSheet', () => {
    test('deve adicionar modificadores à ficha', () => {
      const sheet = {
        attributes: {
          STR: 16,
          DEX: 14
        }
      };

      const result = addModifiersToSheet(sheet);
      
      expect(result.modifiers).toBeDefined();
      expect(result.modifiers.STR).toBe(3);
      expect(result.modifiers.DEX).toBe(2);
    });
  });
});