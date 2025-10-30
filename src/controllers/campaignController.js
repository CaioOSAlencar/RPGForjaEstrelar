import { validateCreateCampaign, validateInviteByEmail, validateJoinByCode } from '../validadores/campaignValidator.js';
import { 
  createCampaign, 
  findCampaignsByUser, 
  findCampaignById,
  findCampaignByRoomCode,
  createCampaignInvite,
  findInviteByToken,
  markInviteAsUsed,
  addUserToCampaign,
  checkUserInCampaign,
  removeUserFromCampaign,
  getCampaignPlayers
} from '../repositories/campaignRepository.js';
import { ResponseHelper } from '../utils/responseHelper.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { generateInviteToken, generateRoomCode } from '../utils/generateToken.js';

export const createNewCampaign = asyncHandler(async (req, res) => {
  const { name, system, description } = req.body;
  const userId = req.user.userId;

  // Validações
  const validation = validateCreateCampaign({ name, system, description });
  if (!validation.isValid) {
    throw ApiError.badRequest('Dados inválidos', validation.errors.map(err => ({ message: err })));
  }

  // Criar campanha com código de sala único
  const campaign = await createCampaign({
    name: name.trim(),
    system: system?.trim() || 'D&D 5e',
    description: description?.trim() || null,
    masterId: userId,
    roomCode: generateRoomCode()
  });

  return ResponseHelper.created(res, campaign, 'Campanha criada com sucesso!');
});

export const listUserCampaigns = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const campaigns = await findCampaignsByUser(userId);

  return ResponseHelper.success(res, campaigns, 'Campanhas listadas com sucesso');
});

// RF08 - Convidar jogador por email
export const invitePlayerByEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const { campaignId } = req.params;
  const userId = req.user.userId;

  // Validações
  const validation = validateInviteByEmail({ email });
  if (!validation.isValid) {
    throw ApiError.badRequest('Dados inválidos', validation.errors.map(err => ({ message: err })));
  }

  // Verificar se campanha existe e se usuário é o mestre
  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    throw ApiError.notFound('Campanha não encontrada');
  }

  if (campaign.masterId !== userId) {
    throw ApiError.forbidden('Apenas o mestre pode convidar jogadores');
  }

  // Criar convite
  const invite = await createCampaignInvite({
    campaignId: campaign.id,
    email: email.toLowerCase(),
    token: generateInviteToken(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
  });

  return ResponseHelper.created(res, {
    inviteLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invite/${invite.token}`,
    email: invite.email,
    expiresAt: invite.expiresAt
  }, 'Convite criado com sucesso!');
});

// RF08 - Gerar link compartilhável
export const getShareableLink = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const userId = req.user.userId;

  // Verificar se campanha existe e se usuário é o mestre
  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    throw ApiError.notFound('Campanha não encontrada');
  }

  if (campaign.masterId !== userId) {
    throw ApiError.forbidden('Apenas o mestre pode gerar links compartilháveis');
  }

  return ResponseHelper.success(res, {
    shareLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/join/${campaign.roomCode}`,
    roomCode: campaign.roomCode,
    campaignName: campaign.name
  }, 'Link compartilhável gerado com sucesso');
});

// RF09 - Aceitar convite por token
export const acceptInvite = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const userId = req.user.userId;

  // Buscar convite
  const invite = await findInviteByToken(token);
  if (!invite) {
    throw ApiError.notFound('Convite não encontrado ou inválido');
  }

  // Verificar se convite não expirou
  if (new Date() > invite.expiresAt) {
    throw ApiError.badRequest('Convite expirado');
  }

  // Verificar se convite já foi usado
  if (invite.used) {
    throw ApiError.badRequest('Convite já foi utilizado');
  }

  // Verificar se usuário já está na campanha
  const existingUser = await checkUserInCampaign(invite.campaignId, userId);
  if (existingUser) {
    throw ApiError.conflict('Usuário já participa desta campanha');
  }

  // Adicionar usuário à campanha
  await addUserToCampaign(invite.campaignId, userId);
  
  // Marcar convite como usado
  await markInviteAsUsed(invite.id);

  return ResponseHelper.success(res, {
    campaign: invite.campaign
  }, 'Convite aceito com sucesso! Você agora faz parte da campanha.');
});

// RF09 - Entrar na campanha por código
export const joinByRoomCode = asyncHandler(async (req, res) => {
  const { roomCode } = req.body;
  const userId = req.user.userId;

  // Validações
  const validation = validateJoinByCode({ roomCode });
  if (!validation.isValid) {
    throw ApiError.badRequest('Dados inválidos', validation.errors.map(err => ({ message: err })));
  }

  // Buscar campanha pelo código
  const campaign = await findCampaignByRoomCode(roomCode.toUpperCase());
  if (!campaign) {
    throw ApiError.notFound('Campanha não encontrada com este código');
  }

  // Verificar se usuário já está na campanha
  const existingUser = await checkUserInCampaign(campaign.id, userId);
  if (existingUser) {
    throw ApiError.conflict('Você já participa desta campanha');
  }

  // Adicionar usuário à campanha
  await addUserToCampaign(campaign.id, userId);

  return ResponseHelper.success(res, {
    campaign
  }, 'Você entrou na campanha com sucesso!');
});

// RF43 - Remover jogador da campanha
export const removePlayer = asyncHandler(async (req, res) => {
  const { campaignId, playerId } = req.params;
  const userId = req.user.userId;

  // Verificar se campanha existe e se usuário é o mestre
  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    throw ApiError.notFound('Campanha não encontrada');
  }

  if (campaign.masterId !== userId) {
    throw ApiError.forbidden('Apenas o mestre pode remover jogadores');
  }

  // Verificar se o jogador está na campanha
  const playerInCampaign = await checkUserInCampaign(parseInt(campaignId), parseInt(playerId));
  if (!playerInCampaign) {
    throw ApiError.notFound('Jogador não encontrado nesta campanha');
  }

  // Não permitir remover o próprio mestre
  if (parseInt(playerId) === userId) {
    throw ApiError.badRequest('O mestre não pode se remover da própria campanha');
  }

  // Remover jogador da campanha
  await removeUserFromCampaign(parseInt(campaignId), parseInt(playerId));

  return ResponseHelper.success(res, null, 'Jogador removido da campanha com sucesso');
});

// Listar jogadores da campanha
export const listCampaignPlayers = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const userId = req.user.userId;

  // Verificar se campanha existe e se usuário é o mestre
  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    throw ApiError.notFound('Campanha não encontrada');
  }

  if (campaign.masterId !== userId) {
    throw ApiError.forbidden('Apenas o mestre pode listar jogadores');
  }

  // Buscar jogadores da campanha
  const players = await getCampaignPlayers(parseInt(campaignId));

  return ResponseHelper.success(res, players, 'Jogadores listados com sucesso');
});