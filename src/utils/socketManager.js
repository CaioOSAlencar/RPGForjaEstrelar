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
    socket.on('join-campaign', this.handleJoinCampaign.bind(this, socket));
    socket.on('send-message', this.handleSendMessage.bind(this, socket));
    socket.on('move-token', this.handleMoveToken.bind(this, socket));
    socket.on('rotate-token', this.handleRotateToken.bind(this, socket));
    socket.on('resize-token', this.handleResizeToken.bind(this, socket));
    socket.on('disconnect', this.handleDisconnect.bind(this, socket));
  }

  handleJoinScene(socket, { sceneId }) {
    socket.join(`scene-${sceneId}`);
    console.log(`Usuário ${socket.userId} entrou na cena ${sceneId}`);
  }

  handleJoinCampaign(socket, { campaignId }) {
    socket.join(`campaign-${campaignId}`);
    console.log(`Usuário ${socket.userId} entrou na campanha ${campaignId}`);
  }

  async handleSendMessage(socket, { content, campaignId, sceneId }) {
    try {
      // Criar mensagem no banco
      const messageData = {
        content: content.trim(),
        campaignId: parseInt(campaignId),
        userId: socket.userId,
        timestamp: new Date(),
        isPrivate: false
      };

      if (sceneId) {
        messageData.sceneId = parseInt(sceneId);
      }

      // Aqui deveria usar o repository, mas para simplificar:
      const message = {
        id: Date.now(),
        ...messageData,
        user: {
          id: socket.userId,
          name: 'Usuário' // TODO: pegar nome real do usuário
        }
      };

      // Broadcast para todos na campanha
      socket.to(`campaign-${campaignId}`).emit('new-message', {
        message,
        sentBy: socket.userId
      });

      // Confirmar para o remetente
      socket.emit('message-sent', { message });
    } catch (error) {
      socket.emit('error', { message: 'Erro ao enviar mensagem' });
    }
  }

  async handleMoveToken(socket, { tokenId, x, y, sceneId }) {
    try {
      const updatedToken = await tokenRepository.updateToken(tokenId, { x, y });
      if (updatedToken) {
        socket.to(`scene-${sceneId}`).emit('token-moved', {
          tokenId, x, y, movedBy: socket.userId
        });
      }
    } catch (error) {
      socket.emit('error', { message: 'Erro ao mover token' });
    }
  }

  async handleRotateToken(socket, { tokenId, rotation, sceneId }) {
    try {
      const updatedToken = await tokenRepository.updateToken(tokenId, { rotation });
      if (updatedToken) {
        socket.to(`scene-${sceneId}`).emit('token-rotated', {
          tokenId, rotation, rotatedBy: socket.userId
        });
      }
    } catch (error) {
      socket.emit('error', { message: 'Erro ao rotacionar token' });
    }
  }

  async handleResizeToken(socket, { tokenId, size, sceneId }) {
    try {
      const updatedToken = await tokenRepository.updateToken(tokenId, { size });
      if (updatedToken) {
        socket.to(`scene-${sceneId}`).emit('token-resized', {
          tokenId, size, resizedBy: socket.userId
        });
      }
    } catch (error) {
      socket.emit('error', { message: 'Erro ao redimensionar token' });
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

  emitToCampaign(campaignId, event, data) {
    if (this.io) {
      this.io.to(`campaign-${campaignId}`).emit(event, data);
    }
  }
}

export default new SocketManager();