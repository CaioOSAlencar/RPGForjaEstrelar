import asyncHandler from 'express-async-handler';
import { sendResponse, sendError } from '../utils/messages.js';
import * as tokenRepository from '../repositories/tokenRepository.js';
import socketManager from '../utils/socketManager.js';

// RF14 - Mover token em tempo real
const moveToken = asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  const { x, y } = req.body;
  const userId = req.user.id;

  const token = await tokenRepository.findTokenById(tokenId);
  if (!token) {
    return sendError(res, 404, 'Token não encontrado');
  }

  // Verificar permissões (mestre ou dono do token)
  if (req.user.role !== 'master' && token.userId !== userId) {
    return sendError(res, 403, 'Sem permissão para mover este token');
  }

  const updatedToken = await tokenRepository.updateToken(tokenId, { x, y });

  // Emitir evento WebSocket para outros usuários na cena
  socketManager.emitToScene(token.sceneId, 'token-moved', {
    tokenId,
    x,
    y,
    movedBy: userId,
    token: updatedToken
  });

  return sendResponse(res, 200, { data: updatedToken, message: 'Token movido com sucesso' });
});

export default {
  moveToken
};