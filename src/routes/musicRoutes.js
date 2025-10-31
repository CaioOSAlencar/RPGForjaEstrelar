import express from 'express';
import { createMusic, getMusicByCampaign, updateMusic, deleteMusic, createSoundEffect, getSoundEffectsByCampaign, deleteSoundEffect } from '../controllers/musicController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// RF28 - Música de fundo
router.post('/background', authenticateToken, createMusic);
router.get('/background/campaign/:campaignId', authenticateToken, getMusicByCampaign);
router.put('/background/:musicId', authenticateToken, updateMusic);
router.delete('/background/:musicId', authenticateToken, deleteMusic);

// RF42 - Efeitos sonoros
router.post('/effects', authenticateToken, createSoundEffect);
router.get('/effects/campaign/:campaignId', authenticateToken, getSoundEffectsByCampaign);
router.delete('/effects/:effectId', authenticateToken, deleteSoundEffect);

export default router;