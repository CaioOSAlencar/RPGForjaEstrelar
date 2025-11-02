import { diceMacroRepository } from '../repositories/diceMacroRepository.js';
import { findSheetById } from '../repositories/characterSheetRepository.js';
import { findCampaignById } from '../repositories/campaignRepository.js';
import { validateCreateDiceMacro, validateUpdateDiceMacro } from '../validadores/diceMacroValidator.js';
import { sendResponse, sendError } from '../utils/messages.js';
import asyncHandler from 'express-async-handler';

// RF35 - Criar macro de rolagem
export const createDiceMacro = asyncHandler(async (req, res) => {
  const validation = validateCreateDiceMacro(req.body);
  if (!validation.isValid) {
    return sendError(res, 400, 'Dados inválidos', validation.errors);
  }

  const { name, expression, description, characterSheetId } = req.body;
  const userId = req.user.id;

  const sheet = await findSheetById(parseInt(characterSheetId));
  if (!sheet) {
    return sendError(res, 404, 'Ficha não encontrada');
  }

  const campaign = await findCampaignById(sheet.campaignId);
  const isMaster = campaign.masterId === userId;
  const isOwner = sheet.userId === userId;

  if (!isMaster && !isOwner) {
    return sendError(res, 403, 'Sem permissão para criar macros nesta ficha');
  }

  const macro = await diceMacroRepository.create({
    name,
    expression,
    description,
    characterSheetId: parseInt(characterSheetId)
  });

  return sendResponse(res, 201, { data: macro, message: 'Macro criada com sucesso!' });
});

export const getMacrosBySheet = asyncHandler(async (req, res) => {
  const { sheetId } = req.params;
  const userId = req.user.id;

  const sheet = await findSheetById(parseInt(sheetId));
  if (!sheet) {
    return sendError(res, 404, 'Ficha não encontrada');
  }

  const campaign = await findCampaignById(sheet.campaignId);
  const isMaster = campaign.masterId === userId;
  const isOwner = sheet.userId === userId;

  if (!isMaster && !isOwner) {
    return sendError(res, 403, 'Sem permissão para ver macros desta ficha');
  }

  const macros = await diceMacroRepository.findByCharacterSheet(sheetId);
  return sendResponse(res, 200, { data: macros });
});

export const updateDiceMacro = asyncHandler(async (req, res) => {
  const validation = validateUpdateDiceMacro(req.body);
  if (!validation.isValid) {
    return sendError(res, 400, 'Dados inválidos', validation.errors);
  }

  const { macroId } = req.params;
  const { name, expression, description } = req.body;
  const userId = req.user.id;

  const macro = await diceMacroRepository.findById(macroId);
  if (!macro) {
    return sendError(res, 404, 'Macro não encontrada');
  }

  const sheet = await findSheetById(macro.characterSheet.id);
  const campaign = await findCampaignById(sheet.campaignId);
  const isMaster = campaign.masterId === userId;
  const isOwner = sheet.userId === userId;

  if (!isMaster && !isOwner) {
    return sendError(res, 403, 'Sem permissão para editar esta macro');
  }

  const updatedMacro = await diceMacroRepository.update(macroId, {
    name, expression, description
  });

  return sendResponse(res, 200, { data: updatedMacro, message: 'Macro atualizada com sucesso!' });
});

export const deleteDiceMacro = asyncHandler(async (req, res) => {
  const { macroId } = req.params;
  const userId = req.user.id;

  const macro = await diceMacroRepository.findById(macroId);
  if (!macro) {
    return sendError(res, 404, 'Macro não encontrada');
  }

  const sheet = await findSheetById(macro.characterSheet.id);
  const campaign = await findCampaignById(sheet.campaignId);
  const isMaster = campaign.masterId === userId;
  const isOwner = sheet.userId === userId;

  if (!isMaster && !isOwner) {
    return sendError(res, 403, 'Sem permissão para deletar esta macro');
  }

  await diceMacroRepository.delete(macroId);
  return sendResponse(res, 200, { message: 'Macro deletada com sucesso!' });
});