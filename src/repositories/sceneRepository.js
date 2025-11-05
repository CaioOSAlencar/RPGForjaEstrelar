import prisma from '../config/database.js';

export const createScene = async (sceneData) => {
  return await prisma.scene.create({
    data: sceneData,
    select: {
      id: true,
      name: true,
      description: true,
      backgroundUrl: true,
      gridSize: true,
      gridColor: true,
      gridOpacity: true,
      width: true,
      height: true,
      snapToGrid: true,
      campaignId: true,
      createdAt: true,
      campaign: {
        select: {
          id: true,
          name: true,
          masterId: true
        }
      }
    }
  });
};

export const findScenesByCampaign = async (campaignId) => {
  return await prisma.scene.findMany({
    where: { campaignId },
    select: {
      id: true,
      name: true,
      description: true,
      backgroundUrl: true,
      gridSize: true,
      gridColor: true,
      gridOpacity: true,
      width: true,
      height: true,
      snapToGrid: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const findSceneById = async (id) => {
  return await prisma.scene.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      backgroundUrl: true,
      gridSize: true,
      gridColor: true,
      gridOpacity: true,
      width: true,
      height: true,
      snapToGrid: true,
      fogOfWarData: true,
      campaignId: true,
      createdAt: true,
      campaign: {
        select: {
          id: true,
          name: true,
          masterId: true,
          campaignUsers: {
            select: {
              userId: true
            }
          }
        }
      }
    }
  });
};

export const updateScene = async (id, sceneData) => {
  return await prisma.scene.update({
    where: { id },
    data: sceneData,
    select: {
      id: true,
      name: true,
      description: true,
      backgroundUrl: true,
      gridSize: true,
      gridColor: true,
      gridOpacity: true,
      width: true,
      height: true,
      snapToGrid: true,
      createdAt: true
    }
  });
};

export const deleteScene = async (id) => {
  return await prisma.scene.delete({
    where: { id }
  });
};