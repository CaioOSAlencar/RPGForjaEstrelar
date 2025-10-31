import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const diceMacroRepository = {
  async create(data) {
    return await prisma.diceMacro.create({
      data,
      include: {
        characterSheet: { 
          select: { id: true, name: true, userId: true } 
        }
      }
    });
  },

  async findById(id) {
    return await prisma.diceMacro.findUnique({
      where: { id: parseInt(id) },
      include: {
        characterSheet: { 
          select: { id: true, name: true, userId: true } 
        }
      }
    });
  },

  async findByCharacterSheet(characterSheetId) {
    return await prisma.diceMacro.findMany({
      where: { characterSheetId: parseInt(characterSheetId) },
      orderBy: { name: 'asc' }
    });
  },

  async update(id, data) {
    return await prisma.diceMacro.update({
      where: { id: parseInt(id) },
      data,
      include: {
        characterSheet: { 
          select: { id: true, name: true, userId: true } 
        }
      }
    });
  },

  async delete(id) {
    return await prisma.diceMacro.delete({
      where: { id: parseInt(id) }
    });
  }
};