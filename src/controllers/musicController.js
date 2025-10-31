import { musicRepository } from '../repositories/musicRepository.js';
import { findCampaignById } from '../repositories/campaignRepository.js';
import { validateCreateMusic, validateUpdateMusic, validateCreateSoundEffect } from '../validadores/musicValidator.js';
import { sendResponse, sendError } from '../utils/messages.js';
import asyncHandler from 'express-async-handler';

// RF28 - Upload e controle de música de fundo
export const createMusic = asyncHandler(async (req, res) => {
  const validation = validateCreateMusic(req.body);
  if (!validation.isValid) {
    return sendError(res, 400, 'Dados inválidos', validation.errors);
  }

  const { name, url, campaignId, volume, isLooping } = req.body;
  const userId = req.user.id;

  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  if (campaign.masterId !== userId) {
    return sendError(res, 403, 'Apenas o mestre pode adicionar música');
  }

  const music = await musicRepository.createMusic({
    name,
    url,
    campaignId: parseInt(campaignId),
    volume: volume || 0.7,
    isLooping: isLooping !== undefined ? isLooping : true
  });

  return sendResponse(res, 201, { data: music, message: 'Música adicionada com sucesso!' });
});

export const getMusicByCampaign = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const userId = req.user.id;

  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  if (campaign.masterId !== userId) {
    return sendError(res, 403, 'Sem permissão para ver músicas desta campanha');
  }

  const music = await musicRepository.findMusicByCampaign(campaignId);
  return sendResponse(res, 200, { data: music });
});

export const updateMusic = asyncHandler(async (req, res) => {
  const validation = validateUpdateMusic(req.body);
  if (!validation.isValid) {
    return sendError(res, 400, 'Dados inválidos', validation.errors);
  }

  const { musicId } = req.params;
  const userId = req.user.id;

  const music = await musicRepository.findMusicById(musicId);
  if (!music) {
    return sendError(res, 404, 'Música não encontrada');
  }

  if (music.campaign.masterId !== userId) {
    return sendError(res, 403, 'Sem permissão para editar esta música');
  }

  const updatedMusic = await musicRepository.updateMusic(musicId, req.body);
  return sendResponse(res, 200, { data: updatedMusic, message: 'Música atualizada com sucesso!' });
});

export const deleteMusic = asyncHandler(async (req, res) => {
  const { musicId } = req.params;
  const userId = req.user.id;

  const music = await musicRepository.findMusicById(musicId);
  if (!music) {
    return sendError(res, 404, 'Música não encontrada');
  }

  if (music.campaign.masterId !== userId) {
    return sendError(res, 403, 'Sem permissão para deletar esta música');
  }

  await musicRepository.deleteMusic(musicId);
  return sendResponse(res, 200, { message: 'Música deletada com sucesso!' });
});

// RF42 - Efeitos sonoros rápidos
export const createSoundEffect = asyncHandler(async (req, res) => {
  const validation = validateCreateSoundEffect(req.body);
  if (!validation.isValid) {
    return sendError(res, 400, 'Dados inválidos', validation.errors);
  }

  const { name, url, campaignId, volume } = req.body;
  const userId = req.user.id;

  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  if (campaign.masterId !== userId) {
    return sendError(res, 403, 'Apenas o mestre pode adicionar efeitos sonoros');
  }

  const effect = await musicRepository.createSoundEffect({
    name,
    url,
    campaignId: parseInt(campaignId),
    volume: volume || 1.0
  });

  return sendResponse(res, 201, { data: effect, message: 'Efeito sonoro adicionado com sucesso!' });
});

export const getSoundEffectsByCampaign = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const userId = req.user.id;

  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  if (campaign.masterId !== userId) {
    return sendError(res, 403, 'Sem permissão para ver efeitos sonoros desta campanha');
  }

  const effects = await musicRepository.findSoundEffectsByCampaign(campaignId);
  return sendResponse(res, 200, { data: effects });
});

export const deleteSoundEffect = asyncHandler(async (req, res) => {
  const { effectId } = req.params;
  const userId = req.user.id;

  const effect = await musicRepository.findSoundEffectById(effectId);
  if (!effect) {
    return sendError(res, 404, 'Efeito sonoro não encontrado');
  }

  if (effect.campaign.masterId !== userId) {
    return sendError(res, 403, 'Sem permissão para deletar este efeito sonoro');
  }

  await musicRepository.deleteSoundEffect(effectId);
  return sendResponse(res, 200, { message: 'Efeito sonoro deletado com sucesso!' });
});