import express from 'express';
import { measureDistance } from '../controllers/distanceController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// RF25 - Medir distância entre tokens
router.post('/measure', authenticateToken, measureDistance);

export default router;