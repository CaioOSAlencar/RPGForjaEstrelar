import { validateCreateScene, validateUpdateScene } from '../validadores/sceneValidator.js';
import { 
  createScene, 
  findScenesByCampaign, 
  findSceneById,
  updateScene,
  deleteScene
} from '../repositories/sceneRepository.js';
import { findCampaignById } from '../repositories/campaignRepository.js';
import { ResponseHelper } from '../utils/responseHelper.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import path from 'path';

// RF11 - Criar cena com upload de imagem
export const createNewScene = asyncHandler(async (req, res) => {
  const { name, campaignId } = req.body;
  const userId = req.user.userId;

  // Validações
  const validation = validateCreateScene({ name, campaignId });
  if (!validation.isValid) {
    throw ApiError.badRequest('Dados inválidos', validation.errors.map(err => ({ message: err })));
  }

  // Verificar se campanha existe e se usuário é o mestre
  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    throw ApiError.notFound('Campanha não encontrada');
  }

  if (campaign.masterId !== userId) {
    throw ApiError.forbidden('Apenas o mestre pode criar cenas');
  }

  // Preparar dados da cena
  const sceneData = {
    name: name.trim(),
    campaignId: parseInt(campaignId),
    gridSize: 50, // Padrão
    gridColor: '#000000', // Preto padrão
    snapToGrid: true
  };

  // Se foi enviada uma imagem
  if (req.file) {
    sceneData.backgroundUrl = `/uploads/scenes/${req.file.filename}`;
  }

  // Criar cena
  const scene = await createScene(sceneData);

  return ResponseHelper.created(res, scene, 'Cena criada com sucesso!');
});

// Listar cenas da campanha
export const listCampaignScenes = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const userId = req.user.userId;

  // Verificar se campanha existe e se usuário participa
  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    throw ApiError.notFound('Campanha não encontrada');
  }

  // TODO: Verificar se usuário participa da campanha (mestre ou jogador)
  // Por enquanto, apenas mestre pode ver cenas
  if (campaign.masterId !== userId) {
    throw ApiError.forbidden('Apenas participantes da campanha podem ver as cenas');
  }

  // Buscar cenas da campanha
  const scenes = await findScenesByCampaign(parseInt(campaignId));

  return ResponseHelper.success(res, scenes, 'Cenas listadas com sucesso');
});

// Obter detalhes de uma cena
export const getSceneDetails = asyncHandler(async (req, res) => {
  const { sceneId } = req.params;
  const userId = req.user.userId;

  // Buscar cena
  const scene = await findSceneById(parseInt(sceneId));
  if (!scene) {
    throw ApiError.notFound('Cena não encontrada');
  }

  // Verificar se usuário pode acessar (mestre da campanha)
  if (scene.campaign.masterId !== userId) {
    throw ApiError.forbidden('Apenas o mestre pode acessar os detalhes da cena');
  }

  return ResponseHelper.success(res, scene, 'Detalhes da cena obtidos com sucesso');
});

// RF12 - Atualizar configurações da cena (grid, etc)
export const updateSceneSettings = asyncHandler(async (req, res) => {
  const { sceneId } = req.params;
  const { name, gridSize, gridColor, snapToGrid } = req.body;
  const userId = req.user.userId;

  // Validações
  const validation = validateUpdateScene({ name, gridSize, gridColor, snapToGrid });
  if (!validation.isValid) {
    throw ApiError.badRequest('Dados inválidos', validation.errors.map(err => ({ message: err })));
  }

  // Buscar cena
  const scene = await findSceneById(parseInt(sceneId));
  if (!scene) {
    throw ApiError.notFound('Cena não encontrada');
  }

  // Verificar se usuário é o mestre
  if (scene.campaign.masterId !== userId) {
    throw ApiError.forbidden('Apenas o mestre pode editar a cena');
  }

  // Preparar dados para atualização
  const updateData = {};
  
  if (name !== undefined) updateData.name = name.trim();
  if (gridSize !== undefined) updateData.gridSize = parseInt(gridSize);
  if (gridColor !== undefined) updateData.gridColor = gridColor;
  if (snapToGrid !== undefined) updateData.snapToGrid = snapToGrid;

  // Atualizar cena
  const updatedScene = await updateScene(parseInt(sceneId), updateData);

  return ResponseHelper.success(res, updatedScene, 'Cena atualizada com sucesso!');
});

// RF45 - Deletar cena
export const deleteSceneById = asyncHandler(async (req, res) => {
  const { sceneId } = req.params;
  const userId = req.user.userId;

  // Buscar cena
  const scene = await findSceneById(parseInt(sceneId));
  if (!scene) {
    throw ApiError.notFound('Cena não encontrada');
  }

  // Verificar se usuário é o mestre
  if (scene.campaign.masterId !== userId) {
    throw ApiError.forbidden('Apenas o mestre pode deletar a cena');
  }

  // Deletar arquivo de imagem se existir
  if (scene.backgroundUrl) {
    // TODO: Implementar deleção do arquivo físico
  }

  // Deletar cena
  await deleteScene(parseInt(sceneId));

  return ResponseHelper.success(res, null, 'Cena deletada com sucesso');
});