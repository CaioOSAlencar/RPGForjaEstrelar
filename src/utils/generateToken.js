import { randomBytes } from 'crypto';

export const generateInviteToken = () => {
  return randomBytes(32).toString('hex');
};

export const generateRoomCode = () => {
  // Gera código de 6 caracteres alfanuméricos
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};