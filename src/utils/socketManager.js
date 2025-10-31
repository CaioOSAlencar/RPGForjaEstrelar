import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import * as tokenRepository from '../repositories/tokenRepository.js';

class SocketManager {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
      }
    });

    this.io.use(this.authenticateSocket.bind(this));
    this.io.on('connection', this.handleConnection.bind(this));
  }

  authenticateSocket(socket, next) {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Token não fornecido'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error('Token inválido'));
    }
  }

  handleConnection(socket) {
    console.log(`Usuário conectado: ${socket.userId}`);
    this.connectedUsers.set(socket.userId, socket);

    socket.on('join-scene', this.handleJoinScene.bind(this, socket));
    socket.on('move-token', this.handleMoveToken.bind(this, socket));
    socket.on('disconnect', this.handleDisconnect.bind(this, socket));
  }

  handleJoinScene(socket, { sceneId }) {
    socket.join(`scene-${sceneId}`);
    console.log(`Usuário ${socket.userId} entrou na cena ${sceneId}`);
  }

  async handleMoveToken(socket, { tokenId, x, y, sceneId }) {
    try {
      // Atualizar posição no banco
      const updatedToken = await tokenRepository.updateToken(tokenId, { x, y });
      
      if (updatedToken) {
        // Broadcast para todos na cena
        socket.to(`scene-${sceneId}`).emit('token-moved', {
          tokenId,
          x,
          y,
          movedBy: socket.userId
        });
      }
    } catch (error) {
      socket.emit('error', { message: 'Erro ao mover token' });
    }
  }

  handleDisconnect(socket) {
    console.log(`Usuário desconectado: ${socket.userId}`);
    this.connectedUsers.delete(socket.userId);
  }

  // Método para emitir eventos de outros controllers
  emitToScene(sceneId, event, data) {
    if (this.io) {
      this.io.to(`scene-${sceneId}`).emit(event, data);
    }
  }
}

export default new SocketManager();