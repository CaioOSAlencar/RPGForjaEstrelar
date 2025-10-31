import express from 'express';
import { rollDice } from '../controllers/diceController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// RF20 - Testar rolagem de dados (rota protegida)
router.post('/roll', authenticateToken, rollDice);

export default router;