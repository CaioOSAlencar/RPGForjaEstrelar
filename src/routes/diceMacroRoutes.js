import express from 'express';
import { createDiceMacro, getMacrosBySheet, updateDiceMacro, deleteDiceMacro } from '../controllers/diceMacroController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// RF35 - Salvar macros de rolagem na ficha
router.post('/', authenticateToken, createDiceMacro);
router.get('/sheet/:sheetId', authenticateToken, getMacrosBySheet);
router.put('/:macroId', authenticateToken, updateDiceMacro);
router.delete('/:macroId', authenticateToken, deleteDiceMacro);

export default router;