import { measureDistance } from '../../../src/controllers/distanceController.js';

describe('distanceController', () => {
  test('measureDistance function exists', () => {
    expect(typeof measureDistance).toBe('function');
  });
});