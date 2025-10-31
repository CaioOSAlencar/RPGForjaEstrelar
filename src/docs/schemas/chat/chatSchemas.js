export default {
  ChatMessageResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID único da mensagem'
      },
      content: {
        type: 'string',
        description: 'Conteúdo da mensagem'
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        description: 'Timestamp da mensagem'
      },
      campaignId: {
        type: 'integer',
        description: 'ID da campanha'
      },
      sceneId: {
        type: 'integer',
        nullable: true,
        description: 'ID da cena (se aplicável)'
      },
      isPrivate: {
        type: 'boolean',
        description: 'Se a mensagem é privada'
      },
      whisperTo: {
        type: 'integer',
        nullable: true,
        description: 'ID do usuário destinatário (para mensagens privadas)'
      },
      rollData: {
        type: 'string',
        nullable: true,
        description: 'Dados de rolagem em JSON (se aplicável)'
      },
      emoteData: {
        type: 'string',
        nullable: true,
        description: 'Dados de emote em JSON (RF24)'
      },
      whisperUser: {
        type: 'object',
        nullable: true,
        properties: {
          id: {
            type: 'integer',
            description: 'ID do usuário destinatário'
          },
          name: {
            type: 'string',
            description: 'Nome do usuário destinatário'
          }
        },
        description: 'Usuário destinatário da mensagem privada'
      },
      user: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID do usuário'
          },
          name: {
            type: 'string',
            description: 'Nome do usuário'
          }
        }
      }
    }
  },
  DiceRollHistoryItem: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID único da mensagem'
      },
      content: {
        type: 'string',
        description: 'Conteúdo formatado da rolagem'
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        description: 'Timestamp da rolagem'
      },
      isPrivate: {
        type: 'boolean',
        description: 'Se a rolagem foi privada'
      },
      rollData: {
        type: 'object',
        nullable: true,
        properties: {
          expression: {
            type: 'string',
            description: 'Expressão dos dados'
          },
          rolls: {
            type: 'array',
            items: { type: 'integer' },
            description: 'Resultados individuais'
          },
          sum: {
            type: 'integer',
            description: 'Soma dos dados'
          },
          modifier: {
            type: 'integer',
            description: 'Modificador aplicado'
          },
          total: {
            type: 'integer',
            description: 'Resultado final'
          },
          breakdown: {
            type: 'string',
            description: 'Detalhamento da rolagem'
          }
        }
      },
      emoteData: {
        type: 'object',
        nullable: true,
        properties: {
          originalContent: {
            type: 'string',
            description: 'Comando original (/me ...)'
          },
          emoteText: {
            type: 'string',
            description: 'Texto da ação'
          },
          formattedContent: {
            type: 'string',
            description: 'Conteúdo formatado (*Usuário ação*)'
          },
          isEmote: {
            type: 'boolean',
            description: 'Sempre true para emotes'
          }
        }
      },
      user: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID do usuário'
          },
          name: {
            type: 'string',
            description: 'Nome do usuário'
          }
        }
      }
    }
  }
};