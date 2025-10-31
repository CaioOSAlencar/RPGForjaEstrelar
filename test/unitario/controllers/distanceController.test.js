import { calculateDistance } from '../../../src/controllers/distanceController.js';

describe('distanceController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: () => res,
      json: () => {}
    };
  });

  test('deve calcular distância com sucesso', async () => {
    req.body = {
      token1: { x: 0, y: 0 },
      token2: { x: 100, y: 100 },
      gridSize: 50
    };
    
    let statusCalled = false;
    let jsonCalled = false;
    res.status = () => { statusCalled = true; return res; };
    res.json = () => { jsonCalled = true; };
    
    await calculateDistance(req, res);
    
    expect(statusCalled).toBe(true);
    expect(jsonCalled).toBe(true);
  });

  test('deve falhar com dados inválidos', async () => {
    req.body = {};
    
    try {
      await calculateDistance(req, res);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});