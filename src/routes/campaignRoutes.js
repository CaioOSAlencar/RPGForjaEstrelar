import express from 'express';
import { 
  createNewCampaign, 
  listUserCampaigns,
  invitePlayerByEmail,
  getShareableLink,
  acceptInvite,
  joinByRoomCode,
  removePlayer,
  listCampaignPlayers
} from '../controllers/campaignController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// RF07 - Criar campanha (rota protegida)
router.post('/', authenticateToken, createNewCampaign);

// RF10 - Listar campanhas do usuário (rota protegida)
router.get('/', authenticateToken, listUserCampaigns);

// RF08 - Convidar jogador por email (rota protegida)
router.post('/:campaignId/invite', authenticateToken, invitePlayerByEmail);

// RF08 - Gerar link compartilhável (rota protegida)
router.get('/:campaignId/share', authenticateToken, getShareableLink);

// RF09 - Aceitar convite por token (rota protegida)
router.post('/invite/:token/accept', authenticateToken, acceptInvite);

// RF09 - Entrar na campanha por código (rota protegida)
router.post('/join', authenticateToken, joinByRoomCode);

// RF43 - Remover jogador da campanha (rota protegida)
router.delete('/:campaignId/players/:playerId', authenticateToken, removePlayer);

// Listar jogadores da campanha (rota protegida)
router.get('/:campaignId/players', authenticateToken, listCampaignPlayers);

export default router;