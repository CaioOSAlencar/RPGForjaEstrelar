import { validateCreateSheet, validateUpdateSheet } from '../validadores/characterSheetValidator.js';
import {
  createCharacterSheet,
  findSheetsByCampaign,
  findSheetById,
  updateCharacterSheet,
  deleteCharacterSheet
} from '../repositories/characterSheetRepository.js';
import { findCampaignById } from '../repositories/campaignRepository.js';
import { sendResponse, sendError } from '../utils/messages.js';
import { rollSheetDice } from '../utils/sheetDiceRoller.js';
import { getTemplateForSystem } from '../utils/sheetTemplates.js';
import asyncHandler from 'express-async-handler';

// RF18 - Criar ficha de personagem
export const createSheet = asyncHandler(async (req, res) => {
  const { name, class: characterClass, level, data, campaignId, useTemplate } = req.body;
  const userId = req.user.id;

  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  // TODO: Verificar se usuário participa da campanha
  if (campaign.masterId !== userId) {
    return sendError(res, 403, 'Apenas participantes da campanha podem criar fichas');
  }

  let sheetData = data;
  
  // Se useTemplate=true, usar template do sistema da campanha
  if (useTemplate) {
    const template = getTemplateForSystem(campaign.system);
    sheetData = JSON.stringify(template);
  }

  const validation = validateCreateSheet({ name, class: characterClass, level, data: sheetData, campaignId });
  if (!validation.isValid) {
    return sendError(res, 400, validation.errors);
  }

  const newSheet = {
    name: name.trim(),
    class: characterClass?.trim() || null,
    level: level || 1,
    data: sheetData,
    userId: userId,
    campaignId: parseInt(campaignId)
  };

  const sheet = await createCharacterSheet(newSheet);
  return sendResponse(res, 201, { data: sheet, message: 'Ficha criada com sucesso!' });
});

// Obter template do sistema da campanha
export const getCampaignTemplate = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const userId = req.user.id;

  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  // TODO: Verificar se usuário participa da campanha
  if (campaign.masterId !== userId) {
    return sendError(res, 403, 'Apenas participantes da campanha podem ver o template');
  }

  const template = getTemplateForSystem(campaign.system);
  
  return sendResponse(res, 200, { 
    data: { 
      system: campaign.system,
      template: template 
    }, 
    message: 'Template obtido com sucesso' 
  });
});

// Listar fichas da campanha
export const getCampaignSheets = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const userId = req.user.id;

  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  // TODO: Verificar se usuário participa da campanha
  if (campaign.masterId !== userId) {
    return sendError(res, 403, 'Apenas participantes da campanha podem ver as fichas');
  }

  const sheets = await findSheetsByCampaign(parseInt(campaignId));
  return sendResponse(res, 200, { data: sheets, message: 'Fichas listadas com sucesso' });
});

// Buscar ficha por ID
export const getSheetById = asyncHandler(async (req, res) => {
  const { sheetId } = req.params;
  const userId = req.user.id;

  const sheet = await findSheetById(parseInt(sheetId));
  if (!sheet) {
    return sendError(res, 404, 'Ficha não encontrada');
  }

  // Verificar permissões: dono da ficha ou mestre da campanha
  if (sheet.userId !== userId && sheet.campaign.masterId !== userId) {
    return sendError(res, 403, 'Você não tem permissão para ver esta ficha');
  }

  return sendResponse(res, 200, { data: sheet, message: 'Ficha encontrada' });
});

// Atualizar ficha
export const updateSheet = asyncHandler(async (req, res) => {
  const { sheetId } = req.params;
  const { name, class: characterClass, level, data } = req.body;
  const userId = req.user.id;

  const validation = validateUpdateSheet({ name, class: characterClass, level, data });
  if (!validation.isValid) {
    return sendError(res, 400, validation.errors);
  }

  const sheet = await findSheetById(parseInt(sheetId));
  if (!sheet) {
    return sendError(res, 404, 'Ficha não encontrada');
  }

  // Verificar permissões: dono da ficha ou mestre da campanha
  if (sheet.userId !== userId && sheet.campaign.masterId !== userId) {
    return sendError(res, 403, 'Você não tem permissão para editar esta ficha');
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name.trim();
  if (characterClass !== undefined) updateData.class = characterClass?.trim() || null;
  if (level !== undefined) updateData.level = level;
  if (data !== undefined) updateData.data = data;

  const updatedSheet = await updateCharacterSheet(parseInt(sheetId), updateData);
  return sendResponse(res, 200, { data: updatedSheet, message: 'Ficha atualizada com sucesso!' });
});

// Deletar ficha
export const deleteSheet = asyncHandler(async (req, res) => {
  const { sheetId } = req.params;
  const userId = req.user.id;

  const sheet = await findSheetById(parseInt(sheetId));
  if (!sheet) {
    return sendError(res, 404, 'Ficha não encontrada');
  }

  // Verificar permissões: dono da ficha ou mestre da campanha
  if (sheet.userId !== userId && sheet.campaign.masterId !== userId) {
    return sendError(res, 403, 'Você não tem permissão para deletar esta ficha');
  }

  await deleteCharacterSheet(parseInt(sheetId));
  return sendResponse(res, 200, { data: null, message: 'Ficha deletada com sucesso!' });
});

// RF19 - Rolar dados da ficha
export const rollDiceFromSheet = asyncHandler(async (req, res) => {
  const { sheetId } = req.params;
  const { expression } = req.body;
  const userId = req.user.id;

  if (!expression) {
    return sendError(res, 400, 'Expressão de dados é obrigatória');
  }

  const sheet = await findSheetById(parseInt(sheetId));
  if (!sheet) {
    return sendError(res, 404, 'Ficha não encontrada');
  }

  // Verificar permissões: dono da ficha ou mestre da campanha
  if (sheet.userId !== userId && sheet.campaign.masterId !== userId) {
    return sendError(res, 403, 'Você não tem permissão para usar esta ficha');
  }

  try {
    const sheetData = JSON.parse(sheet.data);
    const rollResult = rollSheetDice(expression, sheetData);
    
    const result = {
      sheet: {
        id: sheet.id,
        name: sheet.name,
        class: sheet.class,
        level: sheet.level
      },
      roll: rollResult
    };

    return sendResponse(res, 200, { data: result, message: 'Dados rolados com sucesso!' });
  } catch (error) {
    return sendError(res, 400, error.message);
  }
});