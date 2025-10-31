import express from 'express';
import { 
  sendMessage, 
  getCampaignMessages,
  deleteMessageById,
  getDiceRollHistory
} from '../controllers/chatController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// RF23 - Enviar mensagem no chat (rota protegida)
router.post('/', authenticateToken, sendMessage);

// RF23 - Listar mensagens da campanha (rota protegida)
router.get('/campaign/:campaignId', authenticateToken, getCampaignMessages);

// RF22 - Histórico de rolagens (rota protegida)
router.get('/campaign/:campaignId/dice-history', authenticateToken, getDiceRollHistory);

// Deletar mensagem (rota protegida)
router.delete('/:messageId', authenticateToken, deleteMessageById);

export default router;