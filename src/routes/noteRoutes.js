import express from 'express';
import { createNote, getNotesByCampaign, getNoteById, updateNote, deleteNote, searchNotes } from '../controllers/noteController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// RF38 - Criar nota com Markdown
router.post('/', authenticateToken, createNote);

// RF39 - Listar notas da campanha
router.get('/campaign/:campaignId', authenticateToken, getNotesByCampaign);

// RF40 - Buscar notas
router.get('/campaign/:campaignId/search', authenticateToken, searchNotes);

// CRUD de notas
router.get('/:noteId', authenticateToken, getNoteById);
router.put('/:noteId', authenticateToken, updateNote);
router.delete('/:noteId', authenticateToken, deleteNote);

export default router;