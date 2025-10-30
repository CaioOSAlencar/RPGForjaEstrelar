import { validateCreateCampaign } from '../validadores/campaignValidator.js';
import { createCampaign, findCampaignsByUser } from '../repositories/campaignRepository.js';
import { ResponseHelper } from '../utils/responseHelper.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const createNewCampaign = asyncHandler(async (req, res) => {
  const { name, system, description } = req.body;
  const userId = req.user.userId;

  // Validações
  const validation = validateCreateCampaign({ name, system, description });
  if (!validation.isValid) {
    throw ApiError.badRequest('Dados inválidos', validation.errors.map(err => ({ message: err })));
  }

  // Criar campanha
  const campaign = await createCampaign({
    name: name.trim(),
    system: system?.trim() || 'D&D 5e',
    description: description?.trim() || null,
    masterId: userId
  });

  return ResponseHelper.created(res, campaign, 'Campanha criada com sucesso!');
});

export const listUserCampaigns = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const campaigns = await findCampaignsByUser(userId);

  return ResponseHelper.success(res, campaigns, 'Campanhas listadas com sucesso');
});