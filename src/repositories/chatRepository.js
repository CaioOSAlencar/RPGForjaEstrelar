import prisma from '../config/database.js';

export const createMessage = async (messageData) => {
  return await prisma.chatMessage.create({
    data: messageData,
    select: {
      id: true,
      content: true,
      timestamp: true,
      campaignId: true,
      sceneId: true,
      isPrivate: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

export const findMessagesByCampaign = async (campaignId, options = {}) => {
  const { limit = 50, offset = 0, sceneId } = options;
  
  const where = { campaignId };
  if (sceneId) {
    where.sceneId = sceneId;
  }

  return await prisma.chatMessage.findMany({
    where,
    select: {
      id: true,
      content: true,
      timestamp: true,
      campaignId: true,
      sceneId: true,
      isPrivate: true,
      rollData: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      timestamp: 'desc'
    },
    take: limit,
    skip: offset
  });
};

export const findMessageById = async (id) => {
  return await prisma.chatMessage.findUnique({
    where: { id },
    select: {
      id: true,
      content: true,
      timestamp: true,
      campaignId: true,
      sceneId: true,
      isPrivate: true,
      rollData: true,
      whisperTo: true,
      user: {
        select: {
          id: true,
          name: true
        }
      },
      campaign: {
        select: {
          id: true,
          masterId: true
        }
      }
    }
  });
};

export const deleteMessage = async (id) => {
  return await prisma.chatMessage.delete({
    where: { id }
  });
};