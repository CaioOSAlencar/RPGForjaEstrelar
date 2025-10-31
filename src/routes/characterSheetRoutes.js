import express from 'express';
import {
  createSheet,
  getCampaignSheets,
  getSheetById,
  updateSheet,
  deleteSheet,
  rollDiceFromSheet,
  getCampaignTemplate
} from '../controllers/characterSheetController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Obter template do sistema da campanha
router.get('/template/campaign/:campaignId', authenticateToken, getCampaignTemplate);

// RF18 - Criar ficha de personagem
router.post('/', authenticateToken, createSheet);

// Listar fichas da campanha
router.get('/campaign/:campaignId', authenticateToken, getCampaignSheets);

// Buscar ficha por ID
router.get('/:sheetId', authenticateToken, getSheetById);

// Atualizar ficha
router.put('/:sheetId', authenticateToken, updateSheet);

// Deletar ficha
router.delete('/:sheetId', authenticateToken, deleteSheet);

// RF19 - Rolar dados da ficha
router.post('/:sheetId/roll', authenticateToken, rollDiceFromSheet);

export default router;