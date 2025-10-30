import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateRegister, validateLogin } from '../validadores/authValidator.js';
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: validation.errors
      });
    }

    // Buscar usuário por email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Gerar token JWT (RF03 - 7 dias)
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};