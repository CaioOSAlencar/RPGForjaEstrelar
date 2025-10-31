import { validateCreateToken, validateUpdateToken } from '../validadores/tokenValidator.js';
import { 
  createToken, 
  findTokensByScene, 
  findTokenById,
  updateToken,
  deleteToken,
  findTokensByUser
} from '../repositories/tokenRepository.js';
import { findSceneById } from '../repositories/sceneRepository.js';
import { sendResponse, sendError } from '../utils/messages.js';
import asyncHandler from 'express-async-handler';

// RF13 - Criar token com upload de imagem
export const createNewToken = asyncHandler(async (req, res) => {
  const { name, sceneId, size, hp, maxHp } = req.body;
  const userId = req.user.id;

  // Validações
  const validation = validateCreateToken({ name, sceneId, size, hp, maxHp });
  if (!validation.isValid) {
    return sendError(res, 400, validation.errors);
  }

  // Verificar se cena existe e se usuário pode adicionar tokens
  const scene = await findSceneById(parseInt(sceneId));
  if (!scene) {
    return sendError(res, 404, 'Cena não encontrada');
  }

  // Por enquanto, apenas o mestre pode criar tokens
  // TODO: Permitir que jogadores criem seus próprios tokens
  if (scene.campaign.masterId !== userId) {
    return sendError(res, 403, 'Apenas o mestre pode criar tokens nesta cena');
  }

  // Preparar dados do token
  const tokenData = {
    name: name.trim(),
    sceneId: parseInt(sceneId),
    userId: userId,
    x: 0, // Posição inicial
    y: 0,
    size: size ? parseInt(size) : 1,
    rotation: 0,
    hp: hp ? parseInt(hp) : null,
    maxHp: maxHp ? parseInt(maxHp) : null,
    conditions: null,
    isVisible: true
  };

  // Se foi enviada uma imagem
  if (req.file) {
    tokenData.imageUrl = `/uploads/tokens/${req.file.filename}`;
  }

  // Criar token
  const token = await createToken(tokenData);

  return sendResponse(res, 201, { data: token, message: 'Token criado com sucesso!' });
});

// Listar tokens de uma cena
export const listSceneTokens = asyncHandler(async (req, res) => {
  const { sceneId } = req.params;
  const userId = req.user.id;

  // Verificar se cena existe
  const scene = await findSceneById(parseInt(sceneId));
  if (!scene) {
    return sendError(res, 404, 'Cena não encontrada');
  }

  // TODO: Verificar se usuário participa da campanha
  // Por enquanto, apenas mestre pode ver todos os tokens
  if (scene.campaign.masterId !== userId) {
    return sendError(res, 403, 'Apenas participantes da campanha podem ver os tokens');
  }

  // Buscar tokens da cena
  const tokens = await findTokensByScene(parseInt(sceneId));

  return sendResponse(res, 200, { data: tokens, message: 'Tokens listados com sucesso' });
});

// Obter detalhes de um token
export const getTokenDetails = asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  const userId = req.user.id;

  // Buscar token
  const token = await findTokenById(parseInt(tokenId));
  if (!token) {
    return sendError(res, 404, 'Token não encontrado');
  }

  // Verificar se usuário pode acessar (mestre ou dono do token)
  if (token.scene.campaign.masterId !== userId && token.userId !== userId) {
    return sendError(res, 403, 'Você não tem permissão para acessar este token');
  }

  return sendResponse(res, 200, { data: token, message: 'Detalhes do token obtidos com sucesso' });
});

// RF14/RF15 - Atualizar posição, rotação e propriedades do token
export const updateTokenProperties = asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  const { name, x, y, size, rotation, hp, maxHp, conditions, isVisible } = req.body;
  const userId = req.user.id;

  // Validações
  const validation = validateUpdateToken({ name, x, y, size, rotation, hp, maxHp, conditions, isVisible });
  if (!validation.isValid) {
    return sendError(res, 400, validation.errors);
  }

  // Buscar token
  const token = await findTokenById(parseInt(tokenId));
  if (!token) {
    return sendError(res, 404, 'Token não encontrado');
  }

  // Verificar se usuário pode editar (mestre ou dono do token)
  if (token.scene.campaign.masterId !== userId && token.userId !== userId) {
    return sendError(res, 403, 'Você não tem permissão para editar este token');
  }

  // Preparar dados para atualização
  const updateData = {};
  
  if (name !== undefined) updateData.name = name.trim();
  if (x !== undefined) updateData.x = parseFloat(x);
  if (y !== undefined) updateData.y = parseFloat(y);
  if (size !== undefined) updateData.size = parseInt(size);
  if (rotation !== undefined) updateData.rotation = parseFloat(rotation);
  if (hp !== undefined) updateData.hp = parseInt(hp);
  if (maxHp !== undefined) updateData.maxHp = parseInt(maxHp);
  if (conditions !== undefined) updateData.conditions = conditions;
  if (isVisible !== undefined) updateData.isVisible = isVisible;

  // Atualizar token
  const updatedToken = await updateToken(parseInt(tokenId), updateData);

  return sendResponse(res, 200, { data: updatedToken, message: 'Token atualizado com sucesso!' });
});

// RF45 - Deletar token
export const deleteTokenById = asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  const userId = req.user.id;

  // Buscar token
  const token = await findTokenById(parseInt(tokenId));
  if (!token) {
    return sendError(res, 404, 'Token não encontrado');
  }

  // Verificar se usuário pode deletar (mestre ou dono do token)
  if (token.scene.campaign.masterId !== userId && token.userId !== userId) {
    return sendError(res, 403, 'Você não tem permissão para deletar este token');
  }

  // Deletar token
  await deleteToken(parseInt(tokenId));

  return sendResponse(res, 200, { data: null, message: 'Token deletado com sucesso' });
});

// Listar tokens do usuário
export const listUserTokens = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Buscar tokens do usuário
  const tokens = await findTokensByUser(userId);

  return sendResponse(res, 200, { data: tokens, message: 'Seus tokens listados com sucesso' });
});