import { jest } from '@jest/globals';

// Mock do Prisma
const mockPrisma = {
  token: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  scene: {
    findUnique: jest.fn()
  }
};

jest.unstable_mockModule('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma)
}));

describe('Token Controller', () => {
  let createNewToken, listSceneTokens, getTokenDetails, updateTokenProperties, deleteTokenById;
  let mockReq, mockRes;

  beforeAll(async () => {
    const controller = await import('../../../src/controllers/tokenController.js');
    createNewToken = controller.createNewToken;
    listSceneTokens = controller.listSceneTokens;
    getTokenDetails = controller.getTokenDetails;
    updateTokenProperties = controller.updateTokenProperties;
    deleteTokenById = controller.deleteTokenById;
  });

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { id: 1 },
      file: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('createNewToken', () => {
    test('deve criar token com sucesso', async () => {
      mockReq.body = {
        name: 'Goblin',
        sceneId: 1,
        size: 1,
        hp: 7,
        maxHp: 7
      };

      mockPrisma.scene.findUnique.mockResolvedValue({
        id: 1,
        campaign: { masterId: 1 }
      });

      mockPrisma.token.create.mockResolvedValue({
        id: 1,
        name: 'Goblin',
        sceneId: 1,
        size: 1,
        hp: 7,
        maxHp: 7
      });

      await createNewToken(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('listSceneTokens', () => {
    test('deve listar tokens da cena', async () => {
      mockReq.params = { sceneId: '1' };

      mockPrisma.scene.findUnique.mockResolvedValue({
        id: 1,
        campaign: { masterId: 1 }
      });

      mockPrisma.token.findMany.mockResolvedValue([
        { id: 1, name: 'Goblin', hp: 7 },
        { id: 2, name: 'Orc', hp: 15 }
      ]);

      await listSceneTokens(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getTokenDetails', () => {
    test('deve buscar detalhes do token', async () => {
      mockReq.params = { tokenId: '1' };

      mockPrisma.token.findUnique.mockResolvedValue({
        id: 1,
        name: 'Goblin',
        hp: 7,
        scene: { campaign: { masterId: 1 } }
      });

      await getTokenDetails(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateTokenProperties', () => {
    test('deve atualizar propriedades do token', async () => {
      mockReq.params = { tokenId: '1' };
      mockReq.body = { x: 100, y: 200, rotation: 45 };

      mockPrisma.token.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        scene: { campaign: { masterId: 1 } }
      });

      mockPrisma.token.update.mockResolvedValue({
        id: 1,
        x: 100,
        y: 200,
        rotation: 45
      });

      await updateTokenProperties(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteTokenById', () => {
    test('deve deletar token', async () => {
      mockReq.params = { tokenId: '1' };

      mockPrisma.token.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        scene: { campaign: { masterId: 1 } }
      });

      mockPrisma.token.delete.mockResolvedValue({ id: 1 });

      await deleteTokenById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});
