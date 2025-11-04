import prisma from '../config/database.js';

export const createCampaign = async (campaignData) => {
  return await prisma.campaign.create({
    data: campaignData,
    select: {
      id: true,
      name: true,
      system: true,
      description: true,
      masterId: true,
      roomCode: true,
      createdAt: true,
      master: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const findCampaignsByUser = async (userId) => {
  return await prisma.campaign.findMany({
    where: {
      OR: [
        { masterId: userId },
        {
          campaignUsers: {
            some: {
              userId: userId
            }
          }
        }
      ]
    },
    select: {
      id: true,
      name: true,
      system: true,
      description: true,
      masterId: true,
      createdAt: true,
      master: {
        select: {
          id: true,
          name: true
        }
      },
      campaignUsers: {
        select: {
          role: true,
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
};

export const findCampaignById = async (id) => {
  return await prisma.campaign.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      system: true,
      description: true,
      masterId: true,
      roomCode: true,
      createdAt: true,
      master: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const updateCampaignById = async (id, updateData) => {
  return await prisma.campaign.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      system: true,
      description: true,
      masterId: true,
      roomCode: true,
      createdAt: true,
      master: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const deleteCampaignById = async (id) => {
  return await prisma.campaign.delete({
    where: { id }
  });
};

export const findCampaignByRoomCode = async (roomCode) => {
  return await prisma.campaign.findUnique({
    where: { roomCode },
    select: {
      id: true,
      name: true,
      system: true,
      description: true,
      masterId: true,
      roomCode: true,
      master: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

export const createCampaignInvite = async (inviteData) => {
  return await prisma.campaignInvite.create({
    data: inviteData,
    select: {
      id: true,
      email: true,
      token: true,
      expiresAt: true,
      createdAt: true,
      campaign: {
        select: {
          id: true,
          name: true,
          master: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
};

export const findInviteByToken = async (token) => {
  return await prisma.campaignInvite.findUnique({
    where: { token },
    select: {
      id: true,
      email: true,
      token: true,
      expiresAt: true,
      used: true,
      campaignId: true,
      campaign: {
        select: {
          id: true,
          name: true,
          system: true,
          master: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
};

export const markInviteAsUsed = async (inviteId) => {
  return await prisma.campaignInvite.update({
    where: { id: inviteId },
    data: { used: true }
  });
};

export const addUserToCampaign = async (campaignId, userId) => {
  return await prisma.campaignUser.create({
    data: {
      campaignId,
      userId,
      role: 'player'
    }
  });
};

export const checkUserInCampaign = async (campaignId, userId) => {
  // Verificar se é o mestre
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: { masterId: true }
  });
  
  if (campaign && campaign.masterId === userId) {
    return { role: 'master' };
  }

  // Verificar se é jogador
  return await prisma.campaignUser.findUnique({
    where: {
      campaignId_userId: {
        campaignId,
        userId
      }
    }
  });
};

export const removeUserFromCampaign = async (campaignId, userId) => {
  return await prisma.campaignUser.delete({
    where: {
      campaignId_userId: {
        campaignId,
        userId
      }
    }
  });
};

export const getCampaignPlayers = async (campaignId) => {
  // Buscar todos os usuários da campanha (incluindo o mestre)
  const campaignUsers = await prisma.campaignUser.findMany({
    where: {
      campaignId
    },
    select: {
      role: true,
      joinedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  // Buscar o mestre da campanha
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    select: {
      master: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  // Combinar os dados
  const players = campaignUsers.map(cu => ({
    id: cu.user.id,
    name: cu.user.name,
    email: cu.user.email,
    role: cu.role,
    joinedAt: cu.joinedAt
  }));

  // Adicionar o mestre se não estiver na lista
  if (campaign?.master) {
    const masterInList = players.find(p => p.id === campaign.master.id);
    if (!masterInList) {
      players.unshift({
        id: campaign.master.id,
        name: campaign.master.name,
        email: campaign.master.email,
        role: 'master',
        joinedAt: null
      });
    } else {
      // Atualizar o papel do mestre se ele estiver na lista
      masterInList.role = 'master';
    }
  }

  return players;
};