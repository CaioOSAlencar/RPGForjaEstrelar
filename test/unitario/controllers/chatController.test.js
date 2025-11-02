import { jest } from '@jest/globals';

// Mock do Prisma
const mockPrisma = {
  chatMessage: {
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

describe('Chat Controller', () => {
  let sendMessage, getCampaignMessages, deleteMessageById, getDiceRollHistory;
  let mockReq, mockRes;

  beforeAll(async () => {
    const controller = await import('../../../src/controllers/chatController.js');
    sendMessage = controller.sendMessage;
    getCampaignMessages = controller.getCampaignMessages;
    deleteMessageById = controller.deleteMessageById;
    getDiceRollHistory = controller.getDiceRollHistory;
  });

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { id: 1 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    test('deve enviar mensagem com sucesso', async () => {
      mockReq.body = {
        campaignId: 1,
        content: 'Hello party!',
        messageType: 'text'
      };

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.chatMessage.create.mockResolvedValue({
        id: 1,
        content: 'Hello party!',
        messageType: 'text',
        userId: 1,
        campaignId: 1
      });

      await sendMessage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getCampaignMessages', () => {
    test('deve listar mensagens', async () => {
      mockReq.params = { campaignId: '1' };
      mockReq.query = {};

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.chatMessage.findMany.mockResolvedValue([
        { id: 1, content: 'Message 1' },
        { id: 2, content: 'Message 2' }
      ]);

      await getCampaignMessages(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteMessageById', () => {
    test('deve deletar mensagem', async () => {
      mockReq.params = { messageId: '1' };

      mockPrisma.chatMessage.findUnique.mockResolvedValue({
        id: 1,
        userId: 1,
        campaign: { masterId: 1 }
      });

      mockPrisma.chatMessage.delete.mockResolvedValue({ id: 1 });

      await deleteMessageById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getDiceRollHistory', () => {
    test('deve listar histórico de rolagens', async () => {
      mockReq.params = { campaignId: '1' };
      mockReq.query = { limit: '20' };

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.chatMessage.findMany.mockResolvedValue([
        { id: 1, messageType: 'dice', rollData: '{"total": 15}' },
        { id: 2, messageType: 'dice', rollData: '{"total": 20}' }
      ]);

      await getDiceRollHistory(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});
