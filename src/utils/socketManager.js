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
      // RF20/RF21 - Verificar se é comando de dados
      let rollData = null;
      let processedContent = content.trim();
      let isPrivate = false;
      
      if (this.isDiceCommand(processedContent)) {
        try {
          rollData = this.calculateDiceRoll(processedContent);
          processedContent = `🎲 **${rollData.expression}**: ${rollData.breakdown}`;
        } catch (error) {
          socket.emit('error', { message: error.message });
          return;
        }
      } else if (this.isPrivateDiceCommand(processedContent)) {
        try {
          rollData = this.calculatePrivateDiceRoll(processedContent);
          processedContent = `🔒 **Rolagem Privada para GM - ${rollData.expression}**: ${rollData.breakdown}`;
          isPrivate = true;
        } catch (error) {
          socket.emit('error', { message: error.message });
          return;
        }
      }

      // Criar mensagem no banco
      const messageData = {
        content: processedContent,
        campaignId: parseInt(campaignId),
        userId: socket.userId,
        timestamp: new Date(),
        isPrivate: isPrivate,
        rollData: rollData ? JSON.stringify(rollData) : null
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

      // RF21/RF22 - Broadcast baseado no tipo de mensagem
      if (isPrivate) {
        // Mensagem privada: enviar apenas para o GM
        socket.emit('private-message-sent', { 
          message,
          targetUser: 'GM'
        });
      } else {
        // Mensagem pública: broadcast para todos na campanha
        const eventData = {
          message,
          sentBy: socket.userId
        };
        
        // RF22 - Adicionar animação para rolagens
        if (rollData) {
          eventData.animation = {
            type: 'dice-roll',
            diceCount: rollData.rolls.length,
            rolls: rollData.rolls,
            duration: 2000
          };
        }
        
        socket.to(`campaign-${campaignId}`).emit('new-message', eventData);
        socket.emit('message-sent', { message, animation: eventData.animation });
      }
    } catch (error) {
      socket.emit('error', { message: 'Erro ao enviar mensagem' });
    }
  }

  // RF20/RF21 - Métodos auxiliares para dados
  isDiceCommand(content) {
    return /^\/roll\s+\d+d\d+([+-]\d+)?$/i.test(content.trim());
  }

  isPrivateDiceCommand(content) {
    return /^\/w\s+gm\s+\d+d\d+([+-]\d+)?$/i.test(content.trim());
  }

  calculatePrivateDiceRoll(command) {
    const diceExpression = command.replace(/^\/w\s+gm\s+/i, '').trim();
    const diceRegex = /^(\d+)d(\d+)([+-]\d+)?$/i;
    const match = diceExpression.match(diceRegex);
    
    if (!match) {
      throw new Error('Formato inválido. Use: /w gm XdY+Z (ex: /w gm 1d20+5)');
    }
    
    const numDice = parseInt(match[1]);
    const diceSides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;
    
    if (numDice < 1 || numDice > 20) {
      throw new Error('Número de dados deve ser entre 1 e 20');
    }
    
    if (diceSides < 2 || diceSides > 100) {
      throw new Error('Lados do dado devem ser entre 2 e 100');
    }
    
    const rolls = [];
    for (let i = 0; i < numDice; i++) {
      rolls.push(Math.floor(Math.random() * diceSides) + 1);
    }
    
    const sum = rolls.reduce((total, roll) => total + roll, 0);
    const total = sum + modifier;
    
    return {
      expression: diceExpression,
      rolls,
      sum,
      modifier,
      total,
      breakdown: `${rolls.join(' + ')}${modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : ''} = ${total}`,
      isPrivate: true
    };
  }

  calculateDiceRoll(command) {
    const diceExpression = command.replace(/^\/roll\s+/i, '').trim();
    const diceRegex = /^(\d+)d(\d+)([+-]\d+)?$/i;
    const match = diceExpression.match(diceRegex);
    
    if (!match) {
      throw new Error('Formato inválido. Use: /roll XdY+Z (ex: /roll 2d6+3)');
    }
    
    const numDice = parseInt(match[1]);
    const diceSides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;
    
    if (numDice < 1 || numDice > 20) {
      throw new Error('Número de dados deve ser entre 1 e 20');
    }
    
    if (diceSides < 2 || diceSides > 100) {
      throw new Error('Lados do dado devem ser entre 2 e 100');
    }
    
    const rolls = [];
    for (let i = 0; i < numDice; i++) {
      rolls.push(Math.floor(Math.random() * diceSides) + 1);
    }
    
    const sum = rolls.reduce((total, roll) => total + roll, 0);
    const total = sum + modifier;
    
    return {
      expression: diceExpression,
      rolls,
      sum,
      modifier,
      total,
      breakdown: `${rolls.join(' + ')}${modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : ''} = ${total}`
    };
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

  // RF21 - Emitir evento para usuário específico
  emitToUser(userId, event, data) {
    if (this.io && this.connectedUsers.has(userId)) {
      const userSocket = this.connectedUsers.get(userId);
      userSocket.emit(event, data);
    }
  }
}

export default new SocketManager();