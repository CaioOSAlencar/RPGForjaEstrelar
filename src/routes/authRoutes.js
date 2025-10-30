import express from 'express';
import { register, login, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// RF01 - Cadastro de usuário
router.post('/register', register);

// RF02 - Login de usuário
router.post('/login', login);

// RF05 - Editar perfil (rota protegida)
router.put('/profile', authenticateToken, updateProfile);

export default router;