import { jest } from '@jest/globals';

// Mock do Prisma
const mockPrisma = {
  diceMacro: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  characterSheet: {
    findUnique: jest.fn()
  },
  campaign: {
    findUnique: jest.fn()
  }
};

jest.unstable_mockModule('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma)
}));

describe('DiceMacro Controller', () => {
  let createDiceMacro, getMacrosBySheet, updateDiceMacro, deleteDiceMacro;
  let mockReq, mockRes;

  beforeAll(async () => {
    const controller = await import('../../../src/controllers/diceMacroController.js');
    createDiceMacro = controller.createDiceMacro;
    getMacrosBySheet = controller.getMacrosBySheet;
    updateDiceMacro = controller.updateDiceMacro;
    deleteDiceMacro = controller.deleteDiceMacro;
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

  describe('createDiceMacro', () => {
    test('deve criar macro com sucesso', async () => {
      mockReq.body = {
        characterSheetId: 1,
        name: 'Attack',
        expression: '1d20+5',
        description: 'Attack roll'
      };

      mockPrisma.characterSheet.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        campaignId: 1
      });

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.diceMacro.create.mockResolvedValue({
        id: 1,
        name: 'Attack',
        expression: '1d20+5'
      });

      await createDiceMacro(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getMacrosBySheet', () => {
    test('deve listar macros', async () => {
      mockReq.params = { characterSheetId: '1' };

      mockPrisma.characterSheet.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        campaignId: 1
      });

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.diceMacro.findMany.mockResolvedValue([
        { id: 1, name: 'Attack', diceFormula: '1d20+5' }
      ]);

      await getMacrosBySheet(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateDiceMacro', () => {
    test('deve atualizar macro', async () => {
      mockReq.params = { macroId: '1' };
      mockReq.body = { name: 'Updated Attack' };

      mockPrisma.diceMacro.findUnique.mockResolvedValue({
        id: 1,
        characterSheet: { id: 1, userId: 1, campaignId: 1 }
      });

      mockPrisma.characterSheet.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        campaignId: 1
      });

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.diceMacro.update.mockResolvedValue({
        id: 1,
        name: 'Updated Attack'
      });

      await updateDiceMacro(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteDiceMacro', () => {
    test('deve deletar macro', async () => {
      mockReq.params = { macroId: '1' };

      mockPrisma.diceMacro.findUnique.mockResolvedValue({
        id: 1,
        characterSheet: { id: 1, userId: 1, campaignId: 1 }
      });

      mockPrisma.characterSheet.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        campaignId: 1
      });

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.diceMacro.delete.mockResolvedValue({ id: 1 });

      await deleteDiceMacro(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});
