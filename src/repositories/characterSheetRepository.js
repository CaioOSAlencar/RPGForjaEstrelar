import prisma from '../config/database.js';

// RF18 - Criar ficha de personagem
export const createCharacterSheet = async (sheetData) => {
  return await prisma.characterSheet.create({
    data: sheetData,
    select: {
      id: true,
      name: true,
      class: true,
      level: true,
      data: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true
        }
      },
      campaign: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

// Buscar fichas por campanha
export const findSheetsByCampaign = async (campaignId) => {
  return await prisma.characterSheet.findMany({
    where: { campaignId },
    select: {
      id: true,
      name: true,
      class: true,
      level: true,
      data: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

// Buscar ficha por ID
export const findSheetById = async (id) => {
  return await prisma.characterSheet.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      class: true,
      level: true,
      data: true,
      userId: true,
      campaignId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true
        }
      },
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

// Atualizar ficha
export const updateCharacterSheet = async (id, updateData) => {
  return await prisma.characterSheet.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      class: true,
      level: true,
      data: true,
      updatedAt: true
    }
  });
};

// Deletar ficha
export const deleteCharacterSheet = async (id) => {
  return await prisma.characterSheet.delete({
    where: { id }
  });
};