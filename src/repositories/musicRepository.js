import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const musicRepository = {
  // RF28 - Background Music
  async createMusic(data) {
    return await prisma.backgroundMusic.create({
      data,
      include: {
        campaign: { select: { id: true, name: true } }
      }
    });
  },

  async findMusicByCampaign(campaignId) {
    return await prisma.backgroundMusic.findMany({
      where: { campaignId: parseInt(campaignId) },
      orderBy: { createdAt: 'desc' }
    });
  },

  async findMusicById(id) {
    return await prisma.backgroundMusic.findUnique({
      where: { id: parseInt(id) },
      include: {
        campaign: { select: { id: true, name: true, masterId: true } }
      }
    });
  },

  async updateMusic(id, data) {
    return await prisma.backgroundMusic.update({
      where: { id: parseInt(id) },
      data
    });
  },

  async deleteMusic(id) {
    return await prisma.backgroundMusic.delete({
      where: { id: parseInt(id) }
    });
  },

  // RF42 - Sound Effects
  async createSoundEffect(data) {
    return await prisma.soundEffect.create({
      data,
      include: {
        campaign: { select: { id: true, name: true } }
      }
    });
  },

  async findSoundEffectsByCampaign(campaignId) {
    return await prisma.soundEffect.findMany({
      where: { campaignId: parseInt(campaignId) },
      orderBy: { name: 'asc' }
    });
  },

  async findSoundEffectById(id) {
    return await prisma.soundEffect.findUnique({
      where: { id: parseInt(id) },
      include: {
        campaign: { select: { id: true, name: true, masterId: true } }
      }
    });
  },

  async updateSoundEffect(id, data) {
    return await prisma.soundEffect.update({
      where: { id: parseInt(id) },
      data
    });
  },

  async deleteSoundEffect(id) {
    return await prisma.soundEffect.delete({
      where: { id: parseInt(id) }
    });
  }
};