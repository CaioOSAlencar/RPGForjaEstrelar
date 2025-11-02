import { jest } from '@jest/globals';

// Mock do Prisma
const mockPrisma = {
  scene: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  campaign: {
    findUnique: jest.fn()
  }
};

jest.unstable_mockModule('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma)
}));

describe('Scene Controller', () => {
  let createNewScene, listCampaignScenes, getSceneDetails, updateSceneSettings, deleteSceneById;
  let mockReq, mockRes;

  beforeAll(async () => {
    const controller = await import('../../../src/controllers/sceneController.js');
    createNewScene = controller.createNewScene;
    listCampaignScenes = controller.listCampaignScenes;
    getSceneDetails = controller.getSceneDetails;
    updateSceneSettings = controller.updateSceneSettings;
    deleteSceneById = controller.deleteSceneById;
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

  describe('createNewScene', () => {
    test('deve criar cena com sucesso', async () => {
      mockReq.body = {
        name: 'Taverna do Dragão',
        campaignId: 1,
        gridSize: 50
      };

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.scene.create.mockResolvedValue({
        id: 1,
        name: 'Taverna do Dragão',
        campaignId: 1,
        gridSize: 50
      });

      await createNewScene(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('listCampaignScenes', () => {
    test('deve listar cenas da campanha', async () => {
      mockReq.params = { campaignId: '1' };

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.scene.findMany.mockResolvedValue([
        { id: 1, name: 'Taverna', campaignId: 1 },
        { id: 2, name: 'Floresta', campaignId: 1 }
      ]);

      await listCampaignScenes(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getSceneDetails', () => {
    test('deve buscar detalhes da cena', async () => {
      mockReq.params = { sceneId: '1' };

      mockPrisma.scene.findUnique.mockResolvedValue({
        id: 1,
        name: 'Taverna',
        campaign: { masterId: 1 }
      });

      await getSceneDetails(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateSceneSettings', () => {
    test('deve atualizar configurações da cena', async () => {
      mockReq.params = { sceneId: '1' };
      mockReq.body = { gridSize: 100, gridColor: '#FFFFFF' };

      mockPrisma.scene.findUnique.mockResolvedValue({
        id: 1,
        campaign: { masterId: 1 }
      });

      mockPrisma.scene.update.mockResolvedValue({
        id: 1,
        gridSize: 100,
        gridColor: '#FFFFFF'
      });

      await updateSceneSettings(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteSceneById', () => {
    test('deve deletar cena', async () => {
      mockReq.params = { sceneId: '1' };

      mockPrisma.scene.findUnique.mockResolvedValue({
        id: 1,
        campaign: { masterId: 1 }
      });

      mockPrisma.scene.delete.mockResolvedValue({ id: 1 });

      await deleteSceneById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});
