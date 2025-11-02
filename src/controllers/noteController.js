import { noteRepository } from '../repositories/noteRepository.js';
import { findCampaignById } from '../repositories/campaignRepository.js';
import { validateCreateNote, validateUpdateNote, validateSearchNotes } from '../validadores/noteValidator.js';
import { sendResponse, sendError } from '../utils/messages.js';
import asyncHandler from 'express-async-handler';

// RF38 - Criar nota com Markdown
export const createNote = asyncHandler(async (req, res) => {
  const validation = validateCreateNote(req.body);
  if (!validation.isValid) {
    return sendError(res, 400, 'Dados inválidos', validation.errors);
  }

  const { title, content, campaignId, isHandout, recipients } = req.body;
  const userId = req.user.id;

  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  const isMaster = campaign.masterId === userId;

  if (!isMaster) {
    return sendError(res, 403, 'Sem permissão para criar notas nesta campanha');
  }

  const note = await noteRepository.create({
    title,
    content,
    campaignId: parseInt(campaignId),
    isHandout: isHandout || false,
    recipients,
    createdBy: userId
  });

  return sendResponse(res, 201, { data: note, message: 'Nota criada com sucesso!' });
});

// RF39 - Listar notas da campanha (incluindo handouts)
export const getNotesByCampaign = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const userId = req.user.id;

  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  const isMaster = campaign.masterId === userId;

  if (!isMaster) {
    return sendError(res, 403, 'Sem permissão para ver notas desta campanha');
  }

  const notes = await noteRepository.findByCampaign(campaignId);
  
  // Filtrar handouts para jogadores
  const filteredNotes = isMaster ? notes : notes.filter(note => {
    if (!note.isHandout) return note.createdBy === userId;
    if (!note.recipients) return true;
    return note.recipients.includes(userId.toString());
  });

  return sendResponse(res, 200, { data: filteredNotes });
});

export const getNoteById = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user.id;

  const note = await noteRepository.findById(noteId);
  if (!note) {
    return sendError(res, 404, 'Nota não encontrada');
  }

  const campaign = await findCampaignById(note.campaignId);
  const isMaster = campaign.masterId === userId;

  if (!isMaster && note.createdBy !== userId) {
    return sendError(res, 403, 'Sem permissão para ver esta nota');
  }

  // Verificar permissão para handouts
  if (note.isHandout && !isMaster && note.recipients && !note.recipients.includes(userId.toString())) {
    return sendError(res, 403, 'Sem permissão para ver este handout');
  }

  return sendResponse(res, 200, { data: note });
});

export const updateNote = asyncHandler(async (req, res) => {
  const validation = validateUpdateNote(req.body);
  if (!validation.isValid) {
    return sendError(res, 400, 'Dados inválidos', validation.errors);
  }

  const { noteId } = req.params;
  const { title, content, isHandout, recipients } = req.body;
  const userId = req.user.id;

  const note = await noteRepository.findById(noteId);
  if (!note) {
    return sendError(res, 404, 'Nota não encontrada');
  }

  const campaign = await findCampaignById(note.campaignId);
  const isMaster = campaign.masterId === userId;
  const isOwner = note.createdBy === userId;

  if (!isMaster && !isOwner) {
    return sendError(res, 403, 'Sem permissão para editar esta nota');
  }

  const updatedNote = await noteRepository.update(noteId, {
    title, content, isHandout, recipients
  });

  return sendResponse(res, 200, { data: updatedNote, message: 'Nota atualizada com sucesso!' });
});

export const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user.id;

  const note = await noteRepository.findById(noteId);
  if (!note) {
    return sendError(res, 404, 'Nota não encontrada');
  }

  const campaign = await findCampaignById(note.campaignId);
  const isMaster = campaign.masterId === userId;
  const isOwner = note.createdBy === userId;

  if (!isMaster && !isOwner) {
    return sendError(res, 403, 'Sem permissão para deletar esta nota');
  }

  await noteRepository.delete(noteId);
  return sendResponse(res, 200, { message: 'Nota deletada com sucesso!' });
});

// RF40 - Buscar notas
export const searchNotes = asyncHandler(async (req, res) => {
  const validation = validateSearchNotes(req.query);
  if (!validation.isValid) {
    return sendError(res, 400, 'Dados inválidos', validation.errors);
  }

  const { campaignId } = req.params;
  const { q } = req.query;
  const userId = req.user.id;

  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  const isMaster = campaign.masterId === userId;

  if (!isMaster) {
    return sendError(res, 403, 'Sem permissão para buscar notas desta campanha');
  }

  const notes = await noteRepository.search(campaignId, q);
  
  // Filtrar resultados para jogadores
  const filteredNotes = isMaster ? notes : notes.filter(note => {
    if (!note.isHandout) return note.createdBy === userId;
    if (!note.recipients) return true;
    return note.recipients.includes(userId.toString());
  });

  return sendResponse(res, 200, { data: filteredNotes });
});