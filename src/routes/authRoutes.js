import express from 'express';
import { register } from '../controllers/authController.js';

const router = express.Router();

// RF01 - Cadastro de usuário
router.post('/register', register);

export default router;