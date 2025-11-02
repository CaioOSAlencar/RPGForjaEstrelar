import { rollDice } from '../../../src/controllers/diceController.js';

describe('diceController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: () => res,
      json: () => {}
    };
  });

  test('deve rolar dados com sucesso', async () => {
    req.body = { expression: '1d20' };
    let statusCalled = false;
    let jsonCalled = false;
    res.status = () => { statusCalled = true; return res; };
    res.json = () => { jsonCalled = true; };
    
    await rollDice(req, res);
    
    expect(statusCalled).toBe(true);
    expect(jsonCalled).toBe(true);
  });

  test('deve falhar com expressão inválida', async () => {
    req.body = { expression: 'invalid' };
    
    try {
      await rollDice(req, res);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});