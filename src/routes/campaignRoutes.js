import express from 'express';
import { createNewCampaign, listUserCampaigns } from '../controllers/campaignController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// RF07 - Criar campanha (rota protegida)
router.post('/', authenticateToken, createNewCampaign);

// RF10 - Listar campanhas do usuário (rota protegida)
router.get('/', authenticateToken, listUserCampaigns);

export default router;