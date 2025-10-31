import { campaignExportRepository } from '../repositories/campaignExportRepository.js';
import { findCampaignById } from '../repositories/campaignRepository.js';
import { validateImportCampaign } from '../validadores/campaignExportValidator.js';
import { sendResponse, sendError } from '../utils/messages.js';
import asyncHandler from 'express-async-handler';

// RF26 - Exportar campanha em JSON
export const exportCampaign = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const userId = req.user.id;

  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  if (campaign.masterId !== userId) {
    return sendError(res, 403, 'Apenas o mestre pode exportar a campanha');
  }

  const campaignData = await campaignExportRepository.exportCampaign(campaignId);
  
  // Remover dados sensíveis
  const exportData = {
    ...campaignData,
    master: undefined,
    campaignUsers: undefined,
    chatMessages: undefined, // Chat não é exportado por questões de privacidade
    exportedAt: new Date().toISOString(),
    exportedBy: req.user.name
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="campanha-${campaignData.name.replace(/[^a-zA-Z0-9]/g, '-')}.json"`);
  
  return res.json(exportData);
});

// RF27 - Importar campanha de JSON
export const importCampaign = asyncHandler(async (req, res) => {
  const validation = validateImportCampaign(req.body);
  if (!validation.isValid) {
    return sendError(res, 400, 'Dados inválidos', validation.errors);
  }

  const userId = req.user.id;
  const campaignData = req.body;

  try {
    const newCampaign = await campaignExportRepository.importCampaign(campaignData, userId);
    
    return sendResponse(res, 201, { 
      data: newCampaign, 
      message: `Campanha "${campaignData.name}" importada com sucesso!` 
    });
  } catch (error) {
    console.error('Erro ao importar campanha:', error);
    return sendError(res, 500, 'Erro ao importar campanha', [error.message]);
  }
});