import prisma from '../config/database.js';

export const createMessage = async (messageData) => {
  // RF21 - Mapear targetUserId para whisperTo
  const data = { ...messageData };
  if (data.targetUserId) {
    data.whisperTo = data.targetUserId;
    delete data.targetUserId;
  }
  
  return await prisma.chatMessage.create({
    data,
    select: {
      id: true,
      content: true,
      timestamp: true,
      campaignId: true,
      sceneId: true,
      isPrivate: true,
      whisperTo: true,
      rollData: true,
      emoteData: true,
      user: {
        select: {
          id: true,
          name: true
        }
      },
      whisperUser: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

export const findMessagesByCampaign = async (campaignId, options = {}) => {
  const { limit = 50, offset = 0, sceneId, userId } = options;
  
  const where = { 
    campaignId,
    OR: [
      { isPrivate: false }, // Mensagens públicas
      { userId: userId }, // Mensagens enviadas pelo usuário
      { whisperTo: userId } // Mensagens privadas direcionadas ao usuário
    ]
  };
  
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
      whisperTo: true,
      rollData: true,
      emoteData: true,
      user: {
        select: {
          id: true,
          name: true
        }
      },
      whisperUser: {
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
      emoteData: true,
      whisperTo: true,
      user: {
        select: {
          id: true,
          name: true
        }
      },
      whisperUser: {
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

// RF22 - Buscar histórico de rolagens
export const findDiceRollHistory = async (campaignId, options = {}) => {
  const { limit = 20, userId } = options;
  
  const where = {
    campaignId,
    rollData: { not: null },
    OR: [
      { isPrivate: false },
      { userId: userId },
      { whisperTo: userId }
    ]
  };

  return await prisma.chatMessage.findMany({
    where,
    select: {
      id: true,
      content: true,
      timestamp: true,
      rollData: true,
      emoteData: true,
      isPrivate: true,
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
    take: limit
  });
};