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
import { ResponseHelper } from '../utils/responseHelper.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

// RF13 - Criar token com upload de imagem
export const createNewToken = asyncHandler(async (req, res) => {
  const { name, sceneId, size, hp, maxHp } = req.body;
  const userId = req.user.userId;

  // Validações
  const validation = validateCreateToken({ name, sceneId, size, hp, maxHp });
  if (!validation.isValid) {
    throw ApiError.badRequest('Dados inválidos', validation.errors.map(err => ({ message: err })));
  }

  // Verificar se cena existe e se usuário pode adicionar tokens
  const scene = await findSceneById(parseInt(sceneId));
  if (!scene) {
    throw ApiError.notFound('Cena não encontrada');
  }

  // Por enquanto, apenas o mestre pode criar tokens
  // TODO: Permitir que jogadores criem seus próprios tokens
  if (scene.campaign.masterId !== userId) {
    throw ApiError.forbidden('Apenas o mestre pode criar tokens nesta cena');
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

  return ResponseHelper.created(res, token, 'Token criado com sucesso!');
});

// Listar tokens de uma cena
export const listSceneTokens = asyncHandler(async (req, res) => {
  const { sceneId } = req.params;
  const userId = req.user.userId;

  // Verificar se cena existe
  const scene = await findSceneById(parseInt(sceneId));
  if (!scene) {
    throw ApiError.notFound('Cena não encontrada');
  }

  // TODO: Verificar se usuário participa da campanha
  // Por enquanto, apenas mestre pode ver todos os tokens
  if (scene.campaign.masterId !== userId) {
    throw ApiError.forbidden('Apenas participantes da campanha podem ver os tokens');
  }

  // Buscar tokens da cena
  const tokens = await findTokensByScene(parseInt(sceneId));

  return ResponseHelper.success(res, tokens, 'Tokens listados com sucesso');
});

// Obter detalhes de um token
export const getTokenDetails = asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  const userId = req.user.userId;

  // Buscar token
  const token = await findTokenById(parseInt(tokenId));
  if (!token) {
    throw ApiError.notFound('Token não encontrado');
  }

  // Verificar se usuário pode acessar (mestre ou dono do token)
  if (token.scene.campaign.masterId !== userId && token.userId !== userId) {
    throw ApiError.forbidden('Você não tem permissão para acessar este token');
  }

  return ResponseHelper.success(res, token, 'Detalhes do token obtidos com sucesso');
});

// RF14/RF15 - Atualizar posição, rotação e propriedades do token
export const updateTokenProperties = asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  const { name, x, y, size, rotation, hp, maxHp, conditions, isVisible } = req.body;
  const userId = req.user.userId;

  // Validações
  const validation = validateUpdateToken({ name, x, y, size, rotation, hp, maxHp, conditions, isVisible });
  if (!validation.isValid) {
    throw ApiError.badRequest('Dados inválidos', validation.errors.map(err => ({ message: err })));
  }

  // Buscar token
  const token = await findTokenById(parseInt(tokenId));
  if (!token) {
    throw ApiError.notFound('Token não encontrado');
  }

  // Verificar se usuário pode editar (mestre ou dono do token)
  if (token.scene.campaign.masterId !== userId && token.userId !== userId) {
    throw ApiError.forbidden('Você não tem permissão para editar este token');
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

  return ResponseHelper.success(res, updatedToken, 'Token atualizado com sucesso!');
});

// RF45 - Deletar token
export const deleteTokenById = asyncHandler(async (req, res) => {
  const { tokenId } = req.params;
  const userId = req.user.userId;

  // Buscar token
  const token = await findTokenById(parseInt(tokenId));
  if (!token) {
    throw ApiError.notFound('Token não encontrado');
  }

  // Verificar se usuário pode deletar (mestre ou dono do token)
  if (token.scene.campaign.masterId !== userId && token.userId !== userId) {
    throw ApiError.forbidden('Você não tem permissão para deletar este token');
  }

  // Deletar arquivo de imagem se existir
  if (token.imageUrl) {
    // TODO: Implementar deleção do arquivo físico
  }

  // Deletar token
  await deleteToken(parseInt(tokenId));

  return ResponseHelper.success(res, null, 'Token deletado com sucesso');
});

// Listar tokens do usuário
export const listUserTokens = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // Buscar tokens do usuário
  const tokens = await findTokensByUser(userId);

  return ResponseHelper.success(res, tokens, 'Seus tokens listados com sucesso');
});