import { isDiceCommand, parseDiceCommand, rollDice, calculateDiceRoll } from '../../../src/utils/diceRoller.js';

describe('diceRoller Utils', () => {
  describe('isDiceCommand', () => {
    test('deve identificar comandos válidos', () => {
      expect(isDiceCommand('/roll 1d20')).toBe(true);
      expect(isDiceCommand('/roll 2d6+3')).toBe(true);
      expect(isDiceCommand('/roll 1d8-1')).toBe(true);
    });

    test('deve rejeitar comandos inválidos', () => {
      expect(isDiceCommand('roll 1d20')).toBe(false);
      expect(isDiceCommand('/attack')).toBe(false);
      expect(isDiceCommand('')).toBe(false);
    });
  });

  describe('parseDiceCommand', () => {
    test('deve parsear comando simples', () => {
      const result = parseDiceCommand('/roll 1d20');
      expect(result.numDice).toBe(1);
      expect(result.diceSides).toBe(20);
      expect(result.modifier).toBe(0);
    });

    test('deve parsear comando com modificador positivo', () => {
      const result = parseDiceCommand('/roll 2d6+3');
      expect(result.numDice).toBe(2);
      expect(result.diceSides).toBe(6);
      expect(result.modifier).toBe(3);
    });

    test('deve parsear comando com modificador negativo', () => {
      const result = parseDiceCommand('/roll 1d8-2');
      expect(result.numDice).toBe(1);
      expect(result.diceSides).toBe(8);
      expect(result.modifier).toBe(-2);
    });
  });

  describe('rollDice', () => {
    test('deve rolar dados dentro do range', () => {
      const rolls = rollDice(2, 6);
      expect(rolls).toHaveLength(2);
      rolls.forEach(roll => {
        expect(roll).toBeGreaterThanOrEqual(1);
        expect(roll).toBeLessThanOrEqual(6);
      });
    });

    test('deve rolar quantidade correta de dados', () => {
      const rolls = rollDice(5, 20);
      expect(rolls).toHaveLength(5);
    });
  });

  describe('calculateDiceRoll', () => {
    test('deve calcular rolagem completa', () => {
      const result = calculateDiceRoll('/roll 2d6+3');
      
      expect(result.expression).toBe('2d6+3');
      expect(result.rolls).toHaveLength(2);
      expect(result.sum).toBeGreaterThanOrEqual(2);
      expect(result.sum).toBeLessThanOrEqual(12);
      expect(result.modifier).toBe(3);
      expect(result.total).toBe(result.sum + result.modifier);
      expect(result.breakdown).toContain(' + ');
    });

    test('deve lidar com modificador negativo', () => {
      const result = calculateDiceRoll('/roll 1d20-5');
      
      expect(result.modifier).toBe(-5);
      expect(result.total).toBe(result.sum - 5);
    });
  });
});