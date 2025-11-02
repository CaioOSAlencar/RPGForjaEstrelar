import jwt from 'jsonwebtoken';
import { validateRegister, validateLogin, validateUpdateProfile } from '../validadores/authValidator.js';
import { findUserByEmail, findUserById, createUser, updateUser } from '../repositories/userRepository.js';
import { ResponseHelper } from '../utils/responseHelper.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import HashSenha from '../utils/hashSenha.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validações
  const validation = validateRegister({ name, email, password });
  if (!validation.isValid) {
    throw ApiError.badRequest('Dados inválidos', validation.errors.map(err => ({ message: err })));
  }

  // Verificar se email já existe (RF04)
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw ApiError.conflict('Email já está cadastrado');
  }

  // Criptografar senha
  const passwordHash = await HashSenha.criarHashSenha(password);

  // Criar usuário com papel "player" automático (RF06)
  const user = await createUser({
    name,
    email,
    passwordHash,
    role: 'player'
  });

  // Gerar token JWT para login automático após registro
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return ResponseHelper.created(res, {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }, 'Usuário cadastrado com sucesso!');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validações
  const validation = validateLogin({ email, password });
  if (!validation.isValid) {
    throw ApiError.badRequest('Dados inválidos', validation.errors.map(err => ({ message: err })));
  }

  // Buscar usuário por email
  const user = await findUserByEmail(email);
  if (!user) {
    throw ApiError.unauthorized('Email ou senha incorretos');
  }

  // Verificar senha
  const isPasswordValid = await HashSenha.compararSenha(password, user.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Email ou senha incorretos');
  }

  // Gerar token JWT (RF03 - 7 dias)
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return ResponseHelper.success(res, {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }, 'Login realizado com sucesso!');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const userId = req.user.userId;

  // Validações
  const validation = validateUpdateProfile({ name, password });
  if (!validation.isValid) {
    throw ApiError.badRequest('Dados inválidos', validation.errors.map(err => ({ message: err })));
  }

  // Verificar se pelo menos um campo foi enviado
  if (!name && !password) {
    throw ApiError.badRequest('Pelo menos um campo (nome ou senha) deve ser informado');
  }

  // Preparar dados para atualização
  const updateData = {};
  
  if (name) {
    updateData.name = name.trim();
  }
  
  if (password) {
    updateData.passwordHash = await HashSenha.criarHashSenha(password);
  }

  // Atualizar usuário
  const updatedUser = await updateUser(userId, updateData);

  return ResponseHelper.success(res, updatedUser, 'Perfil atualizado com sucesso!');
});