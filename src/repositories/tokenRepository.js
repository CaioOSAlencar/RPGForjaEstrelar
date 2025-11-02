import prisma from '../config/database.js';

export const createToken = async (tokenData) => {
  return await prisma.token.create({
    data: tokenData,
    select: {
      id: true,
      name: true,
      x: true,
      y: true,
      size: true,
      rotation: true,
      imageUrl: true,
      hp: true,
      maxHp: true,
      conditions: true,
      isVisible: true,
      sceneId: true,
      userId: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

export const findTokensByScene = async (sceneId) => {
  return await prisma.token.findMany({
    where: { sceneId },
    select: {
      id: true,
      name: true,
      x: true,
      y: true,
      size: true,
      rotation: true,
      imageUrl: true,
      hp: true,
      maxHp: true,
      conditions: true,
      isVisible: true,
      userId: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
};

export const findTokenById = async (id) => {
  return await prisma.token.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      x: true,
      y: true,
      size: true,
      rotation: true,
      imageUrl: true,
      hp: true,
      maxHp: true,
      conditions: true,
      isVisible: true,
      sceneId: true,
      userId: true,
      characterSheetId: true,
      createdAt: true,
      scene: {
        select: {
          id: true,
          name: true,
          campaign: {
            select: {
              id: true,
              masterId: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

export const updateToken = async (id, tokenData) => {
  return await prisma.token.update({
    where: { id },
    data: tokenData,
    select: {
      id: true,
      name: true,
      x: true,
      y: true,
      size: true,
      rotation: true,
      imageUrl: true,
      hp: true,
      maxHp: true,
      conditions: true,
      isVisible: true,
      userId: true
    }
  });
};

export const deleteToken = async (id) => {
  return await prisma.token.delete({
    where: { id }
  });
};

export const findTokensByUser = async (userId) => {
  return await prisma.token.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      hp: true,
      maxHp: true,
      scene: {
        select: {
          id: true,
          name: true,
          campaign: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};