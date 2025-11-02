import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const noteRepository = {
  async create(data) {
    return await prisma.note.create({
      data,
      include: {
        creator: { select: { id: true, name: true } },
        campaign: { select: { id: true, name: true } }
      }
    });
  },

  async findById(id) {
    return await prisma.note.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: { select: { id: true, name: true } },
        campaign: { select: { id: true, name: true } }
      }
    });
  },

  async findByCampaign(campaignId) {
    return await prisma.note.findMany({
      where: { campaignId: parseInt(campaignId) },
      include: {
        creator: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async update(id, data) {
    return await prisma.note.update({
      where: { id: parseInt(id) },
      data,
      include: {
        creator: { select: { id: true, name: true } },
        campaign: { select: { id: true, name: true } }
      }
    });
  },

  async delete(id) {
    return await prisma.note.delete({
      where: { id: parseInt(id) }
    });
  },

  async search(campaignId, query) {
    return await prisma.note.findMany({
      where: {
        campaignId: parseInt(campaignId),
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        creator: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};