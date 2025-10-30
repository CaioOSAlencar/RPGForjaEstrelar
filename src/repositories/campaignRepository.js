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