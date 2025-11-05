import express from 'express';
import { 
  createNewCampaign, 
  listUserCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
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

// RF09 - Entrar na campanha por código (rota protegida) - ESPECÍFICA PRIMEIRO
router.post('/join', authenticateToken, joinByRoomCode);

// RF09 - Aceitar convite por token (rota protegida) - ESPECÍFICA PRIMEIRO
router.post('/invite/:token/accept', authenticateToken, acceptInvite);

// RF43 - Remover jogador da campanha (rota protegida) - MAIS ESPECÍFICA PRIMEIRO
router.delete('/:id/players/:playerId', authenticateToken, removePlayer);

// Listar jogadores da campanha (rota protegida) - ESPECÍFICA ANTES DE /:id
router.get('/:id/players', authenticateToken, listCampaignPlayers);

// RF08 - Convidar jogador por email (rota protegida) - ESPECÍFICA ANTES DE /:id
router.post('/:id/invite', authenticateToken, invitePlayerByEmail);

// RF08 - Gerar link compartilhável (rota protegida) - ESPECÍFICA ANTES DE /:id
router.get('/:id/share', authenticateToken, getShareableLink);

// Buscar campanha por ID (rota protegida) - GENÉRICA POR ÚLTIMO
router.get('/:id', authenticateToken, getCampaignById);

// Atualizar campanha (rota protegida) - GENÉRICA POR ÚLTIMO
router.put('/:id', authenticateToken, updateCampaign);

// Deletar campanha (rota protegida) - GENÉRICA POR ÚLTIMO
router.delete('/:id', authenticateToken, deleteCampaign);

export default router;