import { jest } from '@jest/globals';

// Mock do Prisma
const mockPrisma = {
  backgroundMusic: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  soundEffect: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn()
  },
  campaign: {
    findUnique: jest.fn()
  }
};

jest.unstable_mockModule('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma)
}));

describe('Music Controller', () => {
  let createMusic, getMusicByCampaign, updateMusic, deleteMusic, createSoundEffect;
  let mockReq, mockRes;

  beforeAll(async () => {
    const controller = await import('../../../src/controllers/musicController.js');
    createMusic = controller.createMusic;
    getMusicByCampaign = controller.getMusicByCampaign;
    updateMusic = controller.updateMusic;
    deleteMusic = controller.deleteMusic;
    createSoundEffect = controller.createSoundEffect;
  });

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { id: 1 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('createMusic', () => {
    test('deve criar música com sucesso', async () => {
      mockReq.body = {
        campaignId: 1,
        name: 'Battle Theme',
        url: 'https://example.com/music.mp3',
        volume: 0.7
      };

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.backgroundMusic.create.mockResolvedValue({
        id: 1,
        name: 'Battle Theme',
        url: 'https://example.com/music.mp3',
        volume: 0.7
      });

      await createMusic(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getMusicByCampaign', () => {
    test('deve listar músicas', async () => {
      mockReq.params = { campaignId: '1' };

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.backgroundMusic.findMany.mockResolvedValue([
        { id: 1, name: 'Music 1' }
      ]);

      await getMusicByCampaign(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateMusic', () => {
    test('deve atualizar música', async () => {
      mockReq.params = { musicId: '1' };
      mockReq.body = { name: 'Updated' };

      mockPrisma.backgroundMusic.findUnique.mockResolvedValue({
        id: 1,
        campaign: { masterId: 1 }
      });

      mockPrisma.backgroundMusic.update.mockResolvedValue({
        id: 1,
        name: 'Updated'
      });

      await updateMusic(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteMusic', () => {
    test('deve deletar música', async () => {
      mockReq.params = { musicId: '1' };

      mockPrisma.backgroundMusic.findUnique.mockResolvedValue({
        id: 1,
        campaign: { masterId: 1 }
      });

      mockPrisma.backgroundMusic.delete.mockResolvedValue({ id: 1 });

      await deleteMusic(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('createSoundEffect', () => {
    test('deve criar efeito sonoro', async () => {
      mockReq.body = {
        campaignId: 1,
        name: 'Explosion',
        url: 'https://example.com/explosion.mp3',
        volume: 1.0
      };

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.soundEffect.create.mockResolvedValue({
        id: 1,
        name: 'Explosion'
      });

      await createSoundEffect(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });
});
