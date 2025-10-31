import express from 'express';
import { 
  createNewToken, 
  listSceneTokens, 
  getTokenDetails,
  updateTokenProperties,
  deleteTokenById,
  listUserTokens
} from '../controllers/tokenController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { uploadToken } from '../utils/fileUpload.js';

const router = express.Router();

// RF13 - Criar token com upload de imagem (rota protegida)
router.post('/', authenticateToken, uploadToken, createNewToken);

// Listar tokens de uma cena (rota protegida)
router.get('/scene/:sceneId', authenticateToken, listSceneTokens);

// Listar tokens do usuário (rota protegida)
router.get('/my-tokens', authenticateToken, listUserTokens);

// Obter detalhes de um token (rota protegida)
router.get('/:tokenId', authenticateToken, getTokenDetails);

// RF14/RF15 - Atualizar propriedades do token (rota protegida)
router.put('/:tokenId', authenticateToken, updateTokenProperties);

// RF45 - Deletar token (rota protegida)
router.delete('/:tokenId', authenticateToken, deleteTokenById);

export default router;