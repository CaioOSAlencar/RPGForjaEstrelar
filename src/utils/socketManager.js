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
    socket.on('update-token-hp', this.handleUpdateTokenHP.bind(this, socket));
    socket.on('measure-distance', this.handleMeasureDistance.bind(this, socket));
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
      // RF20/RF21/RF24 - Verificar tipo de comando
      let rollData = null;
      let emoteData = null;
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
      } else if (this.isEmoteCommand(processedContent)) {
        try {
          const userName = 'Usuário'; // TODO: pegar nome real
          emoteData = this.processEmoteCommand(processedContent, userName);
          processedContent = emoteData.formattedContent;
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
        rollData: rollData ? JSON.stringify(rollData) : null,
        emoteData: emoteData ? JSON.stringify(emoteData) : null
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
        
        // RF22/RF24 - Adicionar dados de animação/emote
        if (rollData) {
          eventData.animation = {
            type: 'dice-roll',
            diceCount: rollData.rolls.length,
            rolls: rollData.rolls,
            duration: 2000
          };
        } else if (emoteData) {
          eventData.emote = {
            type: 'emote',
            originalText: emoteData.emoteText,
            userName: emoteData.formattedContent.match(/\*(.+?)\s/)[1]
          };
        }
        
        socket.to(`campaign-${campaignId}`).emit('new-message', eventData);
        socket.emit('message-sent', { 
          message, 
          animation: eventData.animation,
          emote: eventData.emote 
        });
      }
    } catch (error) {
      socket.emit('error', { message: 'Erro ao enviar mensagem' });
    }
  }

  // RF20/RF21/RF24 - Métodos auxiliares
  isDiceCommand(content) {
    return /^\/roll\s+\d+d\d+([+-]\d+)?$/i.test(content.trim());
  }

  isEmoteCommand(content) {
    return /^\/me\s+.+$/i.test(content.trim());
  }

  processEmoteCommand(content, userName) {
    const emoteText = content.replace(/^\/me\s+/i, '').trim();
    if (!emoteText) {
      throw new Error('Comando /me requer uma ação. Exemplo: /me ataca com fúria');
    }
    const formattedEmote = `*${userName} ${emoteText}*`;
    return {
      originalContent: content,
      emoteText: emoteText,
      formattedContent: formattedEmote,
      isEmote: true
    };
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

  // RF17 - Atualizar HP do token em tempo real
  async handleUpdateTokenHP(socket, { tokenId, hp, maxHp, sceneId }) {
    try {
      const updateData = {};
      if (hp !== undefined) updateData.hp = parseInt(hp);
      if (maxHp !== undefined) updateData.maxHp = parseInt(maxHp);
      
      const updatedToken = await tokenRepository.updateToken(tokenId, updateData);
      if (updatedToken) {
        socket.to(`scene-${sceneId}`).emit('token-hp-updated', {
          tokenId, 
          hp: updatedToken.hp, 
          maxHp: updatedToken.maxHp, 
          updatedBy: socket.userId
        });
      }
    } catch (error) {
      socket.emit('error', { message: 'Erro ao atualizar HP do token' });
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

  // RF25 - Medir distância entre tokens
  async handleMeasureDistance(socket, { token1Id, token2Id, sceneId, unitType = 'feet' }) {
    try {
      // Importar funções necessárias
      const { findTokenById } = await import('../repositories/tokenRepository.js');
      const { findSceneById } = await import('../repositories/sceneRepository.js');
      const { calculateGridDistance, convertGridToGameUnits } = await import('../utils/distanceCalculator.js');

      // Buscar tokens
      const token1 = await findTokenById(parseInt(token1Id));
      const token2 = await findTokenById(parseInt(token2Id));

      if (!token1 || !token2) {
        socket.emit('distance-error', { message: 'Tokens não encontrados' });
        return;
      }

      // Buscar cena
      const scene = await findSceneById(parseInt(sceneId));
      if (!scene) {
        socket.emit('distance-error', { message: 'Cena não encontrada' });
        return;
      }

      // Calcular distâncias
      const gridDistance = calculateGridDistance(token1, token2, scene.gridSize);
      const gameUnits = convertGridToGameUnits(gridDistance, scene.gridSize, unitType);

      const result = {
        token1: { id: token1.id, name: token1.name, position: { x: token1.x, y: token1.y } },
        token2: { id: token2.id, name: token2.name, position: { x: token2.x, y: token2.y } },
        distance: {
          grid: gridDistance,
          gameUnits: gameUnits,
          measurement: `${gameUnits.euclidean} ${gameUnits.unit}`
        }
      };

      // Emitir para todos na cena
      socket.to(`scene-${sceneId}`).emit('distance-measured', {
        ...result,
        measuredBy: socket.userId
      });

      // Confirmar para quem mediu
      socket.emit('distance-result', result);
    } catch (error) {
      socket.emit('distance-error', { message: 'Erro ao medir distância' });
    }
  }
}

export default new SocketManager();