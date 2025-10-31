import express from 'express';
import { exportCampaign, importCampaign } from '../controllers/campaignExportController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// RF26 - Exportar campanha
router.get('/export/:campaignId', authenticateToken, exportCampaign);

// RF27 - Importar campanha
router.post('/import', authenticateToken, importCampaign);

export default router;