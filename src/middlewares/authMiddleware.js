import jwt from 'jsonwebtoken';
import { ResponseHelper } from '../utils/responseHelper.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return ResponseHelper.unauthorized(res, 'Token de acesso requerido');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email, role }
    next();
  } catch (error) {
    return ResponseHelper.forbidden(res, 'Token inválido ou expirado');
  }
};