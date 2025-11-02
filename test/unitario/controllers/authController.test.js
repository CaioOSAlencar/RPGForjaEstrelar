import { register, login } from '../../../src/controllers/authController.js';

describe('Auth Controller', () => {
  test('register function exists', () => {
    expect(typeof register).toBe('function');
  });

  test('login function exists', () => {
    expect(typeof login).toBe('function');
  });
});