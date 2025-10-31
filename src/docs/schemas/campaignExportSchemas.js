export default {
  CampaignExportResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'ID da campanha'
      },
      name: {
        type: 'string',
        description: 'Nome da campanha'
      },
      system: {
        type: 'string',
        description: 'Sistema de RPG'
      },
      description: {
        type: 'string',
        nullable: true,
        description: 'Descrição da campanha'
      },
      scenes: {
        type: 'array',
        description: 'Cenas da campanha',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            backgroundUrl: { type: 'string', nullable: true },
            gridSize: { type: 'integer' },
            gridColor: { type: 'string' },
            snapToGrid: { type: 'boolean' },
            tokens: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                  x: { type: 'number' },
                  y: { type: 'number' },
                  size: { type: 'integer' },
                  rotation: { type: 'number' },
                  imageUrl: { type: 'string', nullable: true },
                  hp: { type: 'integer', nullable: true },
                  maxHp: { type: 'integer', nullable: true },
                  conditions: { type: 'string', nullable: true },
                  isVisible: { type: 'boolean' }
                }
              }
            }
          }
        }
      },
      notes: {
        type: 'array',
        description: 'Notas da campanha',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            content: { type: 'string', nullable: true },
            isHandout: { type: 'boolean' },
            recipients: { type: 'string', nullable: true }
          }
        }
      },
      backgroundMusic: {
        type: 'array',
        description: 'Músicas de fundo',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            url: { type: 'string' },
            volume: { type: 'number' },
            isLooping: { type: 'boolean' }
          }
        }
      },
      soundEffects: {
        type: 'array',
        description: 'Efeitos sonoros',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            url: { type: 'string' },
            volume: { type: 'number' }
          }
        }
      },
      exportedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data da exportação'
      },
      exportedBy: {
        type: 'string',
        description: 'Nome do usuário que exportou'
      }
    }
  }
};