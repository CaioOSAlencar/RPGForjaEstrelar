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

// RF15 - Rotacionar token
const rotateToken = asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  const { rotation } = req.body;
  const userId = req.user.id;

  const token = await tokenRepository.findTokenById(tokenId);
  if (!token) {
    return sendError(res, 404, 'Token não encontrado');
  }

  if (req.user.role !== 'master' && token.userId !== userId) {
    return sendError(res, 403, 'Sem permissão para rotacionar este token');
  }

  const updatedToken = await tokenRepository.updateToken(tokenId, { rotation });

  socketManager.emitToScene(token.sceneId, 'token-rotated', {
    tokenId,
    rotation,
    rotatedBy: userId,
    token: updatedToken
  });

  return sendResponse(res, 200, { data: updatedToken, message: 'Token rotacionado com sucesso' });
});

// RF15 - Redimensionar token
const resizeToken = asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  const { size } = req.body;
  const userId = req.user.id;

  const token = await tokenRepository.findTokenById(tokenId);
  if (!token) {
    return sendError(res, 404, 'Token não encontrado');
  }

  if (req.user.role !== 'master' && token.userId !== userId) {
    return sendError(res, 403, 'Sem permissão para redimensionar este token');
  }

  const updatedToken = await tokenRepository.updateToken(tokenId, { size });

  socketManager.emitToScene(token.sceneId, 'token-resized', {
    tokenId,
    size,
    resizedBy: userId,
    token: updatedToken
  });

  return sendResponse(res, 200, { data: updatedToken, message: 'Token redimensionado com sucesso' });
});

export default {
  moveToken,
  rotateToken,
  resizeToken
};