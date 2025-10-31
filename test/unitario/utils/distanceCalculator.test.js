import { calculateEuclideanDistance, calculateManhattanDistance, calculateGridDistance } from '../../../src/utils/distanceCalculator.js';

describe('distanceCalculator', () => {
  describe('calculateEuclideanDistance', () => {
    test('deve calcular distância euclidiana correta', () => {
      const distance = calculateEuclideanDistance(0, 0, 3, 4);
      expect(distance).toBe(5);
    });

    test('deve calcular distância zero para mesmo ponto', () => {
      const distance = calculateEuclideanDistance(5, 5, 5, 5);
      expect(distance).toBe(0);
    });

    test('deve lidar com coordenadas negativas', () => {
      const distance = calculateEuclideanDistance(-2, -3, 1, 1);
      expect(distance).toBe(5);
    });
  });

  describe('calculateManhattanDistance', () => {
    test('deve calcular distância Manhattan', () => {
      const distance = calculateManhattanDistance(0, 0, 3, 4);
      expect(distance).toBe(7);
    });

    test('deve calcular distância zero para mesmo ponto', () => {
      const distance = calculateManhattanDistance(5, 5, 5, 5);
      expect(distance).toBe(0);
    });
  });

  describe('calculateGridDistance', () => {
    test('deve calcular distância em grid', () => {
      const token1 = { x: 0, y: 0 };
      const token2 = { x: 150, y: 200 };
      const result = calculateGridDistance(token1, token2, 50);
      
      expect(result.gridCells.horizontal).toBe(3);
      expect(result.gridCells.vertical).toBe(4);
      expect(result.manhattan).toBe(7);
    });
  });
});