import bcrypt from 'bcryptjs';
import { validateRegister } from '../validadores/authValidator.js';
import { findUserByEmail, createUser } from '../repositories/userRepository.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validações
    const validation = validateRegister({ name, email, password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: validation.errors
      });
    }

    // Verificar se email já existe (RF04)
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já está cadastrado'
      });
    }

    // Criptografar senha
    const passwordHash = await bcrypt.hash(password, 12);

    // Criar usuário com papel "player" automático (RF06)
    const user = await createUser({
      name,
      email,
      passwordHash,
      role: 'player'
    });

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      user
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};