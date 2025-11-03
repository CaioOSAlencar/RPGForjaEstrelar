import express from 'express';
import { 
  createNewScene, 
  listCampaignScenes, 
  getSceneDetails,
  updateSceneSettings,
  deleteSceneById
} from '../controllers/sceneController.js';
import { 
  listSceneTokens,
  addTokenToMap
} from '../controllers/tokenController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { uploadScene } from '../utils/fileUpload.js';

const router = express.Router();

// RF11 - Criar cena com upload de imagem (rota protegida)
router.post('/', authenticateToken, uploadScene, createNewScene);

// Listar cenas de uma campanha (rota protegida)
router.get('/campaign/:campaignId', authenticateToken, listCampaignScenes);

// Obter detalhes de uma cena (rota protegida)
router.get('/:sceneId', authenticateToken, getSceneDetails);

// RF12 - Atualizar configurações da cena (rota protegida)
router.put('/:sceneId', authenticateToken, uploadScene, updateSceneSettings);

// Upload de background da cena (rota protegida)
router.post('/:sceneId/background', authenticateToken, uploadScene, updateSceneSettings);

// RF45 - Deletar cena (rota protegida)
router.delete('/:sceneId', authenticateToken, deleteSceneById);

// Rotas de tokens da cena
router.get('/:sceneId/tokens', authenticateToken, listSceneTokens);
router.post('/:sceneId/tokens', authenticateToken, addTokenToMap);

export default router;