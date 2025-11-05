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
import { checkUserInCampaign } from '../repositories/campaignRepository.js';
import { sendResponse, sendError } from '../utils/messages.js';
import socketManager from '../utils/socketManager.js';
import { validateConditions, processConditionsForDisplay, getAllConditions } from '../utils/conditionsManager.js';
import asyncHandler from 'express-async-handler';

// RF13 - Criar token com upload de imagem
export const createNewToken = asyncHandler(async (req, res) => {
  const { name, sceneId, size, hp, maxHp } = req.body;
  const userId = req.user.userId;

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

  // Temporariamente permitir qualquer usuário autenticado
  // TODO: Implementar verificação de participação na campanha
  console.log('Usuario:', userId, 'Mestre:', scene.campaign.masterId, 'Participantes:', scene.campaign.campaignUsers);

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
    tokenData.imageUrl = `http://localhost:3000/uploads/tokens/${req.file.filename}`;
  }

  // Criar token
  const token = await createToken(tokenData);

  return sendResponse(res, 201, { data: token, message: 'Token criado com sucesso!' });
});

// Listar tokens de uma cena
export const listSceneTokens = asyncHandler(async (req, res) => {
  const { sceneId } = req.params;
  const userId = req.user.userId;

  // Verificar se cena existe
  const scene = await findSceneById(parseInt(sceneId));
  if (!scene) {
    return sendError(res, 404, 'Cena não encontrada');
  }

  // Verificar se usuário participa da campanha (mestre ou jogador)
  const userInCampaign = await checkUserInCampaign(scene.campaignId, userId);
  if (scene.campaign.masterId !== userId && !userInCampaign) {
    return sendError(res, 403, 'Apenas participantes da campanha podem ver os tokens');
  }

  // Buscar tokens da cena
  const tokens = await findTokensByScene(parseInt(sceneId));

  return sendResponse(res, 200, { data: tokens, message: 'Tokens listados com sucesso' });
});

// Obter detalhes de um token
export const getTokenDetails = asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  const userId = req.user.userId;

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
  const userId = req.user.userId;

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
  const userId = req.user.userId;

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
  const userId = req.user.userId;

  // Buscar tokens do usuário
  const tokens = await findTokensByUser(userId);

  return sendResponse(res, 200, { data: tokens, message: 'Seus tokens listados com sucesso' });
});

// RF16 - Vincular token à ficha de personagem
export const linkTokenToSheet = asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  const { characterSheetId } = req.body;
  const userId = req.user.userId;

  const token = await findTokenById(parseInt(tokenId));
  if (!token) {
    return sendError(res, 404, 'Token não encontrado');
  }

  // Verificar se usuário é o mestre da campanha
  if (token.scene.campaign.masterId !== userId) {
    return sendError(res, 403, 'Apenas o mestre pode vincular tokens');
  }

  // Se characterSheetId for null, desvincular
  const updateData = { characterSheetId: characterSheetId ? parseInt(characterSheetId) : null };
  
  const updatedToken = await updateToken(parseInt(tokenId), updateData);

  return sendResponse(res, 200, { 
    data: updatedToken, 
    message: characterSheetId ? 'Token vinculado à ficha!' : 'Token desvinculado da ficha!' 
  });
});

// RF17 - Atualizar HP do token em tempo real
export const updateTokenHP = asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  const { hp, maxHp } = req.body;
  const userId = req.user.userId;

  if (hp === undefined && maxHp === undefined) {
    return sendError(res, 400, 'HP atual ou máximo deve ser fornecido');
  }

  const token = await findTokenById(parseInt(tokenId));
  if (!token) {
    return sendError(res, 404, 'Token não encontrado');
  }

  // Verificar permissões: mestre ou dono do token
  if (token.scene.campaign.masterId !== userId && token.userId !== userId) {
    return sendError(res, 403, 'Você não tem permissão para alterar o HP deste token');
  }

  const updateData = {};
  if (hp !== undefined) updateData.hp = parseInt(hp);
  if (maxHp !== undefined) updateData.maxHp = parseInt(maxHp);

  const updatedToken = await updateToken(parseInt(tokenId), updateData);

  // Emitir evento WebSocket para atualização em tempo real
  socketManager.emitToScene(token.sceneId, 'token-hp-updated', {
    tokenId: parseInt(tokenId),
    hp: updatedToken.hp,
    maxHp: updatedToken.maxHp,
    updatedBy: userId
  });

  return sendResponse(res, 200, { 
    data: updatedToken, 
    message: 'HP do token atualizado com sucesso!' 
  });
});

// RF37 - Atualizar condições do token
export const updateTokenConditions = asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  const { conditions } = req.body;
  const userId = req.user.userId;

  const token = await findTokenById(parseInt(tokenId));
  if (!token) {
    return sendError(res, 404, 'Token não encontrado');
  }

  // Verificar permissões: mestre ou dono do token
  if (token.scene.campaign.masterId !== userId && token.userId !== userId) {
    return sendError(res, 403, 'Você não tem permissão para alterar as condições deste token');
  }

  // Validar formato das condições
  let conditionsData = conditions || [];
  if (typeof conditions === 'string') {
    try {
      conditionsData = JSON.parse(conditions);
    } catch (error) {
      return sendError(res, 400, 'Formato de condições inválido');
    }
  }

  const validation = validateConditions(conditionsData);
  if (!validation.isValid) {
    return sendError(res, 400, validation.error);
  }

  const updatedToken = await updateToken(parseInt(tokenId), { 
    conditions: JSON.stringify(conditionsData) 
  });

  // Emitir evento WebSocket para atualização em tempo real
  socketManager.emitToScene(token.sceneId, 'token-conditions-updated', {
    tokenId: parseInt(tokenId),
    conditions: conditionsData,
    updatedBy: userId
  });

  return sendResponse(res, 200, { 
    data: updatedToken, 
    message: 'Condições do token atualizadas com sucesso!' 
  });
});

// RF37 - Listar condições disponíveis
export const getAvailableConditions = asyncHandler(async (req, res) => {
  const conditions = getAllConditions();
  return sendResponse(res, 200, { 
    data: conditions, 
    message: 'Condições disponíveis listadas com sucesso' 
  });
});

// Adicionar token existente ao mapa
export const addTokenToMap = asyncHandler(async (req, res) => {
  const { sceneId } = req.params;
  const { tokenId, x, y } = req.body;
  const userId = req.user.userId;

  // Verificar se cena existe
  const scene = await findSceneById(parseInt(sceneId));
  if (!scene) {
    return sendError(res, 404, 'Cena não encontrada');
  }

  // Buscar o token original se tokenId foi fornecido
  let tokenData = {
    name: `Token ${Date.now()}`,
    imageUrl: `http://localhost:3000/uploads/tokens/default.png`
  };
  
  if (tokenId) {
    const originalToken = await findTokenById(parseInt(tokenId));
    if (originalToken) {
      tokenData.name = originalToken.name;
      tokenData.imageUrl = originalToken.imageUrl;
    }
  }

  // Criar token no mapa
  const mapTokenData = {
    sceneId: parseInt(sceneId),
    userId: userId,
    x: x || 100,
    y: y || 100,
    size: 1,
    rotation: 0,
    hp: 100,
    maxHp: 100,
    conditions: null,
    isVisible: true,
    name: tokenData.name,
    imageUrl: tokenData.imageUrl
  };

  const mapToken = await createToken(mapTokenData);
  return sendResponse(res, 201, { data: mapToken, message: 'Token adicionado ao mapa!' });
});