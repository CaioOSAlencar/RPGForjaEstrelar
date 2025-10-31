import express from 'express';
import realtimeController from '../controllers/realtimeController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// RF14 - Mover token em tempo real
router.put('/tokens/:tokenId/move', authenticateToken, realtimeController.moveToken);

export default router;