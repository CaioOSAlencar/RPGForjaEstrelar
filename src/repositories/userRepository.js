import prisma from '../config/database.js';

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
};

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });
};

export const updateUser = async (id, userData) => {
  return await prisma.user.update({
    where: { id },
    data: userData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true
    }
  });
};