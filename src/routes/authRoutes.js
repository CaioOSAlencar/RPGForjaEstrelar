import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// RF01 - Cadastro de usuário
router.post('/register', register);

// RF02 - Login de usuário
router.post('/login', login);

export default router;