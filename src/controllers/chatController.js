import { validateSendMessage, validateGetMessages } from '../validadores/chatValidator.js';
import { 
  createMessage, 
  findMessagesByCampaign,
  findMessageById,
  deleteMessage,
  findDiceRollHistory
} from '../repositories/chatRepository.js';
import { findCampaignById } from '../repositories/campaignRepository.js';
import { sendResponse, sendError } from '../utils/messages.js';
import asyncHandler from 'express-async-handler';
import socketManager from '../utils/socketManager.js';
import { isDiceCommand, calculateDiceRoll, isPrivateDiceCommand, calculatePrivateDiceRoll } from '../utils/diceRoller.js';

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

  // RF20/RF21 - Verificar se é comando de dados
  let rollData = null;
  let processedContent = content.trim();
  let isPrivate = false;
  let targetMasterId = null;
  
  if (isDiceCommand(processedContent)) {
    try {
      rollData = calculateDiceRoll(processedContent);
      processedContent = `🎲 **${rollData.expression}**: ${rollData.breakdown}`;
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  } else if (isPrivateDiceCommand(processedContent)) {
    try {
      rollData = calculatePrivateDiceRoll(processedContent);
      processedContent = `🔒 **Rolagem Privada para GM - ${rollData.expression}**: ${rollData.breakdown}`;
      isPrivate = true;
      targetMasterId = campaign.masterId;
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  // Preparar dados da mensagem
  const messageData = {
    content: processedContent,
    campaignId: parseInt(campaignId),
    userId: userId,
    timestamp: new Date(),
    isPrivate: isPrivate,
    targetUserId: targetMasterId,
    rollData: rollData ? JSON.stringify(rollData) : null
  };

  // Se foi especificada uma cena
  if (sceneId) {
    messageData.sceneId = parseInt(sceneId);
  }

  // Criar mensagem
  const message = await createMessage(messageData);

  // RF21/RF22 - Emitir evento WebSocket
  if (isPrivate && targetMasterId) {
    // Mensagem privada: enviar apenas para o GM
    socketManager.emitToUser(targetMasterId, 'new-private-message', {
      message,
      sentBy: userId
    });
    socketManager.emitToUser(userId, 'private-message-sent', {
      message,
      targetUser: 'GM'
    });
  } else {
    // Mensagem pública: enviar para toda a campanha
    const eventData = {
      message,
      sentBy: userId
    };
    
    // RF22 - Adicionar animação para rolagens
    if (rollData) {
      eventData.animation = {
        type: 'dice-roll',
        diceCount: rollData.rolls.length,
        rolls: rollData.rolls,
        duration: 2000
      };
    }
    
    socketManager.emitToCampaign(parseInt(campaignId), 'new-message', eventData);
  }

  // RF22 - Incluir dados de animação na resposta
  const responseData = { message };
  if (rollData) {
    responseData.animation = {
      type: 'dice-roll',
      diceCount: rollData.rolls.length,
      rolls: rollData.rolls,
      duration: 2000
    };
  }
  
  return sendResponse(res, 201, { data: responseData, message: 'Mensagem enviada com sucesso!' });
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
    offset: offset ? parseInt(offset) : 0,
    userId: userId // RF21 - Filtrar mensagens baseado no usuário
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

// RF22 - Listar histórico de rolagens
export const getDiceRollHistory = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const { limit } = req.query;
  const userId = req.user.id;

  // Verificar se campanha existe e se usuário participa
  const campaign = await findCampaignById(parseInt(campaignId));
  if (!campaign) {
    return sendError(res, 404, 'Campanha não encontrada');
  }

  // TODO: Verificar se usuário participa da campanha
  if (campaign.masterId !== userId) {
    return sendError(res, 403, 'Apenas participantes da campanha podem ver o histórico');
  }

  // Buscar histórico de rolagens
  const options = {
    limit: limit ? parseInt(limit) : 20,
    userId: userId
  };

  const rollHistory = await findDiceRollHistory(parseInt(campaignId), options);

  // Processar dados de rolagem
  const processedHistory = rollHistory.map(roll => {
    let parsedRollData = null;
    if (roll.rollData) {
      try {
        parsedRollData = JSON.parse(roll.rollData);
      } catch (error) {
        console.error('Erro ao parsear rollData:', error);
      }
    }
    
    return {
      ...roll,
      rollData: parsedRollData
    };
  });

  return sendResponse(res, 200, { 
    data: processedHistory, 
    message: 'Histórico de rolagens listado com sucesso' 
  });
});