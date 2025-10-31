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
      rollData: {
        type: 'string',
        nullable: true,
        description: 'Dados de rolagem (se aplicável)'
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