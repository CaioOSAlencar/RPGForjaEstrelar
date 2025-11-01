import { jest } from '@jest/globals';

// Mock do Prisma
const mockPrisma = {
  note: {
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

describe('Note Controller', () => {
  let createNote, getNotesByCampaign, getNoteById, updateNote, deleteNote, searchNotes;
  let mockReq, mockRes;

  beforeAll(async () => {
    const controller = await import('../../../src/controllers/noteController.js');
    createNote = controller.createNote;
    getNotesByCampaign = controller.getNotesByCampaign;
    getNoteById = controller.getNoteById;
    updateNote = controller.updateNote;
    deleteNote = controller.deleteNote;
    searchNotes = controller.searchNotes;
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

  describe('createNote', () => {
    test('deve criar nota com sucesso', async () => {
      mockReq.body = {
        campaignId: 1,
        title: 'Test Note',
        content: 'Content',
        isHandout: false
      };

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.note.create.mockResolvedValue({
        id: 1,
        title: 'Test Note',
        content: 'Content'
      });

      await createNote(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getNotesByCampaign', () => {
    test('deve listar notas', async () => {
      mockReq.params = { campaignId: '1' };

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.note.findMany.mockResolvedValue([
        { id: 1, title: 'Note 1' }
      ]);

      await getNotesByCampaign(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getNoteById', () => {
    test('deve buscar nota por ID', async () => {
      mockReq.params = { noteId: '1' };

      mockPrisma.note.findUnique.mockResolvedValue({
        id: 1,
        title: 'Note 1',
        campaign: { masterId: 1 }
      });

      await getNoteById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('updateNote', () => {
    test('deve atualizar nota', async () => {
      mockReq.params = { noteId: '1' };
      mockReq.body = { title: 'Updated' };

      mockPrisma.note.findUnique.mockResolvedValue({
        id: 1,
        createdBy: 1,
        campaign: { masterId: 1 }
      });

      mockPrisma.note.update.mockResolvedValue({
        id: 1,
        title: 'Updated'
      });

      await updateNote(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('deleteNote', () => {
    test('deve deletar nota', async () => {
      mockReq.params = { noteId: '1' };

      mockPrisma.note.findUnique.mockResolvedValue({
        id: 1,
        createdBy: 1,
        campaign: { masterId: 1 }
      });

      mockPrisma.note.delete.mockResolvedValue({ id: 1 });

      await deleteNote(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('searchNotes', () => {
    test('deve buscar notas', async () => {
      mockReq.params = { campaignId: '1' };
      mockReq.query = { q: 'test' };

      mockPrisma.campaign.findUnique.mockResolvedValue({
        id: 1,
        masterId: 1
      });

      mockPrisma.note.findMany.mockResolvedValue([
        { id: 1, title: 'Test Note' }
      ]);

      await searchNotes(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});
