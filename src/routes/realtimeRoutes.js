import express from 'express';
import realtimeController from '../controllers/realtimeController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// RF14 - Mover token em tempo real
router.put('/tokens/:tokenId/move', authenticateToken, realtimeController.moveToken);

// RF15 - Rotacionar e redimensionar tokens
router.put('/tokens/:tokenId/rotate', authenticateToken, realtimeController.rotateToken);
router.put('/tokens/:tokenId/resize', authenticateToken, realtimeController.resizeToken);

export default router;