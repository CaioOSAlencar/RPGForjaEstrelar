import { validateSendMessage, validateGetMessages } from '../validadores/chatValidator.js';
import { 
  createMessage, 
  findMessagesByCampaign,
  findMessageById,
  deleteMessage
} from '../repositories/chatRepository.js';
import { findCampaignById } from '../repositories/campaignRepository.js';
import { sendResponse, sendError } from '../utils/messages.js';
import asyncHandler from 'express-async-handler';
import socketManager from '../utils/socketManager.js';

// RF23 - Enviar mensagem no chat
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, campaignId, sceneId } = req.body;
  const userId = req.user.id;

  // Validações
  const validation = validateSendMessage({ content, campaignId, sceneId });
  if (!validation.isValid) {
    return sendError(res, 400, validation.errors);
  }

  // Verificar se campanha existe e se usuário participa
  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  // TODO: Verificar se usuário participa da campanha
  // Por enquanto, apenas verificar se é o mestre
  if (campaign.masterId !== userId) {
    return sendError(res, 403, 'Apenas participantes da campanha podem enviar mensagens');
  }

  // Preparar dados da mensagem
  const messageData = {
    content: content.trim(),
    campaignId: parseInt(campaignId),
    userId: userId,
    timestamp: new Date(),
    isPrivate: false
  };

  // Se foi especificada uma cena
  if (sceneId) {
    messageData.sceneId = parseInt(sceneId);
  }

  // Criar mensagem
  const message = await createMessage(messageData);

  // Emitir evento WebSocket para outros usuários na campanha
  socketManager.emitToCampaign(parseInt(campaignId), 'new-message', {
    message,
    sentBy: userId
  });

  return sendResponse(res, 201, { data: message, message: 'Mensagem enviada com sucesso!' });
});

// RF23 - Listar mensagens da campanha
export const getCampaignMessages = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const { limit, offset, sceneId } = req.query;
  const userId = req.user.id;

  // Validações
  const validation = validateGetMessages({ campaignId, limit, offset });
  if (!validation.isValid) {
    return sendError(res, 400, validation.errors);
  }

  // Verificar se campanha existe e se usuário participa
  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  // TODO: Verificar se usuário participa da campanha
  if (campaign.masterId !== userId) {
    return sendError(res, 403, 'Apenas participantes da campanha podem ver as mensagens');
  }

  // Buscar mensagens da campanha
  const options = {
    limit: limit ? parseInt(limit) : 50,
    offset: offset ? parseInt(offset) : 0
  };

  if (sceneId) {
    options.sceneId = parseInt(sceneId);
  }

  const messages = await findMessagesByCampaign(parseInt(campaignId), options);

  // Reverter ordem para mostrar mais antigas primeiro
  messages.reverse();

  return sendResponse(res, 200, { data: messages, message: 'Mensagens listadas com sucesso' });
});

// Deletar mensagem (apenas mestre ou autor)
export const deleteMessageById = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  // Buscar mensagem
  const message = await findMessageById(parseInt(messageId));
  if (!message) {
    return sendError(res, 404, 'Mensagem não encontrada');
  }

  // Verificar se usuário pode deletar (mestre ou autor da mensagem)
  if (message.campaign.masterId !== userId && message.user.id !== userId) {
    return sendError(res, 403, 'Você não tem permissão para deletar esta mensagem');
  }

  // Deletar mensagem
  await deleteMessage(parseInt(messageId));

  // Emitir evento WebSocket
  socketManager.emitToCampaign(message.campaignId, 'message-deleted', {
    messageId: parseInt(messageId),
    deletedBy: userId
  });

  return sendResponse(res, 200, { data: null, message: 'Mensagem deletada com sucesso' });
});