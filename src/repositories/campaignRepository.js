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
  return await prisma.campaignUser.findMany({
    where: {
      campaignId,
      role: 'player'
    },
    select: {
      userId: true,
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
};